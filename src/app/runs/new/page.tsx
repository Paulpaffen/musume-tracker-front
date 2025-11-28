'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { characterAPI, runAPI } from '@/lib/api';
import { Character, TrackType } from '@/lib/types';
import { TRACK_NAMES } from '@/lib/constants';

export default function NewRunPage() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    characterTrainingId: '',
    trackType: TrackType.TURF_MEDIUM,
    finalPlace: 1,
    rareSkillsCount: 0,
    normalSkillsCount: 0,
    uniqueSkillActivated: false,
    goodPositioning: false,
    rushed: false,
    score: 0,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await characterAPI.getAll();
      setCharacters(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, characterTrainingId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await runAPI.create({
        ...formData,
        finalPlace: parseInt(formData.finalPlace as any),
        rareSkillsCount: parseInt(formData.rareSkillsCount as any),
        normalSkillsCount: parseInt(formData.normalSkillsCount as any),
        score: parseInt(formData.score as any),
      });
      router.push('/runs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear run');
    } finally {
      setLoading(false);
    }
  };

  if (characters.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">
            Necesitas crear un personaje antes de registrar carreras
          </p>
          <button onClick={() => router.push('/characters/new')} className="btn btn-primary">
            Crear Personaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Registrar Nueva Carrera</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="label" htmlFor="characterTrainingId">
              Personaje *
            </label>
            <select
              id="characterTrainingId"
              className="input"
              value={formData.characterTrainingId}
              onChange={(e) => setFormData({ ...formData, characterTrainingId: e.target.value })}
              required
            >
              {characters.map((char) => (
                <option key={char.id} value={char.id}>
                  {char.characterName} - {char.identifierVersion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="trackType">
              Tipo de Pista *
            </label>
            <select
              id="trackType"
              className="input"
              value={formData.trackType}
              onChange={(e) => setFormData({ ...formData, trackType: e.target.value as TrackType })}
              required
            >
              {Object.entries(TRACK_NAMES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="finalPlace">
              Posición Final (1-18) *
            </label>
            <input
              id="finalPlace"
              type="number"
              className="input"
              min="1"
              max="18"
              value={formData.finalPlace}
              onChange={(e) => setFormData({ ...formData, finalPlace: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="score">
              Score *
            </label>
            <input
              id="score"
              type="number"
              className="input"
              min="0"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="date">
              Fecha
            </label>
            <input
              id="date"
              type="date"
              className="input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="label" htmlFor="rareSkillsCount">
              Habilidades Raras Activadas
            </label>
            <input
              id="rareSkillsCount"
              type="number"
              className="input"
              min="0"
              value={formData.rareSkillsCount}
              onChange={(e) => setFormData({ ...formData, rareSkillsCount: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <label className="label" htmlFor="normalSkillsCount">
              Habilidades Normales Activadas
            </label>
            <input
              id="normalSkillsCount"
              type="number"
              className="input"
              min="0"
              value={formData.normalSkillsCount}
              onChange={(e) => setFormData({ ...formData, normalSkillsCount: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="uniqueSkillActivated"
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={formData.uniqueSkillActivated}
              onChange={(e) => setFormData({ ...formData, uniqueSkillActivated: e.target.checked })}
            />
            <label htmlFor="uniqueSkillActivated" className="ml-2 text-sm text-gray-700">
              Se activó habilidad única
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="goodPositioning"
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={formData.goodPositioning}
              onChange={(e) => setFormData({ ...formData, goodPositioning: e.target.checked })}
            />
            <label htmlFor="goodPositioning" className="ml-2 text-sm text-gray-700">
              Buen posicionamiento
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="rushed"
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              checked={formData.rushed}
              onChange={(e) => setFormData({ ...formData, rushed: e.target.checked })}
            />
            <label htmlFor="rushed" className="ml-2 text-sm text-gray-700">
              Rushed (afectó el rendimiento)
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Carrera'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
