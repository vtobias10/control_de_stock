// backend/src/db.ts
import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// (opcional) probar conexión al levantar
pool
  .connect()
  .then((c) => { c.release(); console.log('✅ Pool listo contra PostgreSQL') })
  .catch((err) => { console.error('❌ Error conectando al pool', err) })
