import pg from 'pg'

const { Pool } = pg

export const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim())

const pool = databaseConfigured
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: true },
    })
  : null

export async function withUserTransaction<T>(
  clerkUserId: string,
  work: (client: pg.PoolClient) => Promise<T>,
): Promise<T> {
  if (!pool) throw new Error('DATABASE_NOT_CONFIGURED')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query("SELECT set_config('riftpulse.user_id', $1, true)", [clerkUserId])
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

export async function closeDatabasePool() {
  await pool?.end()
}
