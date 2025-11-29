'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { characterAPI } from '@/lib/api';
import { Character } from '@/lib/types';

export default function CharactersPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [minRuns, setMinRuns] = useState('');
  const [maxRuns, setMaxRuns] = useState('');

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const params: any = {};
      if (nameFilter) params.name = nameFilter;
      if (minRuns) params.minRuns = minRuns;
      if (maxRuns) params.maxRuns = maxRuns;

      const response = await characterAPI.getAll(params);
      setCharacters(response.data);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setLoading(true);
    loadCharacters();
  };

  const handleClearFilters = () => {
    setNameFilter('');
    setMinRuns('');
    setMaxRuns('');
    setLoading(true);
    loadCharacters();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este personaje?')) return;

    try {
      await characterAPI.delete(id);
      loadCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
      alert('Error al eliminar el personaje');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando personajes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Personajes</h1>
        <div className="flex gap-2">
          <Link href="/characters/compare" className="btn btn-secondary">
            Comparar Personajes
          </Link>
          <Link href="/characters/new" className="btn btn-primary">
            + Nuevo Personaje
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg p-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900"
        >
          <span>🔍 Filtros</span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Buscar por nombre..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mínimo de Carreras
              </label>
              <input
                type="number"
                value={minRuns}
                onChange={(e) => setMinRuns(e.target.value)}
                placeholder="0"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de Carreras
              </label>
              <input
                type="number"
                value={maxRuns}
                onChange={(e) => setMaxRuns(e.target.value)}
                placeholder="999"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="btn btn-primary"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleClearFilters}
                className="btn btn-secondary"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {characters.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No tienes personajes registrados</p>
          <Link href="/characters/new" className="btn btn-primary">
            Crear tu primer personaje
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <div key={character.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {character.characterName}
                  </h3>
                  <p className="text-sm text-gray-600">{character.identifierVersion}</p>
                </div>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {character._count?.runs || 0} runs
                </span>
              </div>

              {character.notes && (
                <p className="text-gray-600 text-sm mb-4">{character.notes}</p>
              )}

              <div className="flex gap-2">
                <Link
                  href={`/characters/${character.id}`}
                  className="btn btn-secondary flex-1 text-sm"
                >
                  Ver Detalles
                </Link>
                <button
                  onClick={() => handleDelete(character.id)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
