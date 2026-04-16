import { config } from "dotenv";
config({ path: ".env.local" });
import { prisma } from './src/lib/prisma'

async function main() {
  try {
    const start = Date.now()
    const result = await prisma.user.findFirst()
    const end = Date.now()
    console.log("PRISMA_TEST_RESULT_SUCCESS")
    console.log(`Executed in ${end - start}ms`)
    console.log("Found user:", result)
  } catch (error) {
    console.error("PRISMA_TEST_RESULT_FAILED")
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
