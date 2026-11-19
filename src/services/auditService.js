import { request } from './httpClient';

// AccessAuditController: /api/audit/accesses (solo Secretario)
export const auditService = {
  // Eventos de acceso, del más nuevo al más viejo. Las fechas son opcionales y van en formato ISO.
  obtenerAccesos: ({ desde, hasta } = {}) => {
    const filtros = new URLSearchParams();
    if (desde) filtros.set('from', desde);
    if (hasta) filtros.set('to', hasta);

    const consulta = filtros.toString();
    return request(`/api/audit/accesses${consulta ? `?${consulta}` : ''}`);
  },
};
