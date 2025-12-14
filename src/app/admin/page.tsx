'use client';

import { useState } from 'react';
import { skillsAPI } from '@/lib/api';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSeedSkills = async () => {
    if (!window.confirm('¿Estás seguro? Esto creará todas las skills desde los personajes existentes.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await skillsAPI.seed();
      setResult(response.data);
      alert(`✅ Seed completado! ${response.data.total} skills creadas/actualizadas`);
    } catch (error: any) {
      console.error(error);
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔧 Admin - Utilidades</h1>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Seed de Skills</h2>
        <p className="text-gray-600 mb-4">
          Extrae todas las skills de los personajes existentes y las crea en la base de datos.
          <br />
          <strong>Solo necesitas hacer esto UNA VEZ después del deploy.</strong>
        </p>
        
        <button
          onClick={handleSeedSkills}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Procesando...' : '🌱 Crear Skills desde Personajes'}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">✅ Resultado:</h3>
            <p className="text-green-800">Total de skills: {result.total}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-green-700">Ver skills creadas</summary>
              <div className="mt-2 max-h-60 overflow-y-auto">
                <ul className="text-sm space-y-1">
                  {result.skills?.map((skill: any) => (
                    <li key={skill.id} className="flex justify-between">
                      <span className={skill.isRare ? 'text-yellow-600 font-bold' : ''}>
                        {skill.isRare && '⭐ '}{skill.name}
                      </span>
                      <span className="text-gray-500">x{skill.timesUsed}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
