'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { profileAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function FriendsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showCharacters, setShowCharacters] = useState(true);
  const [showBestRuns, setShowBestRuns] = useState(true);
  const [showRecentActivity, setShowRecentActivity] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await profileAPI.getMe();
      const data = response.data;
      
      setDisplayName(data.displayName || '');
      setIsProfilePublic(data.isProfilePublic || false);
      
      if (data.profileSettings) {
        setShowStats(data.profileSettings.showStats);
        setShowCharacters(data.profileSettings.showCharacters);
        setShowBestRuns(data.profileSettings.showBestRuns);
        setShowRecentActivity(data.profileSettings.showRecentActivity);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileAPI.updateSettings({
        displayName: displayName.trim() || null,
        isProfilePublic,
        showStats,
        showCharacters,
        showBestRuns,
        showRecentActivity,
      });
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando configuración...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de Privacidad</h1>
          <p className="text-gray-600 mt-2">
            Controla qué información pueden ver tus amigos
          </p>
        </div>
        <Link href="/friends" className="btn btn-secondary">
          ← Volver
        </Link>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Display Name */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Información de Perfil</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre para Mostrar (Opcional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Deja vacío para usar tu username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Este nombre se mostrará a tus amigos en lugar de tu username
            </p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="isProfilePublic"
              checked={isProfilePublic}
              onChange={(e) => setIsProfilePublic(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1">
              <label htmlFor="isProfilePublic" className="font-medium text-gray-900 cursor-pointer">
                Perfil Público
              </label>
              <p className="text-sm text-gray-600">
                Permite que cualquiera con tu código pueda ver tu perfil, no solo tus amigos
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">¿Qué pueden ver tus amigos?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Selecciona qué información quieres compartir con tus amigos
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={showStats}
                onChange={(e) => setShowStats(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-gray-900">📊 Estadísticas Generales</p>
                <p className="text-sm text-gray-600">
                  Total de carreras, score promedio, posición promedio, etc.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={showCharacters}
                onChange={(e) => setShowCharacters(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-gray-900">👥 Lista de Personajes</p>
                <p className="text-sm text-gray-600">
                  Personajes que has entrenado y cantidad de carreras con cada uno
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={showBestRuns}
                onChange={(e) => setShowBestRuns(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-gray-900">🏆 Mejores Carreras</p>
                <p className="text-sm text-gray-600">
                  Top 10 de tus mejores carreras con detalles
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={showRecentActivity}
                onChange={(e) => setShowRecentActivity(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div>
                <p className="font-medium text-gray-900">⏰ Actividad Reciente</p>
                <p className="text-sm text-gray-600">
                  Últimas carreras registradas y nuevos personajes (Próximamente)
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex-1"
          >
            {saving ? 'Guardando...' : '💾 Guardar Configuración'}
          </button>
        </div>

        {/* Info Box */}
        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2">💡 Nota Importante</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>Estos ajustes solo aplican a tus amigos y personas con tu código</li>
            <li>Tu información nunca será visible públicamente sin tu permiso</li>
            <li>Puedes cambiar esta configuración en cualquier momento</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
