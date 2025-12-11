import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'suivie_pedagogique_af',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.stack);
  } else {
    console.log('Connexion à la base de données réussie');
    release();
  }
});

export { pool };
