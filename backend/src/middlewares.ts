import redisClient from "./cache";
import { Request, Response, NextFunction } from "express";
import { RATE_LIMIT, RATE_LIMIT_WINDOW_SEC } from "./constants";

export async function rateLimiter(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const key = "rate:" + req.ip;
	const requests = await redisClient.incr(key);
	if (requests === 1) {
		await redisClient.expire(key, RATE_LIMIT_WINDOW_SEC);
	}

	if (requests > RATE_LIMIT) {
		return res
			.status(429)
			.json({ error: "Too many requests. Please try again later." });
	}

	next();
}
