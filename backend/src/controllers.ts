import { type Request, type Response } from "express";
import base62 from "base62";

import db from "./db";
import cache from "./cache";
import { isValidURL } from "./utils";
import { CODE_CACHE_EXPIRES_SEC } from "./constants";
import { clickQueue } from "./queues";

export async function shorten(req: Request, res: Response) {
	console.log("Backend Instance:", process.env.HOSTNAME);

	try {
		const url: string = req.body["url"];
		if (!isValidURL(url))
			return res.status(400).json({ error: "Invalid URL" });

		const expires: string = req.body["expires"];
		let expiresAt: Date | null = new Date();

		if (expires === "1 min") {
			expiresAt.setMinutes(expiresAt.getMinutes() + 1);
		} else if (expires === "1 day") {
			expiresAt.setDate(expiresAt.getDate() + 1);
		} else if (expires === "1 week") {
			expiresAt.setDate(expiresAt.getDate() + 7);
		} else if (expires === "1 month") {
			expiresAt.setDate(expiresAt.getDate() + 30);
		} else if (expires === "1 year") {
			expiresAt.setDate(expiresAt.getDate() + 365);
		} else {
			expiresAt = null;
		}

		// insert record in db, get id/number to encode to base62 for short code

		const { rows } = await db.query(
			"insert into codes (code, url, ip, expires_at) values ($1, $2, $3, $4) returning id",
			["temp", url, req.ip, expiresAt], // no code yet
		);

		const { id } = rows[0];

		// encode id to base62
		const code = base62.encode(id);

		// set in cache
		await cache.set(`code:${code}`, url, "EX", CODE_CACHE_EXPIRES_SEC); // EX -> seconds

		// update the code
		await db.query("update codes set code = $1 where id = $2", [code, id]);

		res.status(201).json({ code });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function visit(req: Request, res: Response) {
	console.log("Backend Instance:", process.env.HOSTNAME);

	try {
		const code = req.params.code as string;
		// console.log(code);

		// cache check
		let redirect_url = "";
		const cached_url = await cache.get(`code:${code}`);
		if (cached_url) {
			console.log("Cache Hit!");
			redirect_url = cached_url;
		} else {
			// db hit
			const { rows, rowCount } = await db.query(
				"select url from codes where code = $1 limit 1",
				[code],
			);

			if (!rowCount) {
				return res.status(404).json({ error: "URL Not Found" });
			}

			const { url } = rows[0];
			// res.json({ url });
			console.log("DB Hit!");

			await cache.set(`code:${code}`, url, "EX", CODE_CACHE_EXPIRES_SEC);

			redirect_url = url;
		}

		res.redirect(redirect_url);

		// update clicks
		// todo: use cache for clicks and automate script for db updation

		// add job to queue
		await clickQueue.add(
			"record-click",
			{
				code: code,
				ip: req.ip,
				userAgent: req.headers["user-agent"] || "unknown",
			},
			{
				// optional... 1s -> 2s -> 4s -> 8s -> 16s
				attempts: 5,
				backoff: {
					type: "exponential",
					delay: 1000,
				},
			},
		);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function health(req: Request, res: Response) {
	console.log("Backend Instance:", process.env.HOSTNAME);

	res.json({ status: "ok" });
}

export async function checkClicks(req: Request, res: Response) {
	console.log("Backend Instance:", process.env.HOSTNAME);

	try {
		// todo: check if ip is of owner
		const { rows } = await db.query(
			"select count(id) from clicks where code = $1",
			[req.params.code],
		); // todo: where ip != req.ip and also unique counts check
		res.json({ clicks: rows[0].count });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
