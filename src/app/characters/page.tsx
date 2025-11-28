'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { characterAPI } from '@/lib/api';
import { Character } from '@/lib/types';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await characterAPI.getAll();
      setCharacters(response.data);
    } catch (error) {
      console.error('Error loading characters:', error);
    } finally {
      setLoading(false);
    }
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
        <Link href="/characters/new" className="btn btn-primary">
          + Nuevo Personaje
        </Link>
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
