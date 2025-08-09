// backend/src/index.ts
import express from 'express'
import dotenv from 'dotenv'
import { pool } from './db'                 // ← usa el Pool de db.ts
import categoriesRouter from './routes/categories'
import productsRouter from './routes/products'

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(express.json())

// --- Login (igual que antes, pero usando el pool importado) ---
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

// --- Health ---
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// --- Montar rutas nuevas ---
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)

app.listen(port, () => {
  console.log(`⚡️ Backend escuchando en http://localhost:${port}`)
})
