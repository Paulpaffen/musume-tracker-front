'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { characterAPI } from '@/lib/api';

export default function NewCharacterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    characterName: '',
    identifierVersion: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await characterAPI.create(formData);
      router.push('/characters');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear personaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuevo Personaje</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="label" htmlFor="characterName">
            Nombre del Personaje *
          </label>
          <input
            id="characterName"
            type="text"
            className="input"
            value={formData.characterName}
            onChange={(e) => setFormData({ ...formData, characterName: e.target.value })}
            required
            placeholder="Ej: Special Week"
          />
        </div>

        <div>
          <label className="label" htmlFor="identifierVersion">
            Identificador de Versión *
          </label>
          <input
            id="identifierVersion"
            type="text"
            className="input"
            value={formData.identifierVersion}
            onChange={(e) => setFormData({ ...formData, identifierVersion: e.target.value })}
            required
            placeholder="Ej: Speed Build v1, Historia Score 90k"
          />
          <p className="text-sm text-gray-500 mt-1">
            Usa esto para diferenciar distintas versiones del mismo personaje
          </p>
        </div>

        <div>
          <label className="label" htmlFor="notes">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            className="input"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notas sobre el entrenamiento, skills, etc."
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Personaje'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
