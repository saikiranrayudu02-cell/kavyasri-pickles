import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proj = 'epztbpyjayaoersydecn';
const pass = 'Kavyasri@eluru';
const host = 'aws-0-ap-northeast-2.pooler.supabase.com';

async function main() {
  console.log(`🔌 Connecting to Supabase ap-northeast-2 pooler (${host})...`);

  for (const port of [6543, 5432]) {
    for (const user of [`postgres.${proj}`, 'postgres']) {
      console.log(`Trying ${user}@${host}:${port}...`);
      const client = new pg.Client({
        host,
        port,
        user,
        password: pass,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
      });

      try {
        await client.connect();
        console.log(`🎉 SUCCESS! Connected to live Supabase DB (${user}@${host}:${port})!`);

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

        await client.end();
        process.exit(0);
      } catch (err) {
        console.log(`   └ Failed: ${err.message}`);
        try { await client.end(); } catch {}
      }
    }
  }

  console.log('❌ Failed to connect to ap-northeast-2 pooler.');
  process.exit(1);
}

main();
