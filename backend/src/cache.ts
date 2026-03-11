import { createClient } from "redis";

const client = createClient({
	url: process.env.REDIS_URI,
});

client.on("error", (err) => {
	console.error("Redis Client Error:", err);
});

client.connect().then(() => {
	console.log("Connected to Redis Client");
});

export default client;
