import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proj = 'epztbpyjayaoersydecn';
const pass = 'Kavyasri%40eluru';

async function main() {
  const host = `db.${proj}.supabase.co`;
  console.log(`🔍 Resolving IPv6/IPv4 records for ${host}...`);

  let addrs = [];
  try {
    const v6 = await dns.promises.resolve6(host);
    console.log('Found IPv6 addresses:', v6);
    addrs.push(...v6);
  } catch (e) {
    console.log('No IPv6 records:', e.message);
  }

  try {
    const v4 = await dns.promises.resolve4(host);
    console.log('Found IPv4 addresses:', v4);
    addrs.push(...v4);
  } catch (e) {
    console.log('No IPv4 records:', e.message);
  }

  // Also try Supabase shared poolers with format postgres
  const sharedPoolers = [
    'db.epztbpyjayaoersydecn.supabase.co',
    'aws-0-ap-south-1.pooler.supabase.com',
    'aws-0-eu-central-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com',
    'aws-0-us-west-1.pooler.supabase.com',
    'aws-0-ap-southeast-1.pooler.supabase.com',
    'aws-0-sa-east-1.pooler.supabase.com',
  ];

  for (const h of sharedPoolers) {
    for (const port of [5432, 6543]) {
      for (const u of ['postgres', `postgres.${proj}`]) {
        console.log(`🔌 Trying ${u}@${h}:${port}...`);
        const client = new pg.Client({
          host: h,
          port: port,
          user: u,
          password: 'Kavyasri@eluru',
          database: 'postgres',
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 4000,
        });

        try {
          await client.connect();
          console.log(`🎉 SUCCESS! Connected to Supabase via ${u}@${h}:${port}!`);

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
        } catch (err) {
          console.log(`   └ Failed: ${err.message}`);
          try { await client.end(); } catch {}
        }
      }
    }
  }

  console.log('❌ All connection attempts failed.');
  process.exit(1);
}

main();
