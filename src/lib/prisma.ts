import { PrismaClient } from '@prisma/client'
import pkg from 'pg'
const { Pool } = pkg
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.warn('[PRISMA] Warning: DATABASE_URL is not defined in environment variables.')
}

// Parse manual para asegurar estabilidad en la autenticación con el pooler de Supabase
let poolConfig = {
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
}

if (connectionString) {
  try {
    const url = new URL(connectionString)
    poolConfig = {
      ...poolConfig,
      // @ts-expect-error - Sobrescribimos con valores explícitos si el parseo es exitoso
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      host: url.hostname,
      port: parseInt(url.port),
      database: url.pathname.substring(1).split('?')[0],
    }
  } catch (e) {
    console.error('[PRISMA_INIT] Error parsing DATABASE_URL:', e)
  }
}

const pool = new Pool(poolConfig)

// Manejo de errores del pool para evitar crashes silenciosos
pool.on('error', (err) => {
  console.error('[PRISMA_POOL] Unexpected error on idle client', err)
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
