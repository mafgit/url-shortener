import { Pool } from "pg";

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: parseInt(process.env.DB_PORT || "5432"),
});

pool.on("error", (err) => {
	console.error("Error in database connection pool:", err);
	process.exit(-1);
});

export default pool;
