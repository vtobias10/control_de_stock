const API = '/api/categories';

export async function listCategories() {
  const res = await fetch(API);
  if (!res.ok) throw new Error('Error listando categorías');
  return res.json(); // [{id, name, parent_id}]
}
