const { Client } = require('pg');

async function testUser() {
  console.log("Testing user postgres only...");
  const connectionString = `postgresql://postgres:X7HbvPjBiBy3xNro@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected!`);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.message);
  }
}

testUser();
