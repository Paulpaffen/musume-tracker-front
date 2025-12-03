'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/characters', label: 'Personajes', icon: '👥' },
        { href: '/characters/compare', label: 'Comparar', icon: '⚖️' },
        { href: '/teams', label: 'Equipos', icon: '⭐' },
        { href: '/runs', label: 'Carreras', icon: '🏃' },
        { href: '/runs/pending', label: 'Pendientes', icon: '⏳' },
        { href: '/ocr', label: 'OCR Scan', icon: '📷' },
        { href: '/runs/new', label: 'Nueva Carrera', icon: '➕' },
        { href: '/friends/test', label: '🧪 Test Friends', icon: '🔬' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-0 md:w-20'
                    } overflow-hidden`}
            >
                <div className="flex flex-col h-full">
                    {/* Header / Logo */}
                    <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden px-4">
                            <span className="text-2xl min-w-[2rem] text-center">🏇</span>
                            <span
                                className={`text-xl font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-0'
                                    }`}
                            >
                                UmaTracker
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${pathname === item.href
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                    }`}
                                title={!isOpen ? item.label : ''}
                            >
                                <span className="text-xl min-w-[1.5rem] text-center">{item.icon}</span>
                                <span
                                    className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-0'
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!isOpen && (
                                    <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap hidden md:block">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                            title={isOpen ? 'Cambiar tema' : ''}
                        >
                            <div className="min-w-[1.5rem] flex justify-center">
                                {!mounted ? (
                                    <div className="w-5 h-5" />
                                ) : theme === 'dark' ? (
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </div>
                            <span
                                className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-0'
                                    }`}
                            >
                                {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                            </span>
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            title={isOpen ? 'Cerrar Sesión' : ''}
                        >
                            <span className="text-xl min-w-[1.5rem] text-center">🚪</span>
                            <span
                                className={`font-medium whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 hidden md:block md:opacity-0'
                                    }`}
                            >
                                Cerrar Sesión
                            </span>
                        </button>

                        {isOpen && user && (
                            <div className="pt-2 text-xs text-center text-gray-500 dark:text-gray-500 truncate px-2">
                                👤 {user.username}
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
