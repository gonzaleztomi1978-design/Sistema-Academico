import { useEffect, useState } from 'react';

export function useEnrollments(planId) {
  const [years, setYears] = useState([
    { id: '1', etiqueta: '1er' },
    { id: '2', etiqueta: '2do' },
    { id: '3', etiqueta: '3er' },
  ]);
  
  const [plans, setPlans] = useState([
    { id: '1', nombre: 'Plan 2020' },
    { id: '2', nombre: 'Plan 2023' },
  ]);
  
  const [summaries, setSummaries] = useState([
    { añoAcademico: '1', totalEstudiantes: 45, estudiantesSinAsignar: 5 },
    { añoAcademico: '2', totalEstudiantes: 32, estudiantesSinAsignar: 2 },
    { añoAcademico: '3', totalEstudiantes: 28, estudiantesSinAsignar: 0 },
  ]);

  return { years, plans, summaries };
}
