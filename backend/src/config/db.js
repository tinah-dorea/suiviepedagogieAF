import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Test de connexion
pool.connect()
  .then(() => console.log("✅ Connexion PostgreSQL réussie"))
  .catch((err) => console.error("❌ Erreur de connexion :", err));

export default pool;
