const { Client } = require('pg');

async function testWithSsl() {
  const connectionString = `postgresql://postgres.sasfsvsdaylunterhqkf:2nUz5RyjOhxwpOqH@aws-1-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require`;
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    console.log(`[SUCCESS] Connected!`);
    await client.end();
  } catch (err) {
    console.log(`[FAIL]`, err.code, err.message);
  }
}

testWithSsl();
