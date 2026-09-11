import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase PostgreSQL direct connection details
const connectionString = 'postgresql://postgres:Kavyasri%40eluru@db.epztbpyjayaoersydecn.supabase.co:5432/postgres';

async function main() {
  console.log('🔌 Connecting to live Supabase PostgreSQL database...');
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to Supabase PostgreSQL!');

    console.log('📜 Reading schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
    console.log('🚀 Executing database schema migrations...');
    await client.query(schemaSql);
    console.log('✅ Schema migration completed successfully!');

    console.log('🌱 Reading seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../supabase/seed.sql'), 'utf8');
    console.log('🚀 Executing database seed data insertion...');
    await client.query(seedSql);
    console.log('✅ Database seeded successfully with 12 pickles, categories, orders & settings!');

  } catch (err) {
    console.error('❌ Error executing database script:', err);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔒 Connection closed.');
  }
}

main();
