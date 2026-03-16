import { Worker } from "bullmq";
import db from "./db";
import redisClient from "./cache";

const clickWorker = new Worker(
	"clicks",
	async (job) => {
		console.log("Processing job:", job.name, job.id);
		const { code, ip, userAgent } = job.data;

		await db.query(
			"insert into clicks (code, ip, user_agent) values ($1, $2, $3)",
			[code, ip, userAgent],
		);
	},
	{
		connection: redisClient,
		concurrency: 5, // optional: for concurrent processing of multiple jobs
	},
);

// just for logging failures or retries or completions or picking up of jobs...
	clickWorker.on("completed", (job) => {
		console.log(`Job completed: ${job.name} (${job.id})`);
	});

	clickWorker.on("failed", (job, err) => {
		console.error(`Job failed: ${job?.name} (${job?.id}), error:`, err);
		if (job && job.opts && job.opts.attempts) {
			if (job?.attemptsMade > job?.opts?.attempts) {
				console.error(
					`Job ${job.name} (${job.id}) has exhausted all retry attempts.`,
				);
			}
		}
	});

	clickWorker.on("active", (job) => {
		if (job.attemptsMade === 0) {
			console.log(`Picked up job:${job.name} (${job.id})`);
		} else {
			console.log(
				`Retrying job:${job.name} (${job.id}), attempt ${job.attemptsMade + 1}`,
			);
		}
	});

export { clickWorker };
