import { type Request, type Response } from "express";
import base62 from "base62";

import db from "./db";
import cache from "./cache";
import { isValidURL } from "./utils";
import {
	CODE_CACHE_EXPIRES_SEC,
	SHORTEN_RATE_LIMIT,
	SHORTEN_RATE_LIMIT_EXPIRES_SEC,
} from "./constants";

export async function shorten(req: Request, res: Response) {
	try {
		// if rate limit reached
		const rate_limit_key = `gen_ip:${req.ip}`;
		const gen_count = await cache.get(rate_limit_key);
		if (gen_count && parseInt(gen_count) >= SHORTEN_RATE_LIMIT) {
			return res
				.status(429)
				.json({ error: "Rate limit exceeded! Try again later." });
		}

		const url: string = req.body["url"];
		if (!isValidURL(url))
			return res.status(400).json({ error: "Invalid URL" });

		const expires: string = req.body["expires"];
		let expiresAt: Date | null = new Date();
		if (expires === "1d") {
			expiresAt.setDate(expiresAt.getDate() + 1);
		} else if (expires === "1w") {
			expiresAt.setDate(expiresAt.getDate() + 7);
		} else if (expires === "1m") {
			expiresAt.setDate(expiresAt.getDate() + 30);
		} else if (expires === "1y") {
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
		await cache.set(`code:${code}`, url, { EX: CODE_CACHE_EXPIRES_SEC }); // EX -> seconds

		// for rate limiting
		if (!gen_count) {
			await cache.set(rate_limit_key, 1, {
				EX: SHORTEN_RATE_LIMIT_EXPIRES_SEC,
			});
			// race condition can happen: i.e. two links might be generated even if one limit is left, if at same time
			// because two separate operations: .get and .set
		} else {
			await cache.incr(rate_limit_key);
		}

		res.status(201).json({ code });

		// update the code
		await db.query("update codes set code = $1 where id = $2", [code, id]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function visit(req: Request, res: Response) {
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

			await cache.set(`code:${code}`, url, {
				EX: CODE_CACHE_EXPIRES_SEC,
			});

			redirect_url = url;
		}

		// update clicks
		// todo: use cache for clicks and automate script for db updation
		await db.query(
			"insert into clicks (code, ip, user_agent) values ($1, $2, $3)",
			[code, req.ip, req.headers["user-agent"]],
		);

		res.redirect(redirect_url);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function health(req: Request, res: Response) {
	res.json({ status: "ok" });
}

export async function checkClicks(req: Request, res: Response) {
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
