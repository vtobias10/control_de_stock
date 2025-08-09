// backend/src/index.ts
import express from 'express'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = Number(process.env.PORT)

// Configuramos pool de conexiones PostgreSQL
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// Probamos al iniciar que conecte bien
pool
  .connect()
  .then(() => console.log('✅ Conectado a PostgreSQL en localhost:5432'))
  .catch((err) => {
    console.error('❌ Error conectando a PostgreSQL', err)
    process.exit(1)
  })

app.use(express.json())

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const { rows } = await pool.query(
      'SELECT id, password FROM users WHERE username = $1',
      [username]
    )
    if (!rows.length || rows[0].password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña inválidos' })
    }
    res.json({ id: rows[0].id, username })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
})


// Ruta de healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`⚡️ Backend escuchando en http://localhost:${port}`)
})
