// backend/src/routes/products.ts
import { Router } from 'express'
import { pool } from '../db'

const router = Router()

// GET /api/products?search=&category_id=&active=&page=&pageSize=
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      category_id,
      active, // 'true' | 'false' | undefined
      page = '1',
      pageSize = '20',
    } = req.query as Record<string, string>

    const p = Math.max(parseInt(page, 10) || 1, 1)
    const ps = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 200)
    const offset = (p - 1) * ps

    const where: string[] = []
    const params: any[] = []

// --- Filtros ---
if (search) {
  const pattern = `%${search}%`
  // calculamos los índices ANTES de pushear para no equivocarnos
  const iName    = params.length + 1
  const iSku     = params.length + 2
  const iBarcode = params.length + 3
  params.push(pattern, pattern, pattern)
  where.push(`(p.name ILIKE $${iName} OR p.sku ILIKE $${iSku} OR p.barcode ILIKE $${iBarcode})`)
}

if (category_id) {
  params.push(Number(category_id))
  where.push(`p.category_id = $${params.length}`)
}

if (active === 'true' || active === 'false') {
  params.push(active === 'true')
  where.push(`p.active = $${params.length}`)
}


    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    // total
    const { rows: totalRows } = await pool.query(
      `SELECT COUNT(*)::int AS total FROM product p ${whereSql}`,
      params
    )
    const total = totalRows[0]?.total ?? 0

    // data
    params.push(ps, offset)
    const { rows } = await pool.query(
      `SELECT
         p.id, p.sku, p.name, p.min_qty, p.max_qty,
         p.cost, p.sale_price, p.currency,
         p.barcode, p.image_url, p.unit, p.active,
         p.category_id, c.name AS category_name
       FROM product p
       LEFT JOIN product_category c ON c.id = p.category_id
       ${whereSql}
       ORDER BY p.id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )

    res.json({ data: rows, total, page: p, pageSize: ps })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error listando productos' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category_name
       FROM product p
       LEFT JOIN product_category c ON c.id = p.category_id
       WHERE p.id = $1`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo producto' })
  }
})

// POST /api/products
router.post('/', async (req, res) => {
  try {
    const {
      sku, name, category_id,
      min_qty = 0, max_qty = 0,
      cost = 0, sale_price = 0, currency = 'ARS',
      barcode = null, image_url = null,
      unit = 'unidad', active = true,
    } = req.body || {}

    if (!sku || !name) return res.status(400).json({ error: 'sku y name son requeridos' })
    if (min_qty < 0 || max_qty < min_qty) return res.status(400).json({ error: 'Rango min/max inválido' })
    if (cost < 0 || sale_price < 0) return res.status(400).json({ error: 'Precios inválidos' })

    const { rows } = await pool.query(
      `INSERT INTO product
        (sku, name, category_id, min_qty, max_qty,
         cost, sale_price, currency, barcode, image_url, unit, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, sku, name, category_id, min_qty, max_qty,
                 cost, sale_price, currency, barcode, image_url, unit, active`,
      [sku, name, category_id ?? null, min_qty, max_qty,
       cost, sale_price, currency, barcode, image_url, unit, active]
    )
    res.status(201).json(rows[0])
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'SKU o barcode ya existe' })
    console.error(err)
    res.status(500).json({ error: 'Error creando producto' })
  }
})

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const {
      sku, name, category_id,
      min_qty, max_qty,
      cost, sale_price, currency,
      barcode, image_url, unit, active,
    } = req.body || {}

    if (min_qty != null && max_qty != null && (min_qty < 0 || max_qty < min_qty)) {
      return res.status(400).json({ error: 'Rango min/max inválido' })
    }
    if ((cost != null && cost < 0) || (sale_price != null && sale_price < 0)) {
      return res.status(400).json({ error: 'Precios inválidos' })
    }

    const { rows } = await pool.query(
      `UPDATE product SET
         sku = COALESCE($1, sku),
         name = COALESCE($2, name),
         category_id = $3,
         min_qty = COALESCE($4, min_qty),
         max_qty = COALESCE($5, max_qty),
         cost = COALESCE($6, cost),
         sale_price = COALESCE($7, sale_price),
         currency = COALESCE($8, currency),
         barcode = $9,
         image_url = $10,
         unit = COALESCE($11, unit),
         active = COALESCE($12, active)
       WHERE id = $13
       RETURNING id, sku, name, category_id, min_qty, max_qty,
                 cost, sale_price, currency, barcode, image_url, unit, active`,
      [
        sku ?? null, name ?? null, category_id ?? null,
        min_qty ?? null, max_qty ?? null,
        cost ?? null, sale_price ?? null, currency ?? null,
        barcode ?? null, image_url ?? null, unit ?? null,
        active ?? null, id
      ]
    )

    if (!rows.length) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'SKU o barcode ya existe' })
    console.error(err)
    res.status(500).json({ error: 'Error actualizando producto' })
  }
})

// DELETE /api/products/:id  (baja lógica)
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { rows } = await pool.query(
      `UPDATE product SET active = FALSE WHERE id = $1 RETURNING id`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error eliminando producto' })
  }
})

export default router
