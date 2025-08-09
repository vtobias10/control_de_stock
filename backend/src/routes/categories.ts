// backend/src/routes/categories.ts
import { Router } from 'express'
import { pool } from '../db'

const router = Router()

// GET /api/categories
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, parent_id
       FROM product_category
       ORDER BY name ASC`
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error listando categorías' })
  }
})

export default router
