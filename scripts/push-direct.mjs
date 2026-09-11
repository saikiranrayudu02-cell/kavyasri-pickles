import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set default DNS resolution order to IPv6 first / try IPv6
dns.setDefaultResultOrder('verbatim');

const proj = 'epztbpyjayaoersydecn';
const pass = 'Kavyasri%40eluru';

async function tryConnect(connString, label) {
  console.log(`🔌 Attempting connection: ${label}...`);
  const client = new pg.Client({
    connectionString: connString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    console.log(`🎉 SUCCESS! Connected via ${label}`);
    
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
    return true;
  } catch (err) {
    console.log(`❌ ${label} failed:`, err.message);
    try { await client.end(); } catch {}
    return false;
  }
}

async function main() {
  console.log('🔍 Resolving hostnames for project:', proj);

  // 1. Direct host
  const directConn = `postgresql://postgres:${pass}@db.${proj}.supabase.co:5432/postgres`;
  if (await tryConnect(directConn, 'Direct db.project.supabase.co')) process.exit(0);

  // 2. Pooler hosts (session & transaction)
  const poolerHosts = [
    'aws-0-ap-south-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com',
    'aws-0-eu-central-1.pooler.supabase.com',
    'aws-0-ap-southeast-1.pooler.supabase.com',
    'aws-0-us-west-1.pooler.supabase.com',
  ];

  for (const host of poolerHosts) {
    // Session mode (5432)
    const sessionConn = `postgresql://postgres.${proj}:${pass}@${host}:5432/postgres`;
    if (await tryConnect(sessionConn, `Pooler Session ${host}:5432`)) process.exit(0);

    // Transaction mode (6543)
    const txConn = `postgresql://postgres.${proj}:${pass}@${host}:6543/postgres`;
    if (await tryConnect(txConn, `Pooler Tx ${host}:6543`)) process.exit(0);
  }

  console.log('❌ All connection attempts failed.');
  process.exit(1);
}

main();
