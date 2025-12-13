'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { statsAPI } from '@/lib/api';
import { TRACK_NAMES } from '@/lib/constants';

interface TrainingDataPoint {
    score: number;
    finalPlace: number;
    rareSkills: number;
    normalSkills: number;
    trackType: string;
    rushed: boolean;
    goodPositioning: boolean;
    uniqueSkillActivated: boolean;
}

export default function SimulatorPage() {
    const router = useRouter();
    const [trainingData, setTrainingData] = useState<TrainingDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter State
    const [selectedTrack, setSelectedTrack] = useState<string>('ALL');

    // Simulator State
    const [simRareSkills, setSimRareSkills] = useState(2);
    const [simNormalSkills, setSimNormalSkills] = useState(4);
    const [simPlace, setSimPlace] = useState(1);
    const [simRushed, setSimRushed] = useState(false);
    const [simGoodPositioning, setSimGoodPositioning] = useState(false);
    const [simUniqueSkill, setSimUniqueSkill] = useState(false);
    const [simPrediction, setSimPrediction] = useState<{ score: number; neighbors: any[] } | null>(null);

    useEffect(() => {
        loadData();
    }, [selectedTrack]);

    useEffect(() => {
        if (trainingData.length > 0) {
            runSimulation();
        }
    }, [simRareSkills, simNormalSkills, simPlace, simRushed, simGoodPositioning, simUniqueSkill, trainingData]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await statsAPI.getTrainingData(selectedTrack === 'ALL' ? undefined : selectedTrack);
            setTrainingData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar los datos de entrenamiento');
        } finally {
            setLoading(false);
        }
    };

    const runSimulation = () => {
        if (!trainingData || trainingData.length === 0) return;

        // Simple KNN Implementation (K=5)
        const k = 5;
        const data = trainingData;

        // Calculate distances
        const distances = data.map(point => {
            const dRare = (point.rareSkills - simRareSkills) / 10;
            const dNormal = (point.normalSkills - simNormalSkills) / 20;
            const dPlace = (point.finalPlace - simPlace) / 18;
            const dRushed = point.rushed === simRushed ? 0 : 1;
            const dGoodPos = point.goodPositioning === simGoodPositioning ? 0 : 1;
            const dUnique = point.uniqueSkillActivated === simUniqueSkill ? 0 : 1;

            const distance = Math.sqrt(
                dRare * dRare +
                dNormal * dNormal +
                dPlace * dPlace +
                dRushed * dRushed +
                dGoodPos * dGoodPos +
                dUnique * dUnique
            );
            return { ...point, distance };
        });

        // Sort by distance and take top K
        const neighbors = distances.sort((a, b) => a.distance - b.distance).slice(0, k);

        // Weighted average score
        let totalWeight = 0;
        let weightedScore = 0;

        neighbors.forEach(n => {
            const weight = 1 / (n.distance + 0.0001);
            weightedScore += n.score * weight;
            totalWeight += weight;
        });

        setSimPrediction({
            score: Math.round(weightedScore / totalWeight),
            neighbors
        });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Simulador Global de Rendimiento
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                        Utiliza Inteligencia Artificial (KNN) para predecir resultados basados en todo tu historial de carreras.
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="btn-secondary"
                >
                    Volver al Dashboard
                </button>
            </div>

            {/* Filters */}
            <div className="card">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filtrar por Tipo de Pista
                </label>
                <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                    <option value="ALL">Todas las Pistas</option>
                    {Object.entries(TRACK_NAMES).map(([key, name]) => (
                        <option key={key} value={key}>
                            {name}
                        </option>
                    ))}
                </select>
                <p className="text-sm text-gray-500 mt-2">
                    Datos disponibles para simulación: <span className="font-bold">{trainingData.length} carreras</span>
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                </div>
            ) : (
                <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">🤖</span>
                        <h2 className="text-xl font-bold text-gray-900">
                            Configuración de la Simulación
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Controls */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills Raras: <span className="font-bold text-indigo-600">{simRareSkills}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={simRareSkills}
                                    onChange={(e) => setSimRareSkills(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills Normales: <span className="font-bold text-indigo-600">{simNormalSkills}</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={simNormalSkills}
                                    onChange={(e) => setSimNormalSkills(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Posición Final: <span className="font-bold text-indigo-600">{simPlace}</span>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="18"
                                    value={simPlace}
                                    onChange={(e) => setSimPlace(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={simUniqueSkill}
                                        onChange={(e) => setSimUniqueSkill(e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Skill Única Activada</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={simGoodPositioning}
                                        onChange={(e) => setSimGoodPositioning(e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Good Positioning</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={simRushed}
                                        onChange={(e) => setSimRushed(e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Rushed (Stamina Agotada)</span>
                                </label>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                Score Predicho
                            </h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-4xl font-bold text-indigo-600">
                                    {simPrediction?.score.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-400">pts</span>
                            </div>

                            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                                Basado en las 5 carreras más similares (Global):
                            </h4>
                            <div className="space-y-2">
                                {simPrediction?.neighbors.map((n, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded hover:bg-indigo-50 transition-colors">
                                        <span className="text-gray-600">
                                            #{n.finalPlace} | {n.rareSkills} Raras | {n.normalSkills} Normales
                                        </span>
                                        <span className="font-bold text-gray-900">{n.score.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
