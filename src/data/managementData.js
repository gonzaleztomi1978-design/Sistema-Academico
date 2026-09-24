export const MANAGEMENT_DATA = {
  plans: {
    path: 'planes-de-estudio',
    singular: 'plan de estudio',
    title: 'Planes de Estudio',
    icon: 'GraduationCap',
    columns: [{ key: 'nombre', label: 'Plan' }, { key: 'vigencia', label: 'Vigencia' }, { key: 'estado', label: 'Estado' }],
    apiKey: 'plans',
    createPayload: () => ({ nombre: 'Nuevo plan académico', añoInicio: 2026, añoFin: 2029, activo: true }),
    toTableRow: (plan) => ({ ...plan, vigencia: `${plan.añoInicio} — ${plan.añoFin}`, estado: plan.activo ? 'Activo' : 'Inactivo' }),
  },
  teachers: {
    path: 'docentes',
    singular: 'docente',
    title: 'Docentes',
    icon: 'UserRound',
    columns: [{ key: 'nombreCompleto', label: 'Docente' }, { key: 'dni', label: 'DNI' }, { key: 'correo', label: 'Correo electrónico' }],
    apiKey: 'teachers',
    createPayload: () => ({ nombreCompleto: 'Nuevo docente', dni: '00.000.000', correo: 'nuevo@instituto.edu.ar', activo: true }),
    toTableRow: (teacher) => teacher,
  },
};

export const navigationItems = [
  { label: 'Inicio', path: '/', icon: 'Grid2X2' },
  { label: 'Planes de Estudio', path: '/planes-de-estudio', icon: 'GraduationCap' },
  { label: 'Inscripciones', path: '/inscripciones', icon: 'ClipboardList' },
  { label: 'Docentes', path: '/docentes', icon: 'UserRound' },
];
