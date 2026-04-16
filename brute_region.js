const { Client } = require('pg');

async function testRegion(region) {
  const connectionString = `postgresql://postgres.sasfsvsdaylunterhqkf:X7HbvPjBiBy3xNro@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log(`[SUCCESS] Region found: ${region}`);
    await client.end();
    return true;
  } catch (err) {
    if (err.code !== 'ENOTFOUND' && err.code !== 'ECONNREFUSED') {
       console.log(`[AUTH FAIL] Region ${region} exists but auth failed:`, err.message);
       return true; // The region is correct, but password might differ.
    }
    return false;
  }
}

async function run() {
  const regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'eu-west-1', 'eu-west-2', 'eu-central-1', 'sa-east-1',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-south-1',
    'ca-central-1'
  ];
  for (const reg of regions) {
    const res = await testRegion(reg);
    if (res) process.exit(0);
  }
  for (const reg of regions) {
    // Try aws-1
    const connectionString = `postgresql://postgres.sasfsvsdaylunterhqkf:X7HbvPjBiBy3xNro@aws-1-${reg}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    const client = new Client({ connectionString });
    try {
      await client.connect();
      console.log(`[SUCCESS] Region found: aws-1-${reg}`);
      await client.end();
      process.exit(0);
    } catch(err) {
      if (err.code !== 'ENOTFOUND' && err.code !== 'ECONNREFUSED') {
        console.log(`[AUTH FAIL] Region aws-1-${reg} exists but auth failed.`, err.message);
        process.exit(0);
      }
    }
  }
  console.log("None worked.");
}

run();
