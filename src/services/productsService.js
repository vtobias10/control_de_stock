const API = '/api/products';

export async function listProducts(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.category_id) q.set('category_id', params.category_id);
  if (params.active !== undefined && params.active !== '') q.set('active', params.active);
  q.set('page', params.page ?? 1);
  q.set('pageSize', params.pageSize ?? 10);

  const res = await fetch(`${API}?${q.toString()}`);
  if (!res.ok) throw new Error('Error listando productos');
  return res.json(); // { data, total, page, pageSize }
}

export async function getProduct(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error creando producto');
  return res.json();
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error actualizando');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).error || 'Error eliminando');
  return res.json();
}
