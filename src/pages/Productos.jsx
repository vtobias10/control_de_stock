// src/pages/Productos.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { listProducts, createProduct, updateProduct, deleteProduct } from '../services/productsService'
import { listCategories } from '../services/categoriesService'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid'

const catLabel = (c) => c.parent_name
  ? `${c.name} — ${c.parent_name}`
  : c.name;


const unitOptions = ['unidad', 'caja', 'pack', 'docena', 'bolsa', 'kg', 'g', 'lb', 'l', 'ml', 'm', 'cm']

const btnPrimary =
  'inline-flex items-center justify-center rounded-3xl bg-[#EE3223] text-white font-bold px-4 py-2 shadow hover:bg-[#CE1E10] transition'
const btnSoft =
  'inline-flex items-center justify-center rounded-3xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold px-4 py-2 shadow hover:bg-[#EE3223] hover:text-white transition'

export default function Productos() {
  // filtros
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [active, setActive] = useState('true')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // datos
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  // modal
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category_id: '',
    min_qty: 0,
    max_qty: 0,
    cost: 0,
    sale_price: 0,
    currency: 'ARS',
    barcode: '',
    image_url: '',
    unit: 'unidad',
    active: true,
  })

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / pageSize), 1),
    [total, pageSize]
  )

  useEffect(() => {
    listCategories()
   .then((arr) => setCategories(Array.isArray(arr) ? arr : []))
   .catch(console.error)
  }, [])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryId, active, page])

  async function fetchData() {
    setLoading(true)
    try {
      const { data, total } = await listProducts({
        search,
        category_id: categoryId || undefined,
        active: active === '' ? undefined : active,
        page,
        pageSize,
      })
      setRows(data)
      setTotal(total)
    } catch (e) {
      console.error(e)
      alert('No se pudieron cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm({
      sku: '',
      name: '',
      category_id: '',
      min_qty: 0,
      max_qty: 0,
      cost: 0,
      sale_price: 0,
      currency: 'ARS',
      barcode: '',
      image_url: '',
      unit: 'unidad',
      active: true,
    })
    setOpen(true)
  }

  function openEdit(p) {
    setEditing(p)
    setForm({
      sku: p.sku || '',
      name: p.name || '',
      category_id: p.category_id || '',
      min_qty: p.min_qty ?? 0,
      max_qty: p.max_qty ?? 0,
      cost: p.cost ?? 0,
      sale_price: p.sale_price ?? 0,
      currency: p.currency || 'ARS',
      barcode: p.barcode || '',
      image_url: p.image_url || '',
      unit: p.unit || 'unidad',
      active: !!p.active,
    })
    setOpen(true)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (form.min_qty < 0 || form.max_qty < form.min_qty) {
      alert('Revisá los mínimos/máximos'); return
    }
    if (form.cost < 0 || form.sale_price < 0) {
      alert('Los precios no pueden ser negativos'); return
    }

    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category_id: form.category_id || null,
      min_qty: Number(form.min_qty) || 0,
      max_qty: Number(form.max_qty) || 0,
      cost: Number(form.cost) || 0,
      sale_price: Number(form.sale_price) || 0,
      currency: form.currency || 'ARS',
      barcode: form.barcode?.trim() || null,
      image_url: form.image_url?.trim() || null,
      unit: form.unit?.trim() || 'unidad',
      active: !!form.active,
    }

    try {
      if (editing) await updateProduct(editing.id, payload)
      else await createProduct(payload)
      setOpen(false)
      setPage(1)
      fetchData()
    } catch (e) {
      alert(e.message || 'Error guardando producto')
    }
  }

  async function onDelete(p) {
    if (!confirm(`¿Eliminar "${p.name}"? (baja lógica)`)) return
    try {
      await deleteProduct(p.id)
      fetchData()
    } catch (e) {
      alert(e.message || 'Error eliminando')
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[#CE1E10]">Productos</h1>
        <button onClick={openCreate} className={btnPrimary}>
          <PlusIcon className="w-5 h-5 mr-2" /> Nuevo producto
        </button>
      </header>

      {/* Filtros */}
      <section className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#CE1E10] mb-1">Buscar</label>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Nombre, SKU o código de barras…"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#CE1E10] mb-1">Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setPage(1) }}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="">Todas</option>
            { (Array.isArray(categories) ? categories : []).map(c => (
              <option key={c.id} value={c.id}>{catLabel(c)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#CE1E10] mb-1">Estado</label>
          <select
            value={active}
            onChange={(e) => { setActive(e.target.value); setPage(1) }}
            className="w-full border rounded px-3 py-2 bg-white"
          >
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
            <option value="">Todos</option>
          </select>
        </div>
      </section>

      {/* Tabla */}
      <section className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[rgba(238,50,35,0.08)] text-[#CE1E10]">
            <tr>
              <th className="text-left px-4 py-3">Imagen</th>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">SKU</th>
              <th className="text-left px-4 py-3">Categoría</th>
              <th className="text-left px-4 py-3">Código de barras</th>
              <th className="text-left px-4 py-3">Reorden (min/max)</th>
              <th className="text-left px-4 py-3">Costo</th>
              <th className="text-left px-4 py-3">Precio</th>
              <th className="text-left px-4 py-3">Unidad</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-center" colSpan="11">Cargando…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-6 text-center" colSpan="11">Sin resultados</td></tr>
            ) : (
              rows.map(p => (
                <tr key={p.id} className="border-t">
                  {/* Imagen o placeholder */}
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.src = ''; e.currentTarget.alt = 'sin-imagen' }}
                        />
                      ) : (
                        <PhotoIcon className="w-7 h-7 text-gray-400" />
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.sku}</td>
                  <td className="px-4 py-3">{p.category_name || '-'}</td>
                  <td className="px-4 py-3">{p.barcode || '-'}</td>
                  <td className="px-4 py-3">{p.min_qty} / {p.max_qty}</td>
                  <td className="px-4 py-3">{p.currency || 'ARS'} {Number(p.cost ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{p.currency || 'ARS'} {Number(p.sale_price ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-3">{p.unit || 'unidad'}</td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                      <span className="text-gray-500">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button className={btnSoft} onClick={() => openEdit(p)}>
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button className={btnSoft} onClick={() => onDelete(p)}>
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Paginación simple */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages} — {total} resultados
        </span>
        <div className="flex gap-2">
          <button
            className={btnSoft}
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page <= 1}
          >
            ◀
          </button>
          <button
            className={btnSoft}
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#CE1E10]">
                {editing ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <button className={btnSoft} onClick={() => setOpen(false)}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SKU / Nombre */}
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">SKU</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Nombre</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Categoría</label>
                  <select
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">(Sin categoría)</option>
                    { (Array.isArray(categories) ? categories : []).map(c => (
                      <option key={c.id} value={c.id}>{catLabel(c)}</option>
                    ))}
                  </select>
                </div>

                {/* Min / Max */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#CE1E10] mb-1">Mínimo</label>
                    <input
                      type="number" min="0"
                      className="w-full border rounded px-3 py-2"
                      value={form.min_qty}
                      onChange={(e) => setForm({ ...form, min_qty: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CE1E10] mb-1">Máximo</label>
                    <input
                      type="number" min="0"
                      className="w-full border rounded px-3 py-2"
                      value={form.max_qty}
                      onChange={(e) => setForm({ ...form, max_qty: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                {/* Costos */}
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Costo</label>
                  <input
                    type="number" min="0" step="0.01"
                    className="w-full border rounded px-3 py-2"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Precio de venta</label>
                  <input
                    type="number" min="0" step="0.01"
                    className="w-full border rounded px-3 py-2"
                    value={form.sale_price}
                    onChange={(e) => setForm({ ...form, sale_price: Number(e.target.value) })}
                  />
                </div>

                {/* Moneda / Unidad */}
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Moneda</label>
                  <select
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
<div>
  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Unidad</label>
  <select
    className="w-full border rounded px-3 py-2 bg-white"
    value={form.unit}
    onChange={(e) => setForm({ ...form, unit: e.target.value })}
  >
    {unitOptions.map(u => (
      <option key={u} value={u}>{u}</option>
    ))}
  </select>
</div>

                {/* Barcode / Imagen URL */}
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">Código de barras (opcional)</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                    placeholder="EAN/UPC/Code128…"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CE1E10] mb-1">URL de imagen (opcional)</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://…"
                  />
                </div>

                {/* Preview imagen */}
                <div className="flex items-end">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="h-20 w-20 object-cover rounded border"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="text-xs text-gray-500">Sin vista previa</div>
                  )}
                </div>
              </div>

              {/* Activo */}
              <div className="flex items-center gap-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
                <label htmlFor="active" className="text-sm">Activo</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className={btnSoft} onClick={() => setOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className={btnPrimary}>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
