const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { migrate } = require('drizzle-orm/node-postgres/migrator');
const path = require('path');

// Di production, DATABASE_URL akan dipass sebagai env variable.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set!');
  process.exit(1);
}

async function runMigrations() {
  console.log('Connecting to database for migrations...');
  const pool = new Pool({
    connectionString: connectionString,
    max: 1,
    connectionTimeoutMillis: 5000,
  });
  const db = drizzle(pool);

  try {
    console.log('Running Drizzle migrations...');
    // Arahkan ke folder migrations yang kita copy ke container
    const migrationsFolder = path.join(__dirname, '../lib/db/migrations');
    await migrate(db, { migrationsFolder });
    console.log('Migrations applied successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
