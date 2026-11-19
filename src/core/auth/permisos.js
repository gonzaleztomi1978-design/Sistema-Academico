// Entradas posibles del menú de cada rol. `modulo` es el id que devuelve la API en /api/auth/permissions.
// Las que tienen `proximamente` todavía no tienen pantalla: se muestran deshabilitadas.
const MENU_POR_ROL = {
  secretario: [
    { label: 'Inicio', path: '/secretario/inicio', icon: 'Grid2X2', modulo: 'inicio' },
    { label: 'Planes de Estudio', path: '/secretario/planes-de-estudio', icon: 'GraduationCap', modulo: 'planes-de-estudio' },
    { label: 'Inscripciones', path: '/secretario/inscripciones', icon: 'ClipboardList', modulo: 'inscripciones' },
    { label: 'Docentes', path: '/secretario/docentes', icon: 'UserRound', modulo: 'docentes' },
    { label: 'Materias', path: '/secretario/materias', icon: 'BookOpen', modulo: 'materias' },
    { label: 'Usuarios', path: '/secretario/usuarios', icon: 'Users', modulo: 'usuarios' },
    { label: 'Auditoría', path: '/secretario/auditoria', icon: 'ShieldCheck', modulo: 'auditoria' },
  ],
  estudiante: [
    { label: 'Inicio', path: '/estudiante/inicio', icon: 'Grid2X2', modulo: 'inicio' },
    { label: 'Inscripción a Materias', path: '/estudiante/inscripciones', icon: 'ClipboardList', modulo: 'inscripciones' },
    { label: 'Mis Inscripciones', path: '/estudiante/mis-inscripciones', icon: 'ClipboardList', modulo: 'inscripciones' },
  ],
};

// Ids de los módulos que la respuesta de la API deja ver.
export function modulosVisibles(permisos) {
  return (permisos?.modules ?? []).filter((item) => item.actions?.includes('ver')).map((item) => item.module);
}

// Menú del rol con lo que la API le permite ver. `modulos` es la lista de ids permitidos, o null si
// todavía no se pudo consultar: ahí se muestra el menú completo del rol, porque el acceso real lo
// controla el backend en cada pedido.
export function menuParaRol(rol, modulos = null) {
  return (MENU_POR_ROL[rol] ?? [])
    .filter((entrada) => entrada.proximamente || modulos === null || modulos.includes(entrada.modulo))
    .map(({ proximamente, ...entrada }) => ({ ...entrada, habilitado: !proximamente }));
}
