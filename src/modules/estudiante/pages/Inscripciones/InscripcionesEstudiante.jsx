import { useState } from 'react';
import MateriaInscripcionCard from './components/MateriaInscripcionCard';

const MES_ACTUAL_SIMULADO = 'Marzo';
const PERIODO_DE_INSCRIPCION = 'Marzo';
const ESTUDIANTE = {
  nombre: 'Lucas Fernández',
  plan: 'Plan Tec. en Programación 2026',
  legajo: '2026-0148',
};
const MATERIAS = [
  { id: 1, nombre: 'Programación I', año: 1, estado: 'A', correlativas: [] },
  { id: 2, nombre: 'Base de Datos', año: 1, estado: 'R', correlativas: [] },
  { id: 3, nombre: 'Programación II', año: 2, estado: '', correlativas: [1] },
  { id: 4, nombre: 'Ingeniería de Software', año: 2, estado: '', correlativas: [2] },
  { id: 5, nombre: 'Desarrollo Web', año: 2, estado: '', correlativas: [3, 4] },
];

function InscripcionesEstudiante() {
  const [materias, setMaterias] = useState(MATERIAS);
  const [aviso, setAviso] = useState('');
  const periodoAbierto = MES_ACTUAL_SIMULADO === PERIODO_DE_INSCRIPCION;

  const materiasPreparadas = materias.map((materia) => {
    const correlativaBloqueante = materia.correlativas
      .map((correlativaId) => materias.find(({ id }) => id === correlativaId))
      .find((correlativa) => correlativa && correlativa.estado !== 'R' && correlativa.estado !== 'A');

    return { ...materia, correlativaBloqueante: correlativaBloqueante?.nombre };
  });

  const handleInscripcion = (materiaId) => {
    setMaterias((actuales) => actuales.map((materia) => (materia.id === materiaId ? { ...materia, estado: 'R' } : materia)));
    const materia = materias.find(({ id }) => id === materiaId);
    if (materia) setAviso(`Solicitud de inscripción registrada para ${materia.nombre}.`);
  };

  return (
    <section className="estudiante-dashboard">
      <header className="estudiante-header estudiante-header--secretario">
        <div>
          <span className="estudiante-eyebrow">GESTIÓN ACADÉMICA</span>
          <h1>Inscripciones</h1>
          <p>Consultá tus materias y gestioná tus inscripciones.</p>
        </div>
      </header>

      <div className="enrollment-filters student-plan-filter" aria-label="Plan de estudio">
        <label>
          <span>Plan de estudio</span>
          <div className="student-plan-readonly" aria-live="polite">{ESTUDIANTE.plan}</div>
        </label>
      </div>

      {!periodoAbierto && <div className="estudiante-periodo-cerrado" role="status">El período de inscripciones ({PERIODO_DE_INSCRIPCION}) se encuentra cerrado.</div>}
      {aviso && <div className="estudiante-aviso" role="status">{aviso}<button type="button" onClick={() => setAviso('')} aria-label="Cerrar aviso">×</button></div>}
      <div className="materias-heading"><div><span className="estudiante-eyebrow">OFERTA ACADÉMICA</span><h2>Materias de tu plan</h2></div><span>{materiasPreparadas.length} materias</span></div>
      <div className="materias-grid">
        {materiasPreparadas.map((materia) => (
          <MateriaInscripcionCard key={materia.id} materia={materia} periodoAbierto={periodoAbierto} onInscribir={handleInscripcion} />
        ))}
      </div>
    </section>
  );
}

export default InscripcionesEstudiante;
