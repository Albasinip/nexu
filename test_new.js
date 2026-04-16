const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testNew() {
  console.log("Testing new url:", process.env.DATABASE_URL);
  const client = new Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected!`);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.code, err.message);
  }
}

testNew();
