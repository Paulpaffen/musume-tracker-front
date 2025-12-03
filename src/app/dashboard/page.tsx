'use client';

import { useState, useEffect } from 'react';
import { statsAPI } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TRACK_NAMES, TRACK_COLORS } from '@/lib/constants';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await statsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando estadísticas...</div>;
  }

  if (!stats || stats.overview.totalRuns === 0) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido!</h2>
        <p className="text-gray-600 mb-4">
          Aún no tienes carreras registradas. Comienza creando un personaje y registrando tus runs.
        </p>
      </div>
    );
  }

  const { overview, byTrack, byCharacter, recentRuns, bestRuns } = stats;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Carreras</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{overview.totalRuns}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Score Promedio</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{overview.averageScore}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Posición Promedio</p>
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{overview.averageFinalPlace}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de Rushed</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{overview.rushedRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Habilidades Únicas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.uniqueSkillRate.toFixed(1)}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Buen Posicionamiento</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.goodPositioningRate.toFixed(1)}%</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Skills Raras (Prom.)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{overview.averageRareSkills.toFixed(1)}</p>
        </div>
      </div>

      {/* Stats by Track */}
      {byTrack.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Rendimiento por Pista</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byTrack}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="trackType"
                tickFormatter={(value) => TRACK_NAMES[value as keyof typeof TRACK_NAMES]}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                labelFormatter={(value) => TRACK_NAMES[value as keyof typeof TRACK_NAMES]}
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="averageScore" fill="#ec4899" name="Score Promedio" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pista</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Carreras</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Score Prom.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mejor Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Rushed %</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {byTrack.map((track) => (
                  <tr key={track.trackType}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {TRACK_NAMES[track.trackType]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-300">{track.totalRuns}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-300">{track.averageScore}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-primary-600 dark:text-primary-400">
                      {track.bestScore}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={track.rushedRate > 30 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-900 dark:text-gray-300'}>
                        {track.rushedRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats by Character */}
      {byCharacter.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Rendimiento por Personaje</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Personaje</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Versión</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Carreras</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Score Prom.</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Mejor Score</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {byCharacter.map((char) => (
                  <tr key={char.characterId}>
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-white">{char.characterName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {char.identifierVersion}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-300">{char.totalRuns}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-gray-300">{char.averageScore}</td>
                    <td className="px-4 py-3 whitespace-nowrap font-bold text-primary-600 dark:text-primary-400">
                      {char.bestScore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Best Runs */}
      {bestRuns.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Mejores Carreras</h2>
          <div className="space-y-3">
            {bestRuns.slice(0, 5).map((run) => (
              <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {run.characterTraining?.characterName} - {run.characterTraining?.identifierVersion}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {TRACK_NAMES[run.trackType]} • Posición {run.finalPlace}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{run.score}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(run.date), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
