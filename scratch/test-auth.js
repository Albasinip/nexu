const { Client } = require('pg');

async function test(user) {
  const client = new Client({
    user: user,
    password: '2nUz5RyjOhxwpOqH',
    host: 'aws-1-us-east-2.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`SUCCESS with user: ${user}`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`FAILED with user: ${user}. Error: ${err.message}`);
    return false;
  }
}

async function run() {
  await test('postgres.sasfsvsdaylunterhqkf');
  await test('postgres');
  await test('sasfsvsdaylunterhqkf');
}

run();
