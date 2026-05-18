import { Pool } from 'pg';
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function run() {
  console.log('Connecting to database:', process.env.DATABASE_URL);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  try {
    console.log('Checking if is_onboarded column exists...');
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='is_onboarded';
    `);

    if (res.rowCount === 0) {
      console.log('Column is_onboarded does not exist. Adding column...');
      await client.query('ALTER TABLE "users" ADD COLUMN "is_onboarded" boolean DEFAULT false NOT NULL;');
      console.log('Column is_onboarded added successfully!');
    } else {
      console.log('Column is_onboarded already exists.');
    }
  } catch (error) {
    console.error('Error running migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
