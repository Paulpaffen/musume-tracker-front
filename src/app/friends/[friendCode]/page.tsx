'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { profileAPI } from '@/lib/api';
import { TRACK_NAMES } from '@/lib/constants';
import { TrackType } from '@/lib/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function FriendProfilePage() {
  const params = useParams();
  const friendCode = params.friendCode as string;

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [bestRuns, setBestRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'characters' | 'runs'>('stats');

  useEffect(() => {
    loadProfile();
  }, [friendCode]);

  const loadProfile = async () => {
    try {
      const profileRes = await profileAPI.getPublicProfile(friendCode);
      setProfile(profileRes.data);

      if (profileRes.data.isPrivate) {
        setLoading(false);
        return;
      }

      // Load data based on settings
      const promises: Promise<any>[] = [];

      if (profileRes.data.settings?.showStats) {
        promises.push(
          profileAPI.getUserStats(friendCode).then((res) => setStats(res.data))
        );
      }

      if (profileRes.data.settings?.showCharacters) {
        promises.push(
          profileAPI.getUserCharacters(friendCode).then((res) => setCharacters(res.data.characters))
        );
      }

      if (profileRes.data.settings?.showBestRuns) {
        promises.push(
          profileAPI.getUserBestRuns(friendCode).then((res) => setBestRuns(res.data.bestRuns))
        );
      }

      await Promise.all(promises);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando perfil...</div>;
  }

  if (!profile) {
    return (
      <div className="card text-center py-12">
        <p className="text-xl font-semibold text-gray-900 mb-2">Usuario no encontrado</p>
        <Link href="/friends" className="btn btn-primary">
          Volver a Amigos
        </Link>
      </div>
    );
  }

  if (profile.isPrivate) {
    return (
      <div>
        <Link href="/friends" className="btn btn-secondary mb-6">
          ← Volver
        </Link>
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Perfil Privado</h2>
          <p className="text-gray-600 mb-4">
            {profile.displayName || profile.username} ha configurado su perfil como privado
          </p>
          <p className="text-sm text-gray-500">
            Necesitas ser amigo para ver su información
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/friends" className="btn btn-secondary mb-6">
        ← Volver a Amigos
      </Link>

      {/* Profile Header */}
      <div className="card mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {(profile.displayName || profile.username)[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {profile.displayName || profile.username}
            </h1>
            {profile.displayName && (
              <p className="text-gray-600">@{profile.username}</p>
            )}
            {profile.areFriends && (
              <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Amigos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {profile.settings?.showStats && (
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'stats'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Estadísticas
          </button>
        )}
        {profile.settings?.showCharacters && (
          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'characters'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 Personajes
          </button>
        )}
        {profile.settings?.showBestRuns && (
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'runs'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏆 Mejores Carreras
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600">Total de Carreras</p>
            <p className="text-3xl font-bold text-primary-600">{stats.totalRuns}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Score Promedio</p>
            <p className="text-3xl font-bold text-primary-600">{stats.averageScore}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Posición Promedio</p>
            <p className="text-3xl font-bold text-primary-600">{stats.averageFinalPlace}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600">Tasa de Rushed</p>
            <p className="text-3xl font-bold text-red-600">{stats.rushedRate}%</p>
          </div>
        </div>
      )}

      {activeTab === 'characters' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((character) => (
            <div key={character.id} className="card">
              <h3 className="text-lg font-bold text-gray-900">
                {character.characterName}
              </h3>
              <p className="text-sm text-gray-600">{character.identifierVersion}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-sm font-medium">
                  {character._count?.runs || 0} carreras
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'runs' && (
        <div className="space-y-3">
          {bestRuns.map((run, index) => (
            <div key={run.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {run.characterTraining?.characterName} - {run.characterTraining?.identifierVersion}
                    </p>
                    <p className="text-sm text-gray-600">
                      {TRACK_NAMES[run.trackType as TrackType]} • Posición {run.finalPlace}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{run.score}</p>
                  <p className="text-xs text-gray-500">{format(new Date(run.date), 'dd/MM/yyyy')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
