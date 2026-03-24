import cron from "node-cron";
import db from "./db";
import redisClient from "./cache";

async function deleteExpiredCodes() {
	console.log('Running Cron Job: "Delete Expired Codes"');

	try {
		const { rows } = await db.query(
			"delete from codes where expires_at <= NOW() returning code",
		);

		if (rows.length > 0) {
			const keys = rows.map((r) => r.code);
			redisClient.del(keys);
		}

		console.log(
			"Deleted Expired Codes Successfully",
			new Date().toLocaleTimeString(),
		);
	} catch (e) {
		console.error(e);
	}
}

export function scheduleCronJobs() {
	cron.schedule("*/5 * * * *", deleteExpiredCodes, {
		timezone: "Asia/Karachi",
	});
}
