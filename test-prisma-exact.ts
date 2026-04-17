import { prisma } from './src/lib/prisma';

async function main() {
  const start = Date.now();
  try {
    await prisma.user.findFirst();
    const ms = Date.now() - start;
    console.log("PRISMA_TEST_RESULT_SUCCESS");
    console.log(`Executed in ${ms}ms`);
  } catch (err) {
    console.error("[FAIL] Error exacto:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
