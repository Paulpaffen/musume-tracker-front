'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/characters', label: 'Personajes' },
    { href: '/characters/compare', label: 'Comparar' },
    { href: '/teams', label: '⭐ Equipos' },
    { href: '/runs', label: 'Carreras' },
    { href: '/runs/pending', label: 'Pendientes' },
    { href: '/ocr', label: 'OCR Scan' },
    { href: '/runs/new', label: '+ Nueva Carrera' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                🏇 UmaMusume Tracker
              </span>
            </Link>

            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === item.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">👤 {user?.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary text-sm">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
