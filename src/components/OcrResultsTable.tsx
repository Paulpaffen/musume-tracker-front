'use client';

import { useState } from 'react';
import { fetchCharacterCandidates } from '../lib/fetchCharacterCandidates';

interface OcrResultItem {
    detectedName: string;
    score: number;
    candidates: Array<{
        id: string;
        characterName: string;
        identifierVersion: string;
    }>;
    bestMatchId: string | null;
    defaults?: {
        trackType: string;
        finalPlace: number;
    };
    // New fields
    trackType: string;
    finalPlace: number;
}

interface OcrResultsTableProps {
    results: OcrResultItem[];
    onSave: (confirmedData: any[]) => void;
    onCancel: () => void;
}

const TRACK_TYPES = [
    { value: 'TURF_SHORT', label: 'Césped Corto' },
    { value: 'TURF_MILE', label: 'Césped Milla' },
    { value: 'TURF_MEDIUM', label: 'Césped Medio' },
    { value: 'TURF_LONG', label: 'Césped Largo' },
    { value: 'DIRT', label: 'Tierra' },
];

export default function OcrResultsTable({ results, onSave, onCancel }: OcrResultsTableProps) {
    // Initialize items with default values for new fields if not present
    const [items, setItems] = useState<OcrResultItem[]>(results.map(r => ({
        ...r,
        trackType: r.defaults?.trackType || 'TURF_MEDIUM',
        finalPlace: r.defaults?.finalPlace || 1
    })));

    const handleMatchChange = (index: number, newMatchId: string) => {
        const newItems = [...items];
        newItems[index].bestMatchId = newMatchId;
        setItems(newItems);
    };

    const handleNameChange = (index: number, newName: string) => {
        const newItems = [...items];
        newItems[index].detectedName = newName;
        setItems(newItems);

        // Debounce or just fire and forget update for candidates
        // We use a timeout to avoid spamming the API on every keystroke
        if ((handleNameChange as any).timeout) clearTimeout((handleNameChange as any).timeout);

        (handleNameChange as any).timeout = setTimeout(async () => {
            try {
                const candidates = await fetchCharacterCandidates(newName);
                setItems(prevItems => {
                    const updated = [...prevItems];
                    // Check if the row still exists and matches (simple check)
                    if (updated[index]) {
                        updated[index].candidates = candidates;
                        // Only auto-select if we don't have a match or the current match is invalid
                        // But for now, let's just update candidates to avoid disrupting user selection
                        // updated[index].bestMatchId = candidates.length > 0 ? candidates[0].id : null;
                    }
                    return updated;
                });
            } catch (err) {
                console.error("Error fetching candidates", err);
            }
        }, 500);
    };

    const handleTrackTypeChange = (index: number, newType: string) => {
        const newItems = [...items];
        newItems[index].trackType = newType;
        setItems(newItems);
    };

    const handleFinalPlaceChange = (index: number, newPlace: number) => {
        const newItems = [...items];
        newItems[index].finalPlace = newPlace;
        setItems(newItems);
    };

    const handleRemoveRow = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSave = () => {
        // Filter out items with no match selected
        const validItems = items.filter(item => item.bestMatchId);
        onSave(validItems);
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Review Extracted Data</h3>
            <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Detected Name</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned Character</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Track</th>
                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Place</th>
                            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                    <input
                                        type="text"
                                        value={item.detectedName}
                                        onChange={e => handleNameChange(index, e.target.value)}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {item.score.toLocaleString()}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        value={item.bestMatchId || ''}
                                        onChange={(e) => handleMatchChange(index, e.target.value)}
                                    >
                                        <option value="">-- Select Character --</option>
                                        {item.candidates.map((candidate) => (
                                            <option key={candidate.id} value={candidate.id}>
                                                {candidate.characterName} ({candidate.identifierVersion})
                                            </option>
                                        ))}
                                    </select>
                                    {item.candidates.length === 0 && (
                                        <span className="text-xs text-red-500 ml-2">No match found</span>
                                    )}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <select
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                        value={item.trackType}
                                        onChange={(e) => handleTrackTypeChange(index, e.target.value)}
                                    >
                                        {TRACK_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    <input
                                        type="number"
                                        min="1"
                                        max="18"
                                        value={item.finalPlace}
                                        onChange={e => handleFinalPlaceChange(index, parseInt(e.target.value))}
                                        className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    />
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleRemoveRow(index)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" onClick={onCancel} className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Save Records
                </button>
            </div>
        </div>
    );
}
