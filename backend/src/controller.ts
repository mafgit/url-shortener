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

		// insert record in db, get id/number to encode to base62 for short code
		const { rows } = await db.query(
			"insert into codes (code, url) values ($1, $2) returning id",
			["temp", url], // no code yet
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

		// cache check
		const cached_url = await cache.get(`code:${code}`);
		if (cached_url) {
			console.log("Cache Hit!");
			// res.json({ url });
			return res.redirect(cached_url);
		}

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

		await cache.set(`code:${code}`, url, { EX: CODE_CACHE_EXPIRES_SEC });

		res.redirect(url);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

export async function health(req: Request, res: Response) {
	res.json({ status: "ok" });
}
