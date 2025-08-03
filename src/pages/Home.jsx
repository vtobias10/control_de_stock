import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-2">Bienvenido</h1>
        <p className="text-gray-600 mb-4">Este es tu panel de Control de Stock.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Productos
          </button>
          <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50">
            Inventario
          </button>
        </div>
      </div>
    </div>
  );
}