'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { runAPI } from '@/lib/api';
import { Run } from '@/lib/types';
import { TRACK_NAMES } from '@/lib/constants';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function PendingRunsPage() {
    const [pendingRuns, setPendingRuns] = useState<Run[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStates, setEditingStates] = useState<Record<string, {
        rareSkillsCount: number;
        normalSkillsCount: number;
        uniqueSkillActivated: boolean;
        goodPositioning: boolean;
        rushed: boolean;
    }>>({});

    useEffect(() => {
        loadPendingRuns();
    }, []);

    const loadPendingRuns = async () => {
        try {
            const response = await runAPI.getAll();
            const runs = response.data;

            const pending = runs.filter((run: Run) =>
                run.rareSkillsCount === 0 &&
                run.normalSkillsCount === 0 &&
                run.uniqueSkillActivated === false &&
                run.goodPositioning === false &&
                run.rushed === false
            );

            setPendingRuns(pending);

            const initialStates: any = {};
            pending.forEach((run: Run) => {
                initialStates[run.id] = {
                    rareSkillsCount: run.rareSkillsCount,
                    normalSkillsCount: run.normalSkillsCount,
                    uniqueSkillActivated: run.uniqueSkillActivated,
                    goodPositioning: run.goodPositioning,
                    rushed: run.rushed,
                };
            });
            setEditingStates(initialStates);
        } catch (error) {
            console.error('Error loading pending runs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (runId: string, field: 'rareSkillsCount' | 'normalSkillsCount') => {
        setEditingStates(prev => ({
            ...prev,
            [runId]: {
                ...prev[runId],
                [field]: prev[runId][field] + 1,
            },
        }));
    };

    const handleDecrement = (runId: string, field: 'rareSkillsCount' | 'normalSkillsCount') => {
        setEditingStates(prev => ({
            ...prev,
            [runId]: {
                ...prev[runId],
                [field]: Math.max(0, prev[runId][field] - 1),
            },
        }));
    };

    const handleToggle = (runId: string, field: 'uniqueSkillActivated' | 'goodPositioning' | 'rushed') => {
        setEditingStates(prev => ({
            ...prev,
            [runId]: {
                ...prev[runId],
                [field]: !prev[runId][field],
            },
        }));
    };

    const handleSave = async (runId: string) => {
        try {
            await runAPI.update(runId, editingStates[runId]);
            setPendingRuns(prev => prev.filter(run => run.id !== runId));
            toast.success('Guardado correctamente', {
                duration: 3000,
                position: 'bottom-left',
            });
        } catch (error) {
            console.error('Error updating run:', error);
            toast.error('Error al guardar la carrera', {
                duration: 3000,
                position: 'bottom-left',
            });
        }
    };

    if (loading) {
        return <div className="text-center py-12">Cargando carreras pendientes...</div>;
    }

    // Group runs by track type
    const trackOrder = ['TURF_SHORT', 'TURF_MILE', 'TURF_MEDIUM', 'TURF_LONG', 'DIRT'];
    const groupedRuns = pendingRuns.reduce((acc, run) => {
        if (!acc[run.trackType]) {
            acc[run.trackType] = [];
        }
        acc[run.trackType].push(run);
        return acc;
    }, {} as Record<string, Run[]>);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Carreras Pendientes</h1>
                    <p className="text-gray-600 mt-2">
                        Completa los detalles de las carreras importadas desde OCR
                    </p>
                </div>
                <Link href="/runs" className="btn btn-secondary">
                    ← Volver a Carreras
                </Link>
            </div>

            {pendingRuns.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-xl font-semibold text-gray-900 mb-2">
                        ¡No hay carreras pendientes!
                    </p>
                    <p className="text-gray-600 mb-4">
                        Todas tus carreras están completas
                    </p>
                    <Link href="/runs" className="btn btn-primary">
                        Ver Todas las Carreras
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>{pendingRuns.length}</strong> carrera{pendingRuns.length !== 1 ? 's' : ''} pendiente{pendingRuns.length !== 1 ? 's' : ''} de completar • Organizadas por tipo de pista
                        </p>
                    </div>

                    {/* Render each track type group */}
                    {trackOrder.map(trackType => {
                        const runsInTrack = groupedRuns[trackType];
                        if (!runsInTrack || runsInTrack.length === 0) return null;

                        return (
                            <div key={trackType} className="mb-10">
                                {/* Track Type Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                    <h2 className="text-xl font-bold text-gray-900 px-6 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-gray-200 shadow-sm">
                                        🏁 {TRACK_NAMES[trackType as keyof typeof TRACK_NAMES]}
                                        <span className="ml-2 text-sm font-normal text-gray-600">
                                            ({runsInTrack.length})
                                        </span>
                                    </h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-transparent to-transparent"></div>
                                </div>

                                {/* Cards Grid for this track type */}
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {runsInTrack.map((run) => (
                                        <div key={run.id} className="card hover:shadow-lg transition-shadow">
                                            {/* Run Info Header */}
                                            <div className="border-b border-gray-200 pb-4 mb-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                            {run.characterTraining?.characterName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            {run.characterTraining?.identifierVersion}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-1 text-xs font-medium rounded ${run.finalPlace <= 3
                                                        ? 'bg-green-100 text-green-800'
                                                        : run.finalPlace <= 6
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        #{run.finalPlace}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Score:</span>
                                                        <span className="ml-1 font-bold text-primary-600">{run.score}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Fecha:</span>
                                                        <span className="ml-1">{format(new Date(run.date), 'dd/MM/yyyy')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Editable Fields */}
                                            <div className="space-y-4">
                                                {/* Skills Counters */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Skills Raras
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleDecrement(run.id, 'rareSkillsCount')}
                                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl flex items-center justify-center"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-2xl font-bold text-purple-600 w-12 text-center">
                                                            {editingStates[run.id]?.rareSkillsCount || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrement(run.id, 'rareSkillsCount')}
                                                            className="w-10 h-10 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xl flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Skills Normales
                                                    </label>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleDecrement(run.id, 'normalSkillsCount')}
                                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xl flex items-center justify-center"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                                                            {editingStates[run.id]?.normalSkillsCount || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => handleIncrement(run.id, 'normalSkillsCount')}
                                                            className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-xl flex items-center justify-center"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Checkboxes */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={editingStates[run.id]?.uniqueSkillActivated || false}
                                                            onChange={() => handleToggle(run.id, 'uniqueSkillActivated')}
                                                            className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Skill Única Activada
                                                        </span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={editingStates[run.id]?.goodPositioning || false}
                                                            onChange={() => handleToggle(run.id, 'goodPositioning')}
                                                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Good Positioning
                                                        </span>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={editingStates[run.id]?.rushed || false}
                                                            onChange={() => handleToggle(run.id, 'rushed')}
                                                            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Rushed
                                                        </span>
                                                    </label>
                                                </div>

                                                {/* Save Button */}
                                                <button
                                                    onClick={() => handleSave(run.id)}
                                                    className="w-full btn btn-primary mt-4"
                                                >
                                                    💾 Guardar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
