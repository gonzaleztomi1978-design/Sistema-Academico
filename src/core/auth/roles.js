const ROL_FRONT = {
  Student: 'estudiante',
  AcademicSecretary: 'secretario',
};

const NOMBRE_ROL = {
  Student: 'Estudiante',
  AcademicSecretary: 'Secretaría académica',
  Teacher: 'Docente',
  Director: 'Directivo',
};

// Nombre del rol como se muestra en pantalla.
export function nombreRol(rolBackend) {
  return NOMBRE_ROL[rolBackend] ?? rolBackend;
}

export function rolFront(rolBackend) {
  return ROL_FRONT[rolBackend] ?? null;
}
export function rutaInicio(rol) {
  if (rol === 'secretario') return '/secretario/inicio';
  if (rol === 'estudiante') return '/estudiante/inicio';
  return '/login';
}