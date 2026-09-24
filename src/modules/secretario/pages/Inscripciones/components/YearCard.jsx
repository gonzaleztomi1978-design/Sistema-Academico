function YearCard({ id, año, totalEstudiantes, sinAsignacion, onManage }) {
  const hayBajoCupo = sinAsignacion > 0;

  return (
    <article className="year-card">
      <div className="year-card-header">
        <div className="year-card-icon">📚</div>
        <div className="year-card-label">Año académico</div>
      </div>

      <h2>{año}</h2>

      <p className="year-students">
        <strong>{totalEstudiantes}</strong> estudiantes
      </p>

      <p className={`year-assignment ${hayBajoCupo ? 'year-assignment-warning' : 'year-assignment-success'}`}>
        {hayBajoCupo ? `${sinAsignacion} sin asignación` : 'Cupos asignados'}
      </p>

      <button type="button" className="manage-places-button" onClick={() => onManage(id)}>
        Gestionar cupos
      </button>
    </article>
  );
}

export default YearCard;
