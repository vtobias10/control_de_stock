// src/pages/Inventario.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from '@heroicons/react/24/solid'

export default function Inventario() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  // estado para dropdowns
  const [openOps, setOpenOps] = useState(false)
  const [openProd, setOpenProd] = useState(false)
  const [openInf, setOpenInf] = useState(false)
  const [openCfg, setOpenCfg] = useState(false)

  const sectionBtn =
    'w-full text-left px-4 py-2 flex items-center justify-between ' +
    'rounded-lg hover:bg-[rgba(238,50,35,0.1)] transition cursor-pointer'

  const singleBtn =
    'w-full text-left px-4 py-2 rounded-lg hover:bg-[rgba(238,50,35,0.1)] ' +
    'transition cursor-pointer'

  const dropdownItem =
    'pl-8 pr-4 py-1 hover:bg-[rgba(238,50,35,0.1)] rounded-lg transition cursor-pointer'

  return (
    <div className="min-h-screen flex bg-[#FFF5EE]">
      {/* Panel lateral */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-6 py-8 flex flex-col items-center">
          {/* Icono dentro de círculo */}
          <div className="bg-white p-2 rounded-full shadow-md">
            <UserIcon className="w-6 h-6 text-[#F25E52]" aria-hidden="true" />
          </div>
          {/* Nombre de usuario */}
          <span className="mt-2 text-xl font-bold text-[#F25E52]">
            {user.username}
          </span>
        </div>
        {/* Menu */}
        <nav className="flex-1 px-2 space-y-1">
          {/* Información General (botón único) */}
          <div className={singleBtn}>
            Información General
          </div>

          {/* Operaciones (dropdown) */}
          <div
            className={sectionBtn}
            onClick={() => setOpenOps((o) => !o)}
          >
            Operaciones
            {openOps ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openOps && (
            <div className="space-y-1">
              <div className={dropdownItem}>Transferencias</div>
              <div className={dropdownItem}>Ajustes de Inventario</div>
              <div className={dropdownItem}>Desechar</div>
            </div>
          )}

          {/* Productos (dropdown) */}
          <div
            className={sectionBtn}
            onClick={() => setOpenProd((o) => !o)}
          >
            Productos
            {openProd ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openProd && (
            <div className="space-y-1">
              <div className={dropdownItem}>Productos</div>
            </div>
          )}

          {/* Informes (dropdown) */}
          <div
            className={sectionBtn}
            onClick={() => setOpenInf((o) => !o)}
          >
            Informes
            {openInf ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openInf && (
            <div className="space-y-1">
              <div className={dropdownItem}>Informe de inventario</div>
              <div className={dropdownItem}>Movimiento de productos</div>
            </div>
          )}

          {/* Configuración (dropdown) */}
          <div
            className={sectionBtn}
            onClick={() => setOpenCfg((o) => !o)}
          >
            Configuración
            {openCfg ? (
              <ChevronUpIcon className="w-5 h-5 text-[#F25E52]" />
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-[#F25E52]" />
            )}
          </div>
          {openCfg && (
            <div className="space-y-1">
              <div className={dropdownItem}>Ajustes</div>
              <div className={dropdownItem}>Almacenes</div>
              <div className={dropdownItem}>Tipos de operaciones</div>
              <div className={dropdownItem}>Categorías de productos</div>
            </div>
          )}
        </nav>

        {/* Logout abajo */}
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center rounded-3xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold px-5 py-2 shadow-2xl hover:bg-[#EE3223] hover:text-white transition cursor-pointer hover:shadow-[0_30px_60px_-10px_rgba(238,50,35,0.6)]"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Panel derecho vacío por ahora */}
      <main className="flex-1 p-8">{/* Aquí se renderizarán subcomponentes */}</main>
    </div>
  )
}
