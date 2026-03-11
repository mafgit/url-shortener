import { type Request, type Response } from "express";
import base62 from "base62";

import db from "./db";
import cache from "./cache";
import { isValidURL } from "./utils";

export async function shorten(req: Request, res: Response) {
	try {
		const url: string = req.body["url"];

		// url regex
		if (!isValidURL(url))
			return res.status(400).json({ error: "Invalid URL" });

		// insert in db, get id
		const { rows } = await db.query(
			"insert into codes (code, url) values ($1, $2) returning id",
			["temp", url], // no code yet
		);

		const { id } = rows[0];

		// encode id to base62
		const code = base62.encode(id);

		// set in cache
		await cache.set(code, url, { EX: 20 }); // EX -> seconds

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
		const cached_url = await cache.get(code);
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

		await cache.set(code, url, { EX: 20 });

		res.redirect(url);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
