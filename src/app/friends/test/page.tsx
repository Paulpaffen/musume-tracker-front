'use client';

import { useState } from 'react';
import { profileAPI, friendsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function FriendsTestPage() {
  const [myProfile, setMyProfile] = useState<any>(null);
  const [friends, setFriends] = useState<any>(null);
  const [requests, setRequests] = useState<any>(null);
  const [friendCode, setFriendCode] = useState('');
  const [friendIdToAccept, setFriendIdToAccept] = useState('');
  const [friendIdToRemove, setFriendIdToRemove] = useState('');

  const testGetMyProfile = async () => {
    try {
      const response = await profileAPI.getMe();
      setMyProfile(response.data);
      toast.success('✅ Perfil obtenido');
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  const testGetFriends = async () => {
    try {
      const response = await friendsAPI.list();
      setFriends(response.data);
      toast.success('✅ Lista de amigos obtenida');
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  const testGetRequests = async () => {
    try {
      const response = await friendsAPI.listRequests();
      setRequests(response.data);
      toast.success('✅ Solicitudes obtenidas');
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  const testAddFriend = async () => {
    if (!friendCode.trim()) {
      toast.error('Ingresa un código de amigo');
      return;
    }
    try {
      const response = await friendsAPI.addByCode(friendCode);
      toast.success('✅ Solicitud enviada: ' + JSON.stringify(response.data));
      setFriendCode('');
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  const testAcceptFriend = async () => {
    if (!friendIdToAccept.trim()) {
      toast.error('Ingresa un ID de solicitud');
      return;
    }
    try {
      const response = await friendsAPI.accept(friendIdToAccept);
      toast.success('✅ Aceptado: ' + JSON.stringify(response.data));
      setFriendIdToAccept('');
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  const testRemoveFriend = async () => {
    if (!friendIdToRemove.trim()) {
      toast.error('Ingresa un ID de amistad');
      return;
    }
    try {
      const response = await friendsAPI.remove(friendIdToRemove);
      toast.success('✅ Eliminado: ' + JSON.stringify(response.data));
      setFriendIdToRemove('');
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  const testUpdateSettings = async () => {
    try {
      const response = await profileAPI.updateSettings({
        showStats: true,
        showCharacters: false,
        showBestRuns: true,
        showRecentActivity: false,
      });
      toast.success('✅ Configuración actualizada: ' + JSON.stringify(response.data));
    } catch (error: any) {
      toast.error('❌ Error: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🧪 Test de Amigos API</h1>
        <p className="text-gray-600 mt-2">
          Página de prueba para validar todos los endpoints del sistema de amigos
        </p>
      </div>

      {/* Profile Tests */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4 text-purple-600">👤 Profile API</h2>
        
        <div className="space-y-3">
          <div>
            <button onClick={testGetMyProfile} className="btn btn-primary">
              GET /profile/me
            </button>
            {myProfile && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(myProfile, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <button onClick={testUpdateSettings} className="btn btn-secondary">
              PATCH /profile/settings (stub)
            </button>
          </div>
        </div>
      </div>

      {/* Friends List Tests */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4 text-blue-600">👥 Friends API - Lista</h2>
        
        <div className="space-y-3">
          <div>
            <button onClick={testGetFriends} className="btn btn-primary">
              GET /friends
            </button>
            {friends && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(friends, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <button onClick={testGetRequests} className="btn btn-primary">
              GET /friends/requests
            </button>
            {requests && (
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(requests, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Add Friend Test */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4 text-green-600">➕ Agregar Amigo</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Amigo
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="ej: clxxx123"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button onClick={testAddFriend} className="btn btn-primary">
                POST /friends/add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Friend Test */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4 text-yellow-600">✅ Aceptar Solicitud</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de Solicitud
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={friendIdToAccept}
                onChange={(e) => setFriendIdToAccept(e.target.value)}
                placeholder="UUID de la solicitud"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button onClick={testAcceptFriend} className="btn btn-primary">
                PATCH /friends/:id/accept
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Friend Test */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4 text-red-600">🗑️ Eliminar Amigo</h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de Amistad
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={friendIdToRemove}
                onChange={(e) => setFriendIdToRemove(e.target.value)}
                placeholder="UUID de la amistad"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button onClick={testRemoveFriend} className="btn btn-primary">
                DELETE /friends/:id
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">📝 Instrucciones</h3>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
          <li>Primero haz clic en "GET /profile/me" para ver tu friendCode</li>
          <li>Copia tu friendCode y compártelo con otro usuario</li>
          <li>Ese usuario puede usar "POST /friends/add" con tu código</li>
          <li>Usa "GET /friends/requests" para ver solicitudes pendientes</li>
          <li>Acepta con "PATCH /friends/:id/accept" usando el ID de la solicitud</li>
          <li>Usa "GET /friends" para ver tu lista de amigos aceptados</li>
        </ol>
      </div>
    </div>
  );
}
