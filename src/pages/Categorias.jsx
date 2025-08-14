// src/pages/Categorias.jsx
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoriesService";

export default function Categorias() {
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", parent_id: null });

  // Paginación básica (si no la usás visualmente, igual sirve para el fetch)
  const page = 1;
  const pageSize = 50;

  const parentOptions = useMemo(
    () => [{ id: null, name: "(Sin Madre)" }, ...rows],
    [rows]
  );

  async function fetchData(searchText = q) {
    try {
      setLoading(true);
      const resp = await listCategories({
        search: searchText.trim(),
        page,
        pageSize,
      });
      // el backend devuelve { data, total, page, pageSize }
      const data = Array.isArray(resp) ? resp : resp?.data;
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudieron cargar las categorías", "error");
    } finally {
      setLoading(false);
    }
  }

  // Carga inicial
  useEffect(() => {
    fetchData("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Búsqueda en tiempo real con debounce (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchData(q);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const submit = async (e) => {
    e.preventDefault();
    const name = form.name?.trim();
    if (!name) {
      Swal.fire("Atención", "El nombre es obligatorio.", "warning");
      return;
    }
    const payload = { name, parent_id: form.parent_id ?? null };

    try {
      if (form.id) {
        await updateCategory(form.id, payload);
        Swal.fire("OK", "Categoría actualizada", "success");
      } else {
        await createCategory(payload);
        Swal.fire("OK", "Categoría creada", "success");
      }
      setForm({ id: null, name: "", parent_id: null });
      fetchData(q);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudo guardar", "error");
    }
  };

  const onEdit = (r) =>
    setForm({ id: r.id, name: r.name ?? "", parent_id: r.parent_id ?? null });

  const onDelete = async (r) => {
    const ok = await Swal.fire({
      title: "Eliminar categoría",
      text: `¿Seguro que querés eliminar "${r.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#EE3223",
    });
    if (!ok.isConfirmed) return;
    try {
      await deleteCategory(r.id);
      Swal.fire("OK", "Categoría eliminada", "success");
      fetchData(q);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "No se pudo eliminar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#F25E52]">Categorías de productos</h1>

      {/* Búsqueda */}
      <div className="flex gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre…"
          className="px-4 py-2 rounded-xl border border-[#F3BBB6] focus:outline-none focus:ring-2 focus:ring-[#EE3223]"
        />
        <button
          onClick={() => fetchData(q)}
          className="px-4 py-2 rounded-3xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold shadow hover:bg-[#EE3223] hover:text-white transition"
        >
          Buscar
        </button>
        <button
          onClick={() => setForm({ id: null, name: "", parent_id: null })}
          className="px-4 py-2 rounded-3xl bg-[#EE3223] text-white font-bold shadow hover:opacity-90 transition"
        >
          Limpiar Campos
        </button>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="bg-white/90 rounded-2xl shadow p-4 space-y-3 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Nombre</span>
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className="px-3 py-2 rounded-xl border border-[#F3BBB6] focus:outline-none focus:ring-2 focus:ring-[#EE3223]"
              placeholder="Ej: Regalería"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-1">Madre (opcional)</span>
            <select
              value={form.parent_id ?? ""}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  parent_id: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
              className="px-3 py-2 rounded-xl border border-[#F3BBB6] focus:outline-none focus:ring-2 focus:ring-[#EE3223]"
            >
              {parentOptions.map((opt) => (
                <option key={opt.id ?? "none"} value={opt.id ?? ""}>
                  {opt.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-3xl bg-[#EE3223] text-white font-bold shadow hover:opacity-90 transition"
          >
            Guardar
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm({ id: null, name: "", parent_id: null })}
              className="ml-3 px-5 py-2 rounded-3xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold shadow hover:bg-[#EE3223] hover:text-white transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <div className="bg-white/90 rounded-2xl shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[#F25E52] font-bold border-b">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Madre</th>
                <th className="py-2 pr-4 w-40">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">Cargando…</td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">Sin resultados.</td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{r.id}</td>
                    <td className="py-2 pr-4">{r.name}</td>
                    <td className="py-2 pr-4">
                      {r.parent_name || (r.parent_id ? `#${r.parent_id}` : "—")}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(r)}
                          className="px-3 py-1 rounded-xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold hover:bg-[#EE3223] hover:text-white transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(r)}
                          className="px-3 py-1 rounded-xl bg-[#EE3223] text-white font-bold hover:opacity-90 transition"
                        >
                          Borrar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
