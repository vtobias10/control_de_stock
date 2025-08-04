// src/pages/Home.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HomeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/solid'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const toggleLogin = () => setIsLoggedIn((l) => !l)

  const buttonBase =
    'inline-flex items-center justify-center rounded-3xl bg-[rgba(255,245,238,0.95)] text-[#CE1E10] font-bold px-5 py-2 shadow-2xl no-underline transition cursor-pointer hover:bg-[#EE3223] hover:text-white'

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Navbar mínima */}
      <nav className="z-10 flex items-center justify-between px-6 py-4">
        <div>
          <Link to="/" className={buttonBase}>
            <HomeIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Inicio
          </Link>
        </div>
        <div className="flex gap-4">
          <Link to="/config" className={buttonBase}>
            <Cog6ToothIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Config
          </Link>
          <button onClick={toggleLogin} className={buttonBase}>
            {isLoggedIn ? (
              <>
                <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Cerrar Sesión
              </>
            ) : (
              <>
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Iniciar Sesión
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Diseno_sin_titulo_3.PNG')" }}
        aria-hidden="true"
      />
      {/* Overlay suave para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9F170C]/30 via-transparent to-[#FDE2E0]/30" />

      {/* Contenido central: tarjeta rectangular de Inventario */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        <Link
          to="/inventario"
          aria-label="Inventario"
          className="group flex flex-col items-center justify-center w-full max-w-xl h-56 rounded-3xl bg-[rgba(255,245,238,0.95)] shadow-2xl no-underline hover:shadow-[0_30px_60px_-10px_rgba(238,50,35,0.6)] transition p-8 text-center"
        >
          <div className="mb-4 flex items-center justify-center">
            <ArchiveBoxIcon className="w-16 h-16 text-[#F25E52]" aria-hidden="true" />
          </div>
          <div className="text-6xl font-extrabold text-[#F25E52]">Inventario</div>
        </Link>
      </div>
    </div>
  )
}
