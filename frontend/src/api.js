// Punto único de acceso a la API para todos los equipos.
const API_URL = "http://localhost:5000/api";

export async function iniciarSesion(nombreUsuario, password) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombreUsuario, password }),
  });

  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new Error(datos?.mensaje ?? "No se pudo iniciar sesión.");
  }

  localStorage.setItem("sesion", JSON.stringify(datos));
  return datos;
}

export function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem("sesion"));
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem("sesion");
}

export function tienePermiso(codigo) {
  const sesion = obtenerSesion();
  return sesion?.usuario?.permisos?.includes(codigo) ?? false;
}

/**
 * fetch con el token JWT incluido. Los equipos 2, 3 y 4 deben usar esta
 * función para llamar a la API; si el token venció redirige al login.
 * Ejemplo: const r = await apiFetch("/usuarios"); const datos = await r.json();
 */
export async function apiFetch(ruta, opciones = {}) {
  const sesion = obtenerSesion();
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(sesion ? { Authorization: `Bearer ${sesion.token}` } : {}),
      ...(opciones.headers ?? {}),
    },
  });

  if (respuesta.status === 401) {
    cerrarSesion();
    window.location.href = "/login";
    return null;
  }

  return respuesta;
}
