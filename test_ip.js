const { Client } = require('pg');

async function testIp() {
  const connectionString = `postgresql://postgres:X7HbvPjBiBy3xNro@[2600:1f16:1cd0:3341:7c78:3217:f535:febe]:5432/postgres`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 10000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected to IPv6 directly!`);
    const res = await client.query("SELECT 1");
    console.log(`[SUCCESS] Query worked!`, res.rows);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.message);
  }
}

testIp();
