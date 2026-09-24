import { createMockRepository } from '../../../../api/createMockRepository';

const initialTeachers = [
  { id: 1, nombreCompleto: 'Juan Pérez', dni: '27.123.456', correo: 'juan.perez@instituto.edu.ar', activo: true },
  { id: 2, nombreCompleto: 'María García', dni: '28.234.567', correo: 'maria.garcia@instituto.edu.ar', activo: true },
  { id: 3, nombreCompleto: 'Carlos López', dni: '29.345.678', correo: 'carlos.lopez@instituto.edu.ar', activo: true },
  { id: 4, nombreCompleto: 'Ana Martínez', dni: '30.456.789', correo: 'ana.martinez@instituto.edu.ar', activo: false },
];

const mockRepository = createMockRepository(initialTeachers);

export const teachersApi = {
  obtenerDocentes: async () => mockRepository.list(),
  crearDocente: async (docente) => mockRepository.create(docente),
  actualizarDocente: async (id, docente) => mockRepository.update(id, docente),
  eliminarDocente: async (id) => mockRepository.remove(id),
};
