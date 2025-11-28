'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { runAPI, characterAPI } from '@/lib/api';
import { CharacterTraining } from '@/lib/types';

const TRACK_TYPES = [
  { value: 'TURF_SHORT', label: 'Césped Corto' },
  { value: 'TURF_MILE', label: 'Césped Milla' },
  { value: 'TURF_MEDIUM', label: 'Césped Medio' },
  { value: 'TURF_LONG', label: 'Césped Largo' },
  { value: 'DIRT', label: 'Tierra' },
];

export default function EditRunPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [characters, setCharacters] = useState<CharacterTraining[]>([]);

  const [formData, setFormData] = useState({
    characterTrainingId: '',
    trackType: 'TURF_SHORT',
    finalPlace: 1,
    rareSkillsCount: 0,
    normalSkillsCount: 0,
    uniqueSkillActivated: false,
    goodPositioning: false,
    rushed: false,
    score: 0,
    date: '',
  });

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load characters
      const charsResponse = await characterAPI.getAll();
      setCharacters(charsResponse.data);

      // Load run details
      const runResponse = await runAPI.getOne(params.id as string);
      const run = runResponse.data;

      setFormData({
        characterTrainingId: run.characterTrainingId,
        trackType: run.trackType,
        finalPlace: run.finalPlace,
        rareSkillsCount: run.rareSkillsCount,
        normalSkillsCount: run.normalSkillsCount,
        uniqueSkillActivated: run.uniqueSkillActivated,
        goodPositioning: run.goodPositioning,
        rushed: run.rushed,
        score: run.score,
        date: run.date ? new Date(run.date).toISOString().split('T')[0] : '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await runAPI.update(params.id as string, {
        ...formData,
        date: formData.date || new Date().toISOString().split('T')[0],
      });

      router.push('/runs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la carrera');
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/runs')}
          className="text-primary-600 hover:text-primary-700 mb-2"
        >
          ← Volver a Carreras
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Editar Carrera</h1>
        <p className="text-gray-600 mt-2">
          Modifica los datos de la carrera registrada
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Personaje *
          </label>
          <select
            name="characterTrainingId"
            value={formData.characterTrainingId}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Selecciona un personaje</option>
            {characters.map((char) => (
              <option key={char.id} value={char.id}>
                {char.characterName} - {char.identifierVersion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Pista *
          </label>
          <select
            name="trackType"
            value={formData.trackType}
            onChange={handleChange}
            required
            className="input"
          >
            {TRACK_TYPES.map((track) => (
              <option key={track.value} value={track.value}>
                {track.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Posición Final (1-18) *
            </label>
            <input
              type="number"
              name="finalPlace"
              value={formData.finalPlace}
              onChange={handleChange}
              min="1"
              max="18"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score *
            </label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              min="0"
              required
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Raras *
            </label>
            <input
              type="number"
              name="rareSkillsCount"
              value={formData.rareSkillsCount}
              onChange={handleChange}
              min="0"
              required
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Normales *
            </label>
            <input
              type="number"
              name="normalSkillsCount"
              value={formData.normalSkillsCount}
              onChange={handleChange}
              min="0"
              required
              className="input"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="uniqueSkillActivated"
              checked={formData.uniqueSkillActivated}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Skill Única Activada
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="goodPositioning"
              checked={formData.goodPositioning}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Good Positioning
            </span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="rushed"
              checked={formData.rushed}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Rushed</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input"
          />
          <p className="text-sm text-gray-500 mt-1">
            Si no se especifica, se usa la fecha de hoy
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1"
          >
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/runs')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
