'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ImageUpload from '../../components/ImageUpload';
import OcrResultsTable from '../../components/OcrResultsTable';
import { api } from '../../lib/api';

export default function OcrPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [results, setResults] = useState<any[] | null>(null);

    const handleUpload = async (files: File[]) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await api.post('/ocr/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResults(response.data);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to process images. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (confirmedData: any[]) => {
        try {
            // TODO: Implement save logic
            console.log('Saving data:', confirmedData);
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    return (
        <div className="min-h-full">
            <Navbar />
            <div className="py-10">
                <header>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                            OCR Scanner
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
                        {!results ? (
                            <div className="max-w-xl mx-auto">
                                <ImageUpload onUpload={handleUpload} isUploading={isUploading} />
                                <p className="mt-4 text-sm text-gray-500 text-center">
                                    Upload screenshots of your Team Race results.
                                </p>
                            </div>
                        ) : (
                            <OcrResultsTable
                                results={results}
                                onSave={handleSave}
                                onCancel={() => setResults(null)}
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}