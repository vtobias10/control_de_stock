// src/services/categoriesService.js
const API = '/api/categories';

export async function listCategories(params = {}) {
  const q = new URLSearchParams();
  if (params.search) q.set('search', params.search);
  if (params.page) q.set('page', params.page);
  if (params.pageSize) q.set('pageSize', params.pageSize);

  const url = q.toString() ? `${API}?${q.toString()}` : API;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error listando categorías');

  const json = await res.json();
  // 👇 Normalizamos: si viene {data: [...]}, devolvemos ese array; si viene un array crudo, lo devolvemos tal cual.
  return Array.isArray(json) ? json : (json.data ?? []);
}

export async function getCategory(id) {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) throw new Error('Categoría no encontrada');
  return res.json();
}

export async function createCategory(payload) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Error creando categoría');
  return data;
}

export async function updateCategory(id, payload) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Error actualizando');
  return data;
}

export async function deleteCategory(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Error eliminando');
  return data;
}
