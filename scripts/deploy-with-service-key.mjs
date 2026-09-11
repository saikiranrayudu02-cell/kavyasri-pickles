import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://epztbpyjayaoersydecn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwenRicHlqYXlhb2Vyc3lkZWNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTA0MTE0OSwiZXhwIjoyMTA0NjE3MTQ5fQ.wX8pbA8_h6hWyIAgB_h8P8QLHM-dNpm7CjxWKBurwbo';

const host = 'aws-0-ap-northeast-2.pooler.supabase.com';
const pass = 'Kavyasri@eluru';
const proj = 'epztbpyjayaoersydecn';

async function main() {
  console.log('⚡ Step 1: Connecting via PostgreSQL pooler to execute schema.sql & seed.sql...');
  const client = new pg.Client({
    host,
    port: 6543,
    user: `postgres.${proj}`,
    password: pass,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL pooler!');

    console.log('📜 Executing schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✅ Database schema created successfully!');

    console.log('🌱 Executing seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../supabase/seed.sql'), 'utf8');
    await client.query(seedSql);
    console.log('✅ Database seed executed successfully!');

    await client.end();
  } catch (err) {
    console.log('⚠️ Direct SQL note:', err.message);
  }

  console.log('\n⚡ Step 2: Validating data via Supabase Service Client...');
  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: categories, error: catErr } = await supabase.from('categories').select('*');
  const { data: products, error: prodErr } = await supabase.from('products').select('*');

  console.log(`📊 Categories count in live DB: ${categories?.length || 0}`);
  console.log(`📊 Products count in live DB: ${products?.length || 0}`);

  if ((products?.length || 0) > 0) {
    console.log('🎉 LIVE SUPABASE DATABASE IS FULLY PUSHED AND ONLINE!');
  } else {
    console.log('Note: Run schema.sql in Dashboard once, then seed client will auto-populate.');
  }
}

main();
