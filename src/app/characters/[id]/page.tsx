'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { characterAPI, statsAPI } from '@/lib/api';
import { CharacterTraining } from '@/lib/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { format } from 'date-fns';
import { TRACK_NAMES, TRACK_COLORS } from '@/lib/constants';

interface CharacterStats {
  totalRuns: number;
  averageScore: number;
  averageFinalPlace: number;
  bestScore: number;
  worstScore: number;
  byTrack: Array<{
    trackType: string;
    count: number;
    averageScore: number;
    averagePlace: number;
  }>;
  uniqueSkillRate: number;
  rushedRate: number;
  goodPositioningRate: number;
  averageRareSkills: number;
  averageNormalSkills: number;
  recentHistory: Array<{
    date: string;
    score: number;
    finalPlace: number;
    rareSkills: number;
    normalSkills: number;
  }>;
}

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export default function CharacterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<CharacterTraining | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScore, setShowScore] = useState(true);
  const [showSkills, setShowSkills] = useState(true);
  const [showPlace, setShowPlace] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load character details
      const charResponse = await characterAPI.getOne(params.id as string);
      setCharacter(charResponse.data);

      // Load character statistics
      const statsResponse = await statsAPI.getCharacter(params.id as string);
      setStats(statsResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error || 'Personaje no encontrado'}</p>
        </div>
        <button
          onClick={() => router.push('/characters')}
          className="btn-secondary"
        >
          ← Volver a Personajes
        </button>
      </div>
    );
  }

  // Helper to safely get track name
  const getTrackName = (trackType: string) => {
    return (TRACK_NAMES as Record<string, string>)[trackType] || trackType;
  };

  // Helper to get creation date with fallback
  const getCreationDate = () => {
    if (!character) return '';

    // Try createdAt first
    const createdDate = new Date(character.createdAt);
    if (!isNaN(createdDate.getTime())) {
      return createdDate.toLocaleDateString('es-ES');
    }

    // Fallback to oldest run if available
    if (character.runs && character.runs.length > 0) {
      // runs are sorted by date desc, so the last one is the oldest in this list
      const oldestRun = character.runs[character.runs.length - 1];
      const runDate = new Date(oldestRun.date);
      if (!isNaN(runDate.getTime())) {
        return runDate.toLocaleDateString('es-ES');
      }
    }

    return 'Fecha desconocida';
  };

  // Prepare data for charts
  const trackData = stats?.byTrack?.map((track) => ({
    name: getTrackName(track.trackType),
    'Score Promedio': Math.round(track.averageScore),
    'Carreras': track.count,
    'Posición Promedio': track.averagePlace.toFixed(1),
  })) || [];

  const performanceData = [
    { name: 'Skill Única Activada', value: stats?.uniqueSkillRate || 0 },
    { name: 'Good Positioning', value: stats?.goodPositioningRate || 0 },
    { name: 'Rushed', value: stats?.rushedRate || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => router.push('/characters')}
            className="text-primary-600 hover:text-primary-700 mb-2 flex items-center gap-2"
          >
            ← Volver a Personajes
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {character.characterName}
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            {character.identifierVersion}
          </p>
          {character.notes && (
            <p className="text-gray-500 mt-2 italic">{character.notes}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">
            Creado: {getCreationDate()}
          </p>
        </div>
        <div>
          <button
            onClick={() => router.push(`/characters/${params.id}/edit`)}
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Edit Character
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && stats.totalRuns > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Total Carreras</h3>
              <p className="text-3xl font-bold text-primary-600 mt-2">
                {stats.totalRuns}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Score Promedio</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {Math.round(stats.averageScore)}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Mejor Score</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.bestScore}
              </p>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-600">Posición Promedio</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {stats.averageFinalPlace.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance by Track */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Rendimiento por Pista
              </h2>
              {trackData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Score Promedio" fill="#ec4899" />
                    <Bar dataKey="Carreras" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
              )}
            </div>

            {/* Performance Rates */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tasas de Rendimiento
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${(value * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent History Chart */}
          {stats.recentHistory && stats.recentHistory.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Historial Reciente (Últimas {stats.recentHistory.length} carreras)
                </h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showScore}
                      onChange={(e) => setShowScore(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Score
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showSkills}
                      onChange={(e) => setShowSkills(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Skills (Raras/Normales)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={showPlace}
                      onChange={(e) => setShowPlace(e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    Posición
                  </label>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.recentHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'dd/MM')}
                  />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
                  />
                  <Legend />
                  {showScore && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      name="Score"
                      strokeWidth={2}
                    />
                  )}
                  {showSkills && (
                    <>
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="rareSkills"
                        stroke="#f59e0b"
                        name="Skills Raras"
                        strokeWidth={2}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="normalSkills"
                        stroke="#10b981"
                        name="Skills Normales"
                        strokeWidth={2}
                      />
                    </>
                  )}
                  {showPlace && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="finalPlace"
                      stroke="#ef4444"
                      name="Posición"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Track Details Table */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Detalles por Tipo de Pista
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4">Tipo de Pista</th>
                    <th className="text-center py-3 px-4">Carreras</th>
                    <th className="text-center py-3 px-4">Score Promedio</th>
                    <th className="text-center py-3 px-4">Posición Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byTrack?.map((track) => (
                    <tr key={track.trackType} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        {getTrackName(track.trackType)}
                      </td>
                      <td className="text-center py-3 px-4">{track.count}</td>
                      <td className="text-center py-3 px-4 font-semibold text-primary-600">
                        {Math.round(track.averageScore)}
                      </td>
                      <td className="text-center py-3 px-4">
                        {track.averagePlace.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Indicadores de Rendimiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-4 bg-pink-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Tasa de Activación de Skill Única
                </h3>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-pink-600">
                    {(stats.uniqueSkillRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    de {stats.totalRuns} carreras
                  </p>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Tasa de Good Positioning
                </h3>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-blue-600">
                    {(stats.goodPositioningRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    de {stats.totalRuns} carreras
                  </p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Tasa de Rushed
                </h3>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-purple-600">
                    {(stats.rushedRate * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    de {stats.totalRuns} carreras
                  </p>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Promedio Skills Raras
                </h3>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.averageRareSkills}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Promedio Skills Normales
                </h3>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-green-600">
                    {stats.averageNormalSkills}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">
            Este personaje aún no tiene carreras registradas.
          </p>
          <button
            onClick={() => router.push('/runs/new')}
            className="btn-primary"
          >
            Registrar Primera Carrera
          </button>
        </div>
      )
      }
    </div >
  );
}
