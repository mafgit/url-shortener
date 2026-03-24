import { Pool } from "pg";

const pool = new Pool({
	// user: process.env.DB_USER,
	// host: process.env.DB_HOST,
	// database: process.env.DB_NAME,
	// password: process.env.DB_PASSWORD,
	// port: parseInt(process.env.DB_PORT || "5432"),
	connectionString: process.env.POSTGRES_URL,
});

pool.on("error", (err) => {
	console.error("Error in PostgreSQL Connection Pool:", err);
	process.exit(-1);
});

// optional: test connection
pool.query("select now()", (err, res) => {
	if (err) {
		console.error("Error Connecting to PostgreSQL", err);
	} else {
		console.log("Connected to PostgreSQL");
	}
});

export default pool;
