'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { friendsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface FriendRequest {
  requestId: string;
  from: {
    id: string;
    username: string;
    displayName: string | null;
    friendCode: string;
  };
  createdAt: string;
}

export default function FriendRequestsPage() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const response = await friendsAPI.listRequests();
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string, username: string) => {
    try {
      await friendsAPI.accept(requestId);
      toast.success(`Ahora eres amigo de ${username}`);
      loadRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al aceptar solicitud');
    }
  };

  const handleReject = async (requestId: string, username: string) => {
    if (!confirm(`¿Rechazar solicitud de ${username}?`)) return;

    try {
      await friendsAPI.remove(requestId);
      toast.success('Solicitud rechazada');
      loadRequests();
    } catch (error) {
      toast.error('Error al rechazar solicitud');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando solicitudes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Amistad</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las solicitudes que has recibido
          </p>
        </div>
        <Link href="/friends" className="btn btn-secondary">
          ← Volver a Amigos
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            No tienes solicitudes pendientes
          </p>
          <p className="text-gray-600 mb-4">
            Cuando alguien te envíe una solicitud, aparecerá aquí
          </p>
          <Link href="/friends" className="btn btn-primary">
            Ver Mis Amigos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.requestId}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {(request.from.displayName || request.from.username)[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {request.from.displayName || request.from.username}
                    </h3>
                    {request.from.displayName && (
                      <p className="text-sm text-gray-600">@{request.from.username}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(request.createdAt), "dd/MM/yyyy 'a las' HH:mm")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleAccept(
                        request.requestId,
                        request.from.displayName || request.from.username
                      )
                    }
                    className="btn btn-primary"
                  >
                    ✓ Aceptar
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        request.requestId,
                        request.from.displayName || request.from.username
                      )
                    }
                    className="btn btn-secondary text-red-600 hover:bg-red-50"
                  >
                    ✗ Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
