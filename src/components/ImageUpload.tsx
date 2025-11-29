'use client';

import { useState, useCallback } from 'react';
import { clsx } from 'clsx';

interface ImageUploadProps {
    onUpload: (files: File[]) => void;
    isUploading: boolean;
}

export default function ImageUpload({ onUpload, isUploading }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                onUpload(Array.from(e.dataTransfer.files));
            }
        },
        [onUpload]
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                onUpload(Array.from(e.target.files));
            }
        },
        [onUpload]
    );

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
                'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer',
                isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400',
                isUploading && 'opacity-50 pointer-events-none'
            )}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
                disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-4">
                    <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <div className="text-lg font-medium text-gray-900">
                        {isUploading ? 'Processing...' : 'Drop screenshots here or click to upload'}
                    </div>
                    <p className="text-sm text-gray-500">
                        Supports multiple images (PNG, JPG)
                    </p>
                </div>
            </label>
        </div>
    );
}
