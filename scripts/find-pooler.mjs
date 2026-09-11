import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const regions = [
  'ap-south-1',
  'us-east-1',
  'us-west-1',
  'eu-central-1',
  'eu-west-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'sa-east-1',
];

const pass = 'Kavyasri%40eluru';
const proj = 'epztbpyjayaoersydecn';

async function testConnection(host, port, user) {
  const conn = `postgresql://${user}:${pass}@${host}:${port}/postgres`;
  const client = new pg.Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    await client.connect();
    console.log(`🎉 CONNECTED SUCCESS via ${host}:${port} as ${user}!`);
    return client;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log('🔍 Testing pooler regions...');
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    // Try transaction mode (6543) and session mode (5432)
    for (const port of [6543, 5432]) {
      // User format for pooler: postgres.projectref
      const client = await testConnection(host, port, `postgres.${proj}`);
      if (client) {
        console.log('📜 Reading schema.sql...');
        const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
        console.log('🚀 Executing database schema migrations...');
        await client.query(schemaSql);
        console.log('✅ Schema migration completed successfully!');

        console.log('🌱 Reading seed.sql...');
        const seedSql = fs.readFileSync(path.join(__dirname, '../supabase/seed.sql'), 'utf8');
        console.log('🚀 Executing database seed data insertion...');
        await client.query(seedSql);
        console.log('✅ Database seeded successfully!');

        await client.end();
        process.exit(0);
      }
    }
  }
  console.log('❌ None of the pooler hosts succeeded.');
  process.exit(1);
}

main();
