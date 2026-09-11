import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epztbpyjayaoersydecn.supabase.co';
const supabaseKey = 'sb_publishable_8StvxGhaUJD5Zxuj5Q8Vmg_oI51uXzU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('⚡ Checking connection to Supabase project...');
  const { data, error } = await supabase.from('products').select('count', { count: 'exact' });
  if (error) {
    console.log('Result message:', error.message, '| code:', error.code);
  } else {
    console.log('✅ Connection Successful! Found products count:', data);
  }
}

check();
