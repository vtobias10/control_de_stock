// src/pages/Inventario.jsx
import React, { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid'
import Productos from './Productos'

export default function Inventario() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  // control de dropdowns
  const [openOps, setOpenOps] = useState(false)
  const [openProd, setOpenProd] = useState(false)
  const [openInf, setOpenInf] = useState(false)
  const [openCfg, setOpenCfg] = useState(false)

  // Menu padre con fondo fijo y sin hover bg adicional
  const sectionBtn =
    'w-full text-left px-4 py-2 flex items-center justify-between rounded-lg bg-[rgba(238,50,35,0.1)] transition cursor-pointer'
  const singleBtn =
    'w-full text-left px-4 py-2 flex items-center gap-2 rounded-lg bg-[rgba(238,50,35,0.1)] transition cursor-pointer'
  // Items secundarios mantienen hover para indicación
  const dropdownItem =
    'pl-10 pr-4 py-1 flex items-center hover:bg-[rgba(238,50,35,0.1)] rounded-lg transition cursor-pointer'

  // qué mostrar en el panel derecho
  const showProductos = location.pathname === '/inventario/productos'

  return (
    <div className="h-screen min-h-0 overflow-hidden flex bg-[#FFF5EE]">
      {/* Panel lateral con scroll propio */}
      <aside className="w-64 bg-white shadow-lg flex flex-col h-full">
        {/* Header (fijo) */}
        <div className="px-6 py-8 flex flex-col items-center shrink-0">
          <div className="bg-white p-2 rounded-full shadow-md">
            <UserIcon className="w-6 h-6 text-[#F25E52]" />
          </div>
          <span className="mt-2 text-xl font-bold text-[#F25E52]">
            {user.username}
          </span>
        </div>

        {/* Menú (solo esta parte scrollea) */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto pr-2">
          {/* Información General (por ahora sin navegación) */}
          <div className={singleBtn}>
            <InformationCircleIcon className="w-5 h-5 text-[#F25E52]" />
            <span>Información General</span>
          </div>

          {/* Operaciones */}
          <div className={sectionBtn} onClick={() => setOpenOps(o => !o)}>
            <span className="flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5 text-[#F25E52]" />
              Operaciones
            </span>
            {openOps ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openOps && (
            <div className="space-y-1">
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Transferencias
              </div>
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Ajustes de Inventario
              </div>
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Desechar
              </div>
            </div>
          )}

          {/* Productos */}
          <div className={sectionBtn} onClick={() => setOpenProd(o => !o)}>
            <span className="flex items-center gap-2">
              <ArchiveBoxIcon className="w-5 h-5 text-[#F25E52]" />
              Productos
            </span>
            {openProd ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openProd && (
            <div className="space-y-1">
              {/* Ahora navega a /inventario/productos */}
              <Link to="/inventario/productos" className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Productos
              </Link>
            </div>
          )}

          {/* Informes */}
          <div className={sectionBtn} onClick={() => setOpenInf(o => !o)}>
            <span className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-[#F25E52]" />
              Informes
            </span>
            {openInf ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openInf && (
            <div className="space-y-1">
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Informe de inventario
              </div>
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Movimiento de productos
              </div>
            </div>
          )}

          {/* Configuración */}
          <div className={sectionBtn} onClick={() => setOpenCfg(o => !o)}>
            <span className="flex items-center gap-2">
              <Cog6ToothIcon className="w-5 h-5 text-[#F25E52]" />
              Configuración
            </span>
            {openCfg ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openCfg && (
            <div className="space-y-1">
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Ajustes
              </div>
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Almacenes
              </div>
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Tipos de operaciones
              </div>
              <div className={dropdownItem}>
                <span className="text-[#EE3223] mr-2">·</span>Categorías de productos
              </div>
            </div>
          )}
        </nav>

        {/* Inicio + Cerrar Sesión (fijos abajo) */}
        <div className="px-6 py-4 space-y-2 shrink-0">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center rounded-3xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold px-5 py-2 shadow-2xl hover:bg-[#EE3223] hover:text-white transition"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Inicio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center rounded-3xl bg-[#EE3223] text-white font-bold px-5 py-2 shadow-2xl transition cursor-pointer hover:bg-[rgba(255,245,238,0.95)] hover:text-[#CE1E10]"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Panel derecho */}
      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto p-8">
        {showProductos ? (
          <Productos />
        ) : (
          <div className="text-gray-600">
            Selecciona una opción del menú.
          </div>
        )}
      </main>
    </div>
  )
}
