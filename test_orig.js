const { Client } = require('pg');

async function testOriginal() {
  const connectionString = `postgresql://postgres:X7HbvPjBiBy3xNro@db.sasfsvsdaylunterhqkf.supabase.co:5432/postgres`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected!`);
    await client.query("SELECT 1");
    console.log(`[SUCCESS] Query worked!`);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.message);
  }
}

testOriginal();
