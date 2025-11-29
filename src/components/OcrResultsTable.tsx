'use client';

import { useState } from 'react';

interface OcrResultItem {
    detectedName: string;
    score: number;
    candidates: Array<{
        id: string;
        characterName: string;
        identifierVersion: string;
    }>;
    bestMatchId: string | null;
}

interface OcrResultsTableProps {
    results: OcrResultItem[];
    onSave: (confirmedData: any[]) => void;
    onCancel: () => void;
}

export default function OcrResultsTable({ results, onSave, onCancel }: OcrResultsTableProps) {
    const [items, setItems] = useState(results);

    const handleMatchChange = (index: number, newMatchId: string) => {
        const newItems = [...items];
        newItems[index].bestMatchId = newMatchId;
        setItems(newItems);
    };

    const handleNameChange = (index: number, newName: string) => {
        const newItems = [...items];
        newItems[index].detectedName = newName;
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
