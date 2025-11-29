import api from '../lib/api';

export async function fetchCharacterCandidates(detectedName: string) {
  // You may want to pass userId if needed
  const response = await api.get(`/characters/candidates?name=${encodeURIComponent(detectedName)}`);
  return response.data;
}
