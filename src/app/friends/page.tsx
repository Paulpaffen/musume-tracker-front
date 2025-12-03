'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { friendsAPI, profileAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Friend {
  friendshipId: string;
  friend: {
    id: string;
    username: string;
    displayName: string | null;
    friendCode: string;
  };
  since: string;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [myProfile, setMyProfile] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [friendsRes, profileRes] = await Promise.all([
        friendsAPI.list(),
        profileAPI.getMe(),
      ]);
      setFriends(friendsRes.data.friends);
      setMyProfile(profileRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar amigos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!friendCode.trim()) {
      toast.error('Ingresa un código de amigo');
      return;
    }

    try {
      await friendsAPI.addByCode(friendCode.trim());
      toast.success('Solicitud enviada correctamente');
      setFriendCode('');
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al enviar solicitud');
    }
  };

  const handleRemoveFriend = async (friendshipId: string, friendName: string) => {
    if (!confirm(`¿Eliminar a ${friendName} de tus amigos?`)) return;

    try {
      await friendsAPI.remove(friendshipId);
      toast.success('Amigo eliminado');
      loadData();
    } catch (error) {
      toast.error('Error al eliminar amigo');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado al portapapeles');
  };

  if (loading) {
    return <div className="text-center py-12">Cargando amigos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Amigos</h1>
        <div className="flex gap-2">
          <Link href="/friends/requests" className="btn btn-secondary">
            📬 Solicitudes
          </Link>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            ➕ Agregar Amigo
          </button>
        </div>
      </div>

      {/* My Friend Code */}
      {myProfile && (
        <div className="card mb-6 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Tu Código de Amigo</h3>
              <p className="text-2xl font-bold text-gray-900 font-mono">
                {myProfile.friendCode}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Comparte este código para que otros te agreguen
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(myProfile.friendCode)}
              className="btn btn-secondary"
            >
              📋 Copiar
            </button>
          </div>
        </div>
      )}

      {/* Friends List */}
      {friends.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">
            Aún no tienes amigos
          </p>
          <p className="text-gray-600 mb-4">
            Agrega amigos usando su código para ver sus estadísticas
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            Agregar Primer Amigo
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {friends.map((friendship) => (
            <div key={friendship.friendshipId} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {friendship.friend.displayName || friendship.friend.username}
                  </h3>
                  {friendship.friend.displayName && (
                    <p className="text-sm text-gray-600">@{friendship.friend.username}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    {friendship.friend.friendCode}
                  </p>
                </div>
                <span className="text-2xl">👤</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/friends/${friendship.friend.friendCode}`}
                  className="btn btn-primary flex-1 text-sm"
                >
                  Ver Perfil
                </Link>
                <button
                  onClick={() =>
                    handleRemoveFriend(
                      friendship.friendshipId,
                      friendship.friend.displayName || friendship.friend.username
                    )
                  }
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Agregar Amigo</h2>
            <p className="text-gray-600 mb-4">
              Ingresa el código de amigo de la persona que quieres agregar
            </p>
            <input
              type="text"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
              placeholder="ej: fcb37a0c-ccf0-4406-8e11-7680f9843870"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 font-mono text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddFriend()}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary flex-1">
                Cancelar
              </button>
              <button onClick={handleAddFriend} className="btn btn-primary flex-1">
                Enviar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
