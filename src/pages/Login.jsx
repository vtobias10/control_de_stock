// src/pages/Login.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRightOnRectangleIcon, ChevronLeftIcon } from '@heroicons/react/24/solid'
import { login } from '../services/authService'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login(username, password)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/inventario')
    } catch (err) {
      setError(err.message)
    }
  }

  const buttonBase =
    'inline-flex items-center justify-center rounded-3xl bg-[rgba(255,245,238,0.95)] ' +
    'text-[#CE1E10] font-bold px-5 py-2 shadow-2xl no-underline transition cursor-pointer ' +
    'hover:bg-[#EE3223] hover:text-white'

  // Botón "Entrar" invertido: fondo rojo por defecto, mismo efecto de hover de Inventario
  const enterBtn =
    'inline-flex items-center justify-center rounded-3xl bg-[#EE3223] text-white ' +
    'font-bold px-5 py-2 shadow-2xl no-underline transition cursor-pointer ' +
    'hover:shadow-[0_30px_60px_-10px_rgba(238,50,35,0.6)] w-full'

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Diseno_sin_titulo_3.PNG')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#9F170C]/30 via-transparent to-[#FDE2E0]/30" />

      {/* Navbar con botón Volver */}
      <nav className="z-10 flex items-center px-6 py-4">
        <Link to="/" className={buttonBase}>
          <ChevronLeftIcon className="w-5 h-5 mr-2" aria-hidden="true" />
          Volver
        </Link>
      </nav>

      {/* Formulario centrado */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[rgba(255,245,238,0.95)] shadow-lg rounded-lg p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-[#CE1E10]">
            Inventario
          </h2>
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}
          <div>
            <label className="block mb-1 font-medium text-[#CE1E10]">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-[#CE1E10]">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className={enterBtn}>
            <ArrowRightOnRectangleIcon
              className="w-5 h-5 mr-2"
              aria-hidden="true"
            />
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  )
}
