'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { runAPI, characterAPI } from '@/lib/api';
import { Run } from '@/lib/types';
import { TRACK_NAMES } from '@/lib/constants';
import { format } from 'date-fns';

const TRACK_TYPES = [
  { value: 'TURF_SHORT', label: 'Césped Corto' },
  { value: 'TURF_MILE', label: 'Césped Milla' },
  { value: 'TURF_MEDIUM', label: 'Césped Medio' },
  { value: 'TURF_LONG', label: 'Césped Largo' },
  { value: 'DIRT', label: 'Tierra' },
];

export default function RunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedTrackType, setSelectedTrackType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minPlace, setMinPlace] = useState('');
  const [maxPlace, setMaxPlace] = useState('');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [minRareSkills, setMinRareSkills] = useState('');
  const [minNormalSkills, setMinNormalSkills] = useState('');
  const [filterRushed, setFilterRushed] = useState<string>(''); // '', 'true', 'false'
  const [filterGoodPos, setFilterGoodPos] = useState<string>('');
  const [filterUniqueSkill, setFilterUniqueSkill] = useState<string>('');

  useEffect(() => {
    loadCharacters();
    loadRuns();
  }, []);

  const loadCharacters = async () => {
    try {
      const response = await characterAPI.getAll();
      setCharacters(response.data);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  };

  const loadRuns = async () => {
    try {
      const params: any = {};
      if (selectedCharacter) params.characterTrainingId = selectedCharacter;
      if (selectedTrackType) params.trackType = selectedTrackType;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (minPlace) params.minPlace = parseInt(minPlace);
      if (maxPlace) params.maxPlace = parseInt(maxPlace);
      if (minScore) params.minScore = parseInt(minScore);
      if (maxScore) params.maxScore = parseInt(maxScore);
      if (minRareSkills) params.rareSkills = parseInt(minRareSkills);
      if (minNormalSkills) params.normalSkills = parseInt(minNormalSkills);
      if (filterRushed) params.rushed = filterRushed === 'true';
      if (filterGoodPos) params.goodPositioning = filterGoodPos === 'true';
      if (filterUniqueSkill) params.uniqueSkillActivated = filterUniqueSkill === 'true';

      const response = await runAPI.getAll(params);
      setRuns(response.data);
    } catch (error) {
      console.error('Error loading runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setLoading(true);
    loadRuns();
  };

  const handleClearFilters = () => {
    setSelectedCharacter('');
    setSelectedTrackType('');
    setStartDate('');
    setEndDate('');
    setMinPlace('');
    setMaxPlace('');
    setMinScore('');
    setMaxScore('');
    setMinRareSkills('');
    setMinNormalSkills('');
    setFilterRushed('');
    setFilterGoodPos('');
    setFilterUniqueSkill('');
    setLoading(true);
    loadRuns();
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
            {/* Character Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personaje
              </label>
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos</option>
                {characters.map(char => (
                  <option key={char.id} value={char.id}>
                    {char.characterName} ({char.identifierVersion})
                  </option>
                ))}
              </select>
            </div>

            {/* Track Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pista
              </label>
              <select
                value={selectedTrackType}
                onChange={(e) => setSelectedTrackType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todas</option>
                {TRACK_TYPES.map(track => (
                  <option key={track.value} value={track.value}>
                    {track.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Place Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición Mínima
              </label>
              <input
                type="number"
                value={minPlace}
                onChange={(e) => setMinPlace(e.target.value)}
                placeholder="1"
                min="1"
                max="18"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición Máxima
              </label>
              <input
                type="number"
                value={maxPlace}
                onChange={(e) => setMaxPlace(e.target.value)}
                placeholder="18"
                min="1"
                max="18"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score Mínimo
              </label>
              <input
                type="number"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                placeholder="0"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score Máximo
              </label>
              <input
                type="number"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="999999"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mínimo Skills Raras
              </label>
              <input
                type="number"
                value={minRareSkills}
                onChange={(e) => setMinRareSkills(e.target.value)}
                placeholder="0"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mínimo Skills Normales
              </label>
              <input
                type="number"
                value={minNormalSkills}
                onChange={(e) => setMinNormalSkills(e.target.value)}
                placeholder="0"
                min="0"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rushed
              </label>
              <select
                value={filterRushed}
                onChange={(e) => setFilterRushed(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Good Positioning
              </label>
              <select
                value={filterGoodPos}
                onChange={(e) => setFilterGoodPos(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Única Activada
              </label>
              <select
                value={filterUniqueSkill}
                onChange={(e) => setFilterUniqueSkill(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Action Buttons */}
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
                    <span className={`px-2 py-1 text-xs font-medium rounded ${run.finalPlace <= 3
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
