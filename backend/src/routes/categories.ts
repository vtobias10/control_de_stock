// backend/src/routes/categories.ts
import { Router } from 'express'
import { pool } from '../db'

const router = Router()

// Helper: formatea errores PG relevantes
function pgErrorToMessage(err: any) {
  // UNIQUE (name, parent_id)
  if (err?.code === '23505') return 'Ya existe una categoría con ese nombre y padre.'
  // FK parent_id → product_category.id
  if (err?.code === '23503') return 'El padre indicado no existe o está en uso.'
  return err?.message ?? 'Error desconocido'
}

/**
 * GET /api/categories
 * Soporta: ?search= (o ?q=), ?page=, ?pageSize=
 * Respuesta: { data, total, page, pageSize }
 */
router.get('/', async (req, res) => {
  try {
    // Acepta search o q (compatibilidad)
    const raw = (req.query.search ?? req.query.q ?? '') as string
    const search = String(raw || '')
    const { page = '1', pageSize = '20' } = req.query as Record<string, string>

    const p  = Math.max(parseInt(page, 10) || 1, 1)
    const ps = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 200)
    const offset = (p - 1) * ps

    const where: string[] = []
    const params: any[] = []

    if (search) {
      const pattern = `%${search}%`
      const i = params.length + 1
      params.push(pattern)
      where.push(`c.name ILIKE $${i}`)
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    // total
    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::int AS total
       FROM product_category c
       ${whereSql}`,
      params
    )
    const total = totalRows[0]?.total ?? 0

    // data
    params.push(ps, offset)
    const { rows } = await pool.query(
      `SELECT c.id, c.name, c.parent_id, p.name AS parent_name, c.created_at
       FROM product_category c
       LEFT JOIN product_category p ON p.id = c.parent_id
       ${whereSql}
       ORDER BY c.id ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    res.json({ data: rows, total, page: p, pageSize: ps })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error listando categorías' })
  }
})

/**
 * POST /api/categories
 * body: { name: string, parent_id?: number|null }
 * Resp: categoría creada
 */
router.post('/', async (req, res) => {
  const { name, parent_id } = req.body ?? {}
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'El nombre es obligatorio.' })
  }
  const parent = (parent_id === null || parent_id === undefined) ? null : Number(parent_id)

  try {
    // 🔍 Validar duplicados ignorando mayúsculas
    const checkSql = `
      SELECT 1
      FROM product_category
      WHERE LOWER(name) = LOWER($1) 
        AND parent_id IS NOT DISTINCT FROM $2
      LIMIT 1
    `
    const { rows: exists } = await pool.query(checkSql, [name.trim(), parent])
    if (exists.length) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese nombre y madre.' })
    }

    const sql = `
      INSERT INTO product_category (name, parent_id)
      VALUES ($1, $2)
      RETURNING id, name, parent_id, created_at;
    `
    const { rows } = await pool.query(sql, [name.trim(), parent])
    res.status(201).json(rows[0])
  } catch (err: any) {
    console.error(err)
    res.status(400).json({ error: pgErrorToMessage(err) })
  }
})

/**
 * PUT /api/categories/:id
 * body: { name?: string, parent_id?: number|null }
 */
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, parent_id } = req.body ?? {}

  if (!id) return res.status(400).json({ error: 'ID inválido' })

  // Armamos set dinámico
  const sets: string[] = []
  const params: any[] = []
  let i = 1

  if (name !== undefined) {
    if (!String(name).trim()) return res.status(400).json({ error: 'El nombre no puede estar vacío.' })
    sets.push(`name = $${i++}`)
    params.push(name.trim())
  }
  if (parent_id !== undefined) {
    sets.push(`parent_id = $${i++}`)
    params.push(parent_id === null ? null : Number(parent_id))
  }

  if (!sets.length) return res.status(400).json({ error: 'Nada para actualizar.' })

  params.push(id)

  try {
    const sql = `
      UPDATE product_category
      SET ${sets.join(', ')}
      WHERE id = $${i}
      RETURNING id, name, parent_id, created_at;
    `
    const { rows } = await pool.query(sql, params)
    if (!rows.length) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json(rows[0])
  } catch (err: any) {
    console.error(err)
    res.status(400).json({ error: pgErrorToMessage(err) })
  }
})

/**
 * DELETE /api/categories/:id
 */
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const { rowCount } = await pool.query('DELETE FROM product_category WHERE id = $1', [id])
    if (!rowCount) return res.status(404).json({ error: 'Categoría no encontrada' })
    res.json({ ok: true })
  } catch (err: any) {
    console.error(err)
    res.status(400).json({ error: pgErrorToMessage(err) })
  }
})

export default router
