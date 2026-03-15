import cron from "node-cron";
import db from "./db";

async function deleteExpiredCodes() {
	console.log('Running Cron Job: "Delete Expired Codes"');

	try {
		await db.query("delete from codes where expires_at <= NOW()");
		console.log("Deleted Expired Codes Successfully");
	} catch (e) {
		console.error(e);
	}
}

export function scheduleCronJobs() {
	cron.schedule("*/5 * * * *", deleteExpiredCodes, {
		timezone: "Asia/Karachi",
	});
}
