'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { characterAPI, api } from '../../../lib/api';

interface ComparisonData {
    characterId: string;
    characterName: string;
    identifierVersion: string;
    totalRuns: number;
    averageScore: number;
    averageFinalPlace: number;
    bestScore: number;
    worstScore: number;
    uniqueSkillRate: number;
    rushedRate: number;
    goodPositioningRate: number;
    averageRareSkills: number;
    averageNormalSkills: number;
}

export default function CompareCharactersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [characters, setCharacters] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadCharacters();
        // Check if IDs are in URL
        const ids = searchParams.get('ids');
        if (ids) {
            const idArray = ids.split(',');
            setSelectedIds(idArray);
            handleCompare(idArray);
        }
    }, []);

    const loadCharacters = async () => {
        try {
            const response = await characterAPI.getAll();
            setCharacters(response.data);
        } catch (error) {
            console.error('Failed to load characters:', error);
        }
    };

    const handleToggleCharacter = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCompare = async (ids: string[] = selectedIds) => {
        if (ids.length < 2) {
            alert('Selecciona al menos 2 personajes para comparar');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/stats/compare', { characterIds: ids });
            setComparisonData(response.data);
        } catch (error) {
            console.error('Failed to compare:', error);
            alert('Error al comparar personajes');
        } finally {
            setIsLoading(false);
        }
    };

    const getBestValue = (key: keyof ComparisonData, isLowerBetter = false) => {
        if (comparisonData.length === 0) return null;
        const values = comparisonData.map(d => d[key] as number);
        return isLowerBetter ? Math.min(...values) : Math.max(...values);
    };

    const isHighlighted = (value: number, key: keyof ComparisonData, isLowerBetter = false) => {
        const best = getBestValue(key, isLowerBetter);
        return value === best;
    };

    return (
        <div className="min-h-full">
            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                            Comparar Personajes
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
                        {/* Character Selection */}
                        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Selecciona personajes para comparar</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                {characters.map(char => (
                                    <label key={char.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(char.id)}
                                            onChange={() => handleToggleCharacter(char.id)}
                                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {char.characterName} ({char.identifierVersion})
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <button
                                onClick={() => handleCompare()}
                                disabled={selectedIds.length < 2 || isLoading}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-400"
                            >
                                {isLoading ? 'Comparando...' : `Comparar (${selectedIds.length} seleccionados)`}
                            </button>
                        </div>

                        {/* Comparison Table */}
                        {comparisonData.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Métrica</th>
                                                {comparisonData.map(char => (
                                                    <th key={char.characterId} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                        {char.characterName}<br />
                                                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">({char.identifierVersion})</span>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Total Carreras</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.totalRuns, 'totalRuns') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {char.totalRuns}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Score Promedio</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.averageScore, 'averageScore') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {char.averageScore}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Mejor Score</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.bestScore, 'bestScore') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {char.bestScore}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Posición Promedio</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.averageFinalPlace, 'averageFinalPlace', true) ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {char.averageFinalPlace}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Skills Raras (Promedio)</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.averageRareSkills, 'averageRareSkills') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {char.averageRareSkills}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Skills Normales (Promedio)</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.averageNormalSkills, 'averageNormalSkills') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {char.averageNormalSkills}
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Tasa Skill Única (%)</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.uniqueSkillRate, 'uniqueSkillRate') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {(char.uniqueSkillRate * 100).toFixed(0)}%
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Tasa Good Positioning (%)</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.goodPositioningRate, 'goodPositioningRate') ? 'bg-green-50 dark:bg-green-900/20 font-bold text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {(char.goodPositioningRate * 100).toFixed(0)}%
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white">Tasa Rushed (%)</td>
                                                {comparisonData.map(char => (
                                                    <td key={char.characterId} className={`whitespace-nowrap px-3 py-4 text-sm ${isHighlighted(char.rushedRate, 'rushedRate', true) ? 'bg-red-50 dark:bg-red-900/20 font-bold text-red-700 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {(char.rushedRate * 100).toFixed(0)}%
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                    * Los valores resaltados en verde son los mejores. Para "Rushed", el menor valor es mejor.
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
