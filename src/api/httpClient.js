const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function request(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('No hay una API configurada. Definí VITE_API_BASE_URL para usar el backend.');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`La API respondió con ${response.status}.`);
  }

  return response.status === 204 ? undefined : response.json();
}
