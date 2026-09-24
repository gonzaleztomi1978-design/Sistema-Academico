import { createMockRepository } from '../../../../api/createMockRepository';

const initialPlans = [
  { id: 1, nombre: 'Plan 2020', añoInicio: 2020, añoFin: 2024, activo: true },
  { id: 2, nombre: 'Plan 2023', añoInicio: 2023, añoFin: 2027, activo: true },
  { id: 3, nombre: 'Plan 2026', añoInicio: 2026, añoFin: 2030, activo: false },
];

const mockRepository = createMockRepository(initialPlans);

export const plansApi = {
  obtenerPlanes: async () => mockRepository.list(),
  crearPlan: async (plan) => mockRepository.create(plan),
  actualizarPlan: async (id, plan) => mockRepository.update(id, plan),
  eliminarPlan: async (id) => mockRepository.remove(id),
};
