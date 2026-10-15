import { createContext, useContext, useState } from 'react';

export const PERIODO_TEXTO = '10 mar. - 28 mar. 2025';

const MATERIAS_INICIALES = [
  { id: 1, nombre: 'Programación I', año: 1, regimen: 'Anual', estado: 'A', correlativas: [] },
  { id: 2, nombre: 'Base de Datos', año: 1, regimen: '1er Cuatrimestre', estado: 'R', correlativas: [] },
  { id: 3, nombre: 'Programación II', año: 2, regimen: 'Anual', estado: '', correlativas: [1] },
  { id: 4, nombre: 'Ingeniería de Software', año: 2, regimen: 'Anual', estado: '', correlativas: [2] },
  { id: 5, nombre: 'Desarrollo Web', año: 2, regimen: '2do Cuatrimestre', estado: '', correlativas: [3, 4] },
];

const InscripcionesContext = createContext(null);

export function InscripcionesProvider({ children }) {
  const [materias, setMaterias] = useState(MATERIAS_INICIALES);

  const materiasPreparadas = materias.map((materia) => {
    const correlativasPendientes = materia.correlativas
      .map((correlativaId) => materias.find(({ id }) => id === correlativaId))
      .filter((correlativa) => correlativa && correlativa.estado !== 'A')
      .map((correlativa) => correlativa.nombre);

    return {
      ...materia,
      correlativasPendientes,
      correlativaBloqueante: correlativasPendientes[0],
    };
  });

  const inscribir = (materiaId) => {
    setMaterias((actuales) =>
      actuales.map((materia) => (materia.id === materiaId ? { ...materia, estado: 'R' } : materia))
    );
  };

  return (
    <InscripcionesContext.Provider value={{ materiasPreparadas, inscribir }}>
      {children}
    </InscripcionesContext.Provider>
  );
}

export function useInscripciones() {
  const contexto = useContext(InscripcionesContext);
  if (!contexto) throw new Error('useInscripciones debe usarse dentro de InscripcionesProvider');
  return contexto;
}