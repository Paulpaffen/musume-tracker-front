'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { runAPI } from '@/lib/api';
import { Run } from '@/lib/types';
import { TRACK_NAMES } from '@/lib/constants';
import { format } from 'date-fns';

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      const response = await runAPI.getAll();
      setRuns(response.data);
    } catch (error) {
      console.error('Error loading runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta carrera?')) return;

    try {
      await runAPI.delete(id);
      loadRuns();
    } catch (error) {
      console.error('Error deleting run:', error);
      alert('Error al eliminar la carrera');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando carreras...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Carreras</h1>
        <Link href="/runs/new" className="btn btn-primary">
          + Nueva Carrera
        </Link>
      </div>

      {runs.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No tienes carreras registradas</p>
          <Link href="/runs/new" className="btn btn-primary">
            Registrar tu primera carrera
          </Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Personaje</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pista</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posición</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {runs.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {format(new Date(run.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {run.characterTraining?.characterName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {run.characterTraining?.identifierVersion}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {TRACK_NAMES[run.trackType]}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      run.finalPlace <= 3 
                        ? 'bg-green-100 text-green-800' 
                        : run.finalPlace <= 6 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      #{run.finalPlace}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-bold text-primary-600">
                    {run.score}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                        {run.rareSkillsCount} raras
                      </span>
                      {run.uniqueSkillActivated && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                          Única
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {run.rushed && (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
                          Rushed
                        </span>
                      )}
                      {run.goodPositioning && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                          Buen pos.
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex gap-3">
                      <Link
                        href={`/runs/${run.id}/edit`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(run.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
