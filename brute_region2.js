const { Client } = require('pg');

async function testPooler() {
  const connectionString = `postgresql://postgres:X7HbvPjBiBy3xNro@db.sasfsvsdaylunterhqkf.supabase.co:6543/postgres?pgbouncer=true`;
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connection works on pooler built-in!`);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.message);
  }
}

testPooler();
