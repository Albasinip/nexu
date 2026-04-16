const { Client } = require('pg');

async function testSingle() {
  console.log("Testing eu-central-1...");
  const connectionString = `postgresql://postgres.sasfsvsdaylunterhqkf:X7HbvPjBiBy3xNro@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 15000 });
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

testSingle();
