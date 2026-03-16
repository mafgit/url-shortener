import { Queue } from "bullmq";
import redisClient from "./cache";

export const clickQueue = new Queue("clicks", {
	connection: redisClient,
});

export const updateCodeQueue = new Queue("update_code", {
	connection: redisClient,
});
