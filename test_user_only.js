const { Client } = require('pg');

async function testUserOnly() {
  const connectionString = `postgresql://postgres:2nUz5RyjOhxwpOqH@aws-1-us-east-2.pooler.supabase.com:5432/postgres`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected with username 'postgres'!`);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.code, err.message);
  }
}

testUserOnly();
