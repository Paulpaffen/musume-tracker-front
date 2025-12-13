'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../../../components/Navbar';
import { characterAPI } from '../../../../lib/api';

export default function EditCharacterPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        characterName: '',
        identifierVersion: '',
        notes: '',
        speed: 0,
        stamina: 0,
        power: 0,
        guts: 0,
        wit: 0,
        rank: '',
    });

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await characterAPI.getOne(params.id);
                const char = response.data;
                setFormData({
                    characterName: char.characterName,
                    identifierVersion: char.identifierVersion,
                    notes: char.notes || '',
                    speed: char.speed || 0,
                    stamina: char.stamina || 0,
                    power: char.power || 0,
                    guts: char.guts || 0,
                    wit: char.wit || 0,
                    rank: char.rank || '',
                });
            } catch (error) {
                console.error('Failed to fetch character:', error);
                alert('Failed to load character details.');
                router.push('/characters');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacter();
    }, [params.id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await characterAPI.update(params.id, formData);
            alert('Character updated successfully!');
            router.push(`/characters/${params.id}`);
        } catch (error) {
            console.error('Failed to update character:', error);
            alert('Failed to update character. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-full">
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full">
            <Navbar />
            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                            Edit Character
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-3xl sm:px-6 lg:px-8 py-8">
                        <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                            <div className="px-4 py-6 sm:p-8">
                                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-4">
                                        <label htmlFor="characterName" className="block text-sm font-medium leading-6 text-gray-900">
                                            Character Name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="characterName"
                                                id="characterName"
                                                required
                                                value={formData.characterName}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="sm:col-span-4">
                                        <label htmlFor="identifierVersion" className="block text-sm font-medium leading-6 text-gray-900">
                                            Identifier / Version
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="identifierVersion"
                                                id="identifierVersion"
                                                required
                                                value={formData.identifierVersion}
                                                onChange={handleChange}
                                                placeholder="e.g. New Year, Swimsuit, Base"
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-full">
                                        <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">
                                            Notes
                                        </label>
                                        <div className="mt-2">
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                rows={3}
                                                value={formData.notes}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* Stats Section */}
                                    <div className="col-span-full border-t border-gray-200 pt-6 mt-6">
                                        <h3 className="text-base font-semibold leading-7 text-gray-900 mb-4">Character Stats</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label htmlFor="speed" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Speed
                                                </label>
                                                <input
                                                    type="number"
                                                    name="speed"
                                                    id="speed"
                                                    min="0"
                                                    max="1500"
                                                    value={formData.speed}
                                                    onChange={handleChange}
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="stamina" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Stamina
                                                </label>
                                                <input
                                                    type="number"
                                                    name="stamina"
                                                    id="stamina"
                                                    min="0"
                                                    max="1500"
                                                    value={formData.stamina}
                                                    onChange={handleChange}
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="power" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Power
                                                </label>
                                                <input
                                                    type="number"
                                                    name="power"
                                                    id="power"
                                                    min="0"
                                                    max="1500"
                                                    value={formData.power}
                                                    onChange={handleChange}
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="guts" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Guts
                                                </label>
                                                <input
                                                    type="number"
                                                    name="guts"
                                                    id="guts"
                                                    min="0"
                                                    max="1500"
                                                    value={formData.guts}
                                                    onChange={handleChange}
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="wit" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Wit
                                                </label>
                                                <input
                                                    type="number"
                                                    name="wit"
                                                    id="wit"
                                                    min="0"
                                                    max="1500"
                                                    value={formData.wit}
                                                    onChange={handleChange}
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="rank" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Rank
                                                </label>
                                                <input
                                                    type="text"
                                                    name="rank"
                                                    id="rank"
                                                    value={formData.rank}
                                                    onChange={handleChange}
                                                    placeholder="e.g. A+, SS"
                                                    className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="text-sm font-semibold leading-6 text-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
