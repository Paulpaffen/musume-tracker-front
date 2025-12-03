'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { TRACK_NAMES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface TeamMember {
    id: string;
    characterName: string;
    identifierVersion: string;
    averageScore: number;
    totalRuns: number;
    mostPlayedTrack: string;
    isMostPlayedTrack: boolean;
}

interface TeamRecommendations {
    [trackType: string]: TeamMember[];
}

const TRACK_COLORS = {
    TURF_SHORT: 'from-emerald-500 to-teal-600',
    TURF_MILE: 'from-blue-500 to-indigo-600',
    TURF_MEDIUM: 'from-purple-500 to-pink-600',
    TURF_LONG: 'from-orange-500 to-red-600',
    DIRT: 'from-amber-600 to-yellow-700',
};

const TRACK_ICONS = {
    TURF_SHORT: '⚡',
    TURF_MILE: '🏃',
    TURF_MEDIUM: '🎯',
    TURF_LONG: '🏆',
    DIRT: '🌟',
};

export default function TeamRecommendationsPage() {
    const [recommendations, setRecommendations] = useState<TeamRecommendations>({});
    const [loading, setLoading] = useState(true);
    const [selectedTrack, setSelectedTrack] = useState<string>('TURF_MEDIUM');

    useEffect(() => {
        loadRecommendations();
    }, []);

    const loadRecommendations = async () => {
        try {
            const response = await api.get('/stats/team-recommendations');
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Analizando tus mejores equipos...</p>
                </div>
            </div>
        );
    }

    const trackOrder = ['TURF_SHORT', 'TURF_MILE', 'TURF_MEDIUM', 'TURF_LONG', 'DIRT'];
    const currentTeam = recommendations[selectedTrack] || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-4">
                        ⭐ Equipos Recomendados ⭐
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Basado en tus estadísticas, estos son los mejores equipos para cada tipo de pista
                    </p>
                </div>

                {/* Track Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {trackOrder.map(track => {
                        const team = recommendations[track] || [];
                        const hasTeam = team.length > 0;

                        return (
                            <button
                                key={track}
                                onClick={() => setSelectedTrack(track)}
                                disabled={!hasTeam}
                                className={`
                  relative px-6 py-4 rounded-2xl font-bold text-white transition-all duration-300 transform
                  ${selectedTrack === track
                                        ? `bg-gradient-to-r ${TRACK_COLORS[track as keyof typeof TRACK_COLORS]} scale-110 shadow-2xl`
                                        : hasTeam
                                            ? 'bg-gray-400 dark:bg-gray-700 hover:scale-105 hover:shadow-lg'
                                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    }
                `}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{TRACK_ICONS[track as keyof typeof TRACK_ICONS]}</span>
                                    <span>{TRACK_NAMES[track as keyof typeof TRACK_NAMES]}</span>
                                </div>
                                {hasTeam && (
                                    <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                                        {team.length}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Team Display */}
                {currentTeam.length === 0 ? (
                    <div className="card text-center py-16 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        <div className="text-6xl mb-4">😔</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No hay datos suficientes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Necesitas registrar más carreras en {TRACK_NAMES[selectedTrack as keyof typeof TRACK_NAMES]} para obtener recomendaciones
                        </p>
                        <Link href="/runs/new" className="btn btn-primary">
                            Registrar Carrera
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* ACE Banner */}
                        <div className="text-center">
                            <div className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-full font-black text-xl shadow-lg transform -rotate-2">
                                👑 ACE DEL EQUIPO 👑
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="grid gap-8 md:grid-cols-3">
                            {currentTeam.map((member, index) => {
                                const isAce = index === 0;
                                const position = index + 1;

                                return (
                                    <div
                                        key={member.id}
                                        className={`
                      relative rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105
                      ${isAce
                                                ? 'md:col-span-3 shadow-2xl'
                                                : 'shadow-xl'
                                            }
                    `}
                                    >
                                        {/* Background Gradient */}
                                        <div className={`
                      absolute inset-0 bg-gradient-to-br ${TRACK_COLORS[selectedTrack as keyof typeof TRACK_COLORS]} opacity-90
                    `}></div>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full -ml-24 -mb-24"></div>

                                        {/* Content */}
                                        <div className={`relative p-8 ${isAce ? 'md:p-12' : ''}`}>
                                            {/* Position Badge */}
                                            <div className="absolute top-4 left-4">
                                                <div className={`
                          ${isAce ? 'w-16 h-16 text-3xl' : 'w-12 h-12 text-xl'}
                          bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center font-black text-white shadow-lg
                        `}>
                                                    {isAce ? '👑' : position}
                                                </div>
                                            </div>

                                            {/* Character Info */}
                                            <div className={`text-center ${isAce ? 'mt-8' : 'mt-4'}`}>
                                                <h3 className={`
                          ${isAce ? 'text-4xl md:text-5xl mb-3' : 'text-2xl mb-2'}
                          font-black text-white drop-shadow-lg
                        `}>
                                                    {member.characterName}
                                                </h3>
                                                <p className={`
                          ${isAce ? 'text-xl mb-6' : 'text-base mb-4'}
                          text-white text-opacity-90 font-semibold
                        `}>
                                                    {member.identifierVersion}
                                                </p>

                                                {/* Stats */}
                                                <div className={`
                          grid ${isAce ? 'grid-cols-2 gap-6' : 'grid-cols-1 gap-3'}
                          ${isAce ? 'max-w-md' : ''} mx-auto
                        `}>
                                                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                                                        <div className={`${isAce ? 'text-5xl' : 'text-3xl'} font-black text-white mb-1`}>
                                                            {member.averageScore.toLocaleString()}
                                                        </div>
                                                        <div className="text-white text-opacity-80 text-sm font-semibold uppercase tracking-wide">
                                                            Score Promedio
                                                        </div>
                                                    </div>
                                                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4">
                                                        <div className={`${isAce ? 'text-5xl' : 'text-3xl'} font-black text-white mb-1`}>
                                                            {member.totalRuns}
                                                        </div>
                                                        <div className="text-white text-opacity-80 text-sm font-semibold uppercase tracking-wide">
                                                            Carreras
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* View Details Button */}
                                                <Link
                                                    href={`/characters/${member.id}`}
                                                    className={`
                            inline-block mt-6 px-6 py-3 bg-white text-gray-900 rounded-full font-bold
                            hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg
                            ${isAce ? 'text-lg' : 'text-sm'}
                          `}
                                                >
                                                    Ver Detalles →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Team Summary */}
                        <div className="card bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    📊 Resumen del Equipo
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                                            {Math.round(currentTeam.reduce((sum, m) => sum + m.averageScore, 0) / currentTeam.length).toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Score Promedio del Equipo</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-pink-600 dark:text-pink-400">
                                            {currentTeam.reduce((sum, m) => sum + m.totalRuns, 0)}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Total de Carreras</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                                            {currentTeam.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Miembros del Equipo</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
