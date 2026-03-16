import { Redis } from "ioredis";

const redisClient = new Redis(process.env.REDIS_URI as string, {
	maxRetriesPerRequest: null, // needed for bullmq to work properly, otherwise max retries error may come for long tasks
});

redisClient.on("error", (err) => {
	console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
	console.log("Connected to Redis Client");
});

export default redisClient;
