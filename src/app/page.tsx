'use client'

import { useState } from 'react'

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    
    // Crear enlace de descarga directa
    const link = document.createElement('a')
    link.href = 'http://localhost:8080/plugin-marketplace-final.tar.gz'
    link.download = 'plugin-marketplace-final.tar.gz'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => setIsDownloading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Plugin Marketplace
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Proyecto completo con Backend, Frontend y Panel de Publicador
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">📦 Incluye:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-semibold text-blue-700">Backend</div>
                <div className="text-gray-600">Express + TypeORM + PostgreSQL</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-semibold text-green-700">Frontend</div>
                <div className="text-gray-600">Vue.js + TypeScript</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-semibold text-purple-700">Publisher</div>
                <div className="text-gray-600">Panel de administración</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100"
          >
            {isDownloading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Descargando...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Proyecto Completo (393 KB)
              </span>
            )}
          </button>

          {isDownloading && (
            <p className="mt-4 text-sm text-green-600">
              ✅ Descarga iniciada. Revisa tu carpeta de descargas.
            </p>
          )}

          <div className="mt-8 text-xs text-gray-500">
            <p>El archivo contiene todo el código fuente + documentación</p>
            <p>Requiere: Node.js 18+, PostgreSQL 14+</p>
          </div>
        </div>
      </div>
    </div>
  )
}
