import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, CircleCheck, FileText, Pencil, Plus, Trash2, X } from 'lucide-react';
import CargarMaterias from './LoadSubjects';
import EditSubjectModal from './EditSubjectModal';
import ConfirmCorrelativesModal from './ConfirmCorrelativesModal';
import EditPlanModal from './EditPlanModal';
import ArchivePlanModal from './ArchivePlanModal';
import DeleteSubjectModal from './DeleteSubjectModal';
import { plansApi } from '../../components/plans/plansApi';
import { useAsyncResource } from '../../../../hooks/useAsyncResource';

const tabs = ['Resumen', 'Materias', 'Materias por año', 'Correlatividades'];
const YEARS = ['1°', '2°', '3°'];
const CORRELATIVE_YEARS = ['2°', '3°'];

const yearLabel = (year) => year.replace('°', '.° Año');
const sortByOrder = (a, b) => Number(a.orden) - Number(b.orden);

function Field({ label, value }) {
  return (
    <div className="plan-detalle-field">
      <span className="field-label">{label}</span>
      <span className="field-value">{value ?? '—'}</span>
    </div>
  );
}

function PlanDetalle({ plan, onBack, onUpdatePlan }) {
  const [activeTab, setActiveTab] = useState('Resumen');
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const { data: materias, setData: setMaterias, isLoading: isLoadingList, error: listError, reload: reloadSubjects } = useAsyncResource(
    () => plansApi.obtenerMaterias(plan.id),
    [plan.id],
  );
  const [selectedYear, setSelectedYear] = useState('1°');
  const [editingSubject, setEditingSubject] = useState(null);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  // Correlatividades: { [idMateria]: [idsCorrelativas] }, con el id de la materia (subjectId)
  const [correlatives, setCorrelatives] = useState({});
  const [draftCorrelatives, setDraftCorrelatives] = useState({});
  const [correlativeYear, setCorrelativeYear] = useState('2°');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [correlativeNotice, setCorrelativeNotice] = useState('');
  const [isConfirmingCorrelatives, setIsConfirmingCorrelatives] = useState(false);
  const [isSavingCorrelatives, setIsSavingCorrelatives] = useState(false);
  const [correlativeMode, setCorrelativeMode] = useState('assign'); // 'assign' | 'view'
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // las correlatividades se cargan de la base al abrir el plan
  useEffect(() => {
    let cancelled = false;

    plansApi.obtenerCorrelativas(plan.id)
      .then((loaded) => {
        if (cancelled) return;
        setCorrelatives(loaded);
        setDraftCorrelatives(loaded);
      })
      .catch((error) => {
        if (!cancelled) setCorrelativeNotice(`No se pudieron cargar las correlatividades: ${error.message}`);
      });

    return () => { cancelled = true; };
  }, [plan.id]);

  // la notificación de "guardado" se oculta sola a los 5 segundos
  useEffect(() => {
    if (!showSavedToast) return undefined;
    const timer = setTimeout(() => setShowSavedToast(false), 5000);
    return () => clearTimeout(timer);
  }, [showSavedToast]);

  const handleSaveSubjects = async (newSubjects) => {
    try {
      await plansApi.agregarMaterias(plan.id, newSubjects);
    } finally {
      await reloadSubjects();
    }
    setIsLoadingSubjects(false);
  };

  const handleUpdatePlan = async (changes) => {
    await onUpdatePlan(plan.id, changes);
    setIsEditingPlan(false);
  };

  const handleToggleArchive = async () => {
    await onUpdatePlan(plan.id, { activo: !plan.activo });
    setIsArchiveModalOpen(false);
  };

  const handleUpdateSubject = async (updatedSubject) => {
    await plansApi.actualizarMateria(updatedSubject);
    await reloadSubjects();
    setEditingSubject(null);
  };

  const handleConfirmDeleteSubject = async () => {
    const subject = subjectToDelete;

    await plansApi.quitarMateria(plan.id, subject.subjectId);

    setMaterias((current) => current.filter((materia) => materia.id !== subject.id));

    const cleanUp = (source) => {
      const result = {};
      Object.entries(source).forEach(([id, list]) => {
        if (String(id) === String(subject.subjectId)) return;
        result[id] = list.filter((correlativeId) => correlativeId !== subject.subjectId);
      });
      return result;
    };

    setCorrelatives(cleanUp);
    setDraftCorrelatives(cleanUp);

    if (selectedSubjectId === subject.subjectId) {
      setSelectedSubjectId(null);
    }

    setSubjectToDelete(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Correlatividades') {
      setDraftCorrelatives(correlatives);
      setCorrelativeNotice('');
      setCorrelativeMode('assign');
    }
  };

  const toggleCorrelative = (correlativeId) => {
    setDraftCorrelatives((current) => {
      const currentList = current[selectedSubjectId] ?? [];
      const nextList = currentList.includes(correlativeId)
        ? currentList.filter((id) => id !== correlativeId)
        : [...currentList, correlativeId];
      return { ...current, [selectedSubjectId]: nextList };
    });
  };

  const getChangedCorrelativeIds = () => {
    const subjectIds = new Set([
      ...Object.keys(correlatives),
      ...Object.keys(draftCorrelatives),
    ]);

    return [...subjectIds].filter((subjectId) => {
      const saved = [...(correlatives[subjectId] ?? [])].sort((a, b) => a - b);
      const draft = [...(draftCorrelatives[subjectId] ?? [])].sort((a, b) => a - b);

      return saved.length !== draft.length
        || saved.some((id, index) => id !== draft[index]);
    });
  };

  const requestSaveCorrelatives = () => {
    if (getChangedCorrelativeIds().length === 0) {
      setCorrelativeNotice('No hay cambios para guardar.');
      return;
    }

    setCorrelativeNotice('');
    setIsConfirmingCorrelatives(true);
  };

  const confirmSaveCorrelatives = async () => {
    const changedSubjectIds = getChangedCorrelativeIds();

    setIsSavingCorrelatives(true);
    try {
      let saved = correlatives;

      for (const subjectId of changedSubjectIds) {
        saved = await plansApi.guardarCorrelativas(
          plan.id,
          Number(subjectId),
          draftCorrelatives[subjectId] ?? [],
        );
      }

      setCorrelatives(saved);
      setDraftCorrelatives(saved);
      setCorrelativeNotice('');
      setShowSavedToast(true);
    } catch (error) {
      setCorrelativeNotice(error.message);
    } finally {
      setIsSavingCorrelatives(false);
      setIsConfirmingCorrelatives(false);
    }
  };

  const cancelCorrelatives = () => {
    setDraftCorrelatives(correlatives);
    setSelectedSubjectId(null);
    setCorrelativeNotice('');
  };

  const openViewMode = () => {
    setCorrelativeNotice('');
    setExpandedSubjectId(null);
    setCorrelativeMode('view');
  };

  const openAssignMode = (subject) => {
    setDraftCorrelatives(correlatives);
    setCorrelativeNotice('');
    if (subject) {
      setCorrelativeYear(subject.anio);
      setSelectedSubjectId(subject.subjectId);
    } else {
      setSelectedSubjectId(null);
    }
    setCorrelativeMode('assign');
  };

  if (isLoadingSubjects) {
    return (
      <CargarMaterias
        plan={plan}
        onBack={onBack}
        onCancel={() => setIsLoadingSubjects(false)}
        onSave={handleSaveSubjects}
      />
    );
  }

  const renderYearTabs = () => {
    const countByYear = (year) => materias.filter((materia) => materia.anio === year).length;

    return (
      <div className="year-tabs correlative-year-tabs">
        {CORRELATIVE_YEARS.map((year) => {
          const count = countByYear(year);
          return (
            <button
              key={year}
              type="button"
              className={`year-tab ${correlativeYear === year ? 'active' : ''}`}
              onClick={() => {
                setCorrelativeYear(year);
                setSelectedSubjectId(null);
                setExpandedSubjectId(null);
              }}
            >
              <strong>{yearLabel(year)}</strong>
              <span>{count} {count === 1 ? 'materia' : 'materias'}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const renderViewCorrelatives = () => {
    const subjectsWithCorrelatives = materias
      .filter((materia) => materia.anio === correlativeYear && (correlatives[materia.subjectId] ?? []).length > 0)
      .sort(sortByOrder);

    return (
      <div className="plan-materias">
        <div className="correlative-view-header">
          <div>
            <h2>Visualizar Correlatividades</h2>
            <p className="plan-materias-subtitle">Consulta las correlatividades configuradas para las materias del Plan de Estudios</p>
          </div>
        </div>

        <div className="correlative-toolbar">
          {renderYearTabs()}
          <button type="button" className="create-plan-button" onClick={() => openAssignMode(null)}>
            + Asignar nuevas correlatividades
          </button>
        </div>

        <h3 className="correlative-title">Materias con correlatividades</h3>

        {subjectsWithCorrelatives.length === 0 ? (
          <p className="year-subjects-empty">Todavía no hay correlatividades asignadas para este año.</p>
        ) : (
          <div className="correlative-view-list">
            {subjectsWithCorrelatives.map((materia) => {
              const list = (correlatives[materia.subjectId] ?? [])
                .map((id) => materias.find((item) => item.subjectId === id))
                .filter(Boolean)
                .sort(sortByOrder);
              const isExpanded = expandedSubjectId === materia.id;
              return (
                <div className="correlative-view-item" key={materia.id}>
                  <div className="correlative-view-row">
                    <FileText size={22} className="correlative-view-icon" />
                    <div className="correlative-view-info">
                      <strong>{materia.materia}</strong>
                      <span>{list.length} {list.length === 1 ? 'correlativa asignada' : 'correlativas asignadas'}</span>
                    </div>
                    <button
                      type="button"
                      className="correlative-toggle"
                      aria-label={isExpanded ? 'Ocultar correlativas' : 'Ver correlativas'}
                      aria-expanded={isExpanded}
                      onClick={() => setExpandedSubjectId(isExpanded ? null : materia.id)}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button type="button" className="plan-detalle-button" onClick={() => openAssignMode(materia)}>Editar</button>
                  </div>

                  {isExpanded && (
                    <div className="correlative-view-detail">
                      <h4>Materias Correlativas</h4>
                      <div className="correlative-view-chips">
                        {list.map((correlative) => (
                          <span className="correlative-view-chip" key={correlative.id}>
                            <span className="correlative-number">{correlative.orden}</span>
                            {correlative.materia}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderCorrelatives = () => {
    if (correlativeMode === 'view') return renderViewCorrelatives();

    const subjectsOfYear = materias.filter((materia) => materia.anio === correlativeYear).sort(sortByOrder);
    const selectedSubject = materias.find((materia) => materia.subjectId === selectedSubjectId) ?? null;
    const selectedList = draftCorrelatives[selectedSubjectId] ?? [];

    const previousYears = YEARS.slice(0, YEARS.indexOf(correlativeYear));

    // materias cuatrimestrales del mismo año (sin contar la materia elegida)
    const sameYearTermSubjects = materias
      .filter((materia) => materia.anio === correlativeYear
        && materia.regimen !== 'Anual'
        && materia.subjectId !== selectedSubjectId)
      .sort(sortByOrder);

    const renderOptions = (available) => (
      <div className="correlative-options">
        {available.map((materia) => (
          <button
            key={materia.id}
            type="button"
            className={`correlative-option ${selectedList.includes(materia.subjectId) ? 'checked' : ''}`}
            aria-pressed={selectedList.includes(materia.subjectId)}
            onClick={() => toggleCorrelative(materia.subjectId)}
          >
            <span className="correlative-number">{materia.orden}</span>
            <span className="correlative-name">{materia.materia}</span>
          </button>
        ))}
      </div>
    );

    return (
      <div className="plan-materias">
        <h2>Correlatividades</h2>

        <div className="correlative-toolbar">
          {renderYearTabs()}
          <button type="button" className="create-plan-button" onClick={openViewMode}>
            Visualizar correlativas
          </button>
        </div>

        <h3 className="correlative-title">Materias de {correlativeYear.replace('°', '.° año')}</h3>
        <p className="correlative-subtitle">Seleccioná una materia y definí sus correlativas.</p>

        {subjectsOfYear.length === 0 ? (
          <p className="year-subjects-empty">No hay materias cargadas para este año.</p>
        ) : (
          <div className="correlative-subjects">
            {subjectsOfYear.map((materia) => (
              <button
                key={materia.id}
                type="button"
                className={`correlative-subject ${selectedSubjectId === materia.subjectId ? 'selected' : ''}`}
                onClick={() => setSelectedSubjectId(materia.subjectId)}
              >
                <span className="correlative-number">{materia.orden}</span>
                <span className="correlative-name">{materia.materia}</span>
              </button>
            ))}
          </div>
        )}

        {selectedSubject && (
          <>
            <h3 className="correlative-title">Correlativas disponibles</h3>
            <p className="correlative-subtitle">
              Selecciona las materias que son correlativas de {selectedSubject.orden} · {selectedSubject.materia}.
            </p>

            {previousYears.map((year) => {
              const available = materias.filter((materia) => materia.anio === year).sort(sortByOrder);
              return (
                <div key={year} className="correlative-group">
                  <span className="correlative-group-title">{yearLabel(year)}</span>
                  {available.length === 0 ? (
                    <p className="year-subjects-empty">No hay materias cargadas para este año.</p>
                  ) : (
                    renderOptions(available)
                  )}
                </div>
              );
            })}

            {sameYearTermSubjects.length > 0 && (
              <div className="correlative-group">
                <span className="correlative-group-title">{yearLabel(correlativeYear)} · Cuatrimestrales</span>
                {renderOptions(sameYearTermSubjects)}
              </div>
            )}
          </>
        )}

        {correlativeNotice && <p className="correlative-notice" role="status">{correlativeNotice}</p>}

        <div className="correlative-footer">
          <button type="button" className="plan-detalle-button" onClick={cancelCorrelatives}>Cancelar cambios</button>
          <button type="button" className="create-plan-button" onClick={requestSaveCorrelatives}>Guardar cambios</button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === 'Resumen') {
      return (
        <div className="plan-detalle-card">
          <h2>Información del Plan</h2>
          <div className="plan-detalle-grid">
            <Field label="Nombre del plan" value={plan.nombre} />
            <Field label="Código" value={plan.codigo} />
            <Field label="Año de inicio del plan de estudio" value={plan.añoInicio} />
            <Field label="Año de finalización del plan de estudio" value={plan.añoFin ?? 'Sin definir'} />
            <Field label="Duración de la carrera" value={plan.duracion} />
            <Field label="Modalidad de la carrera" value={plan.modalidad} />
            <Field label="Carga horaria total" value={plan.cargaHoraria} />
            <Field label="Régimen de cursada" value={plan.regimen} />
          </div>
        </div>
      );
    }

    if (activeTab === 'Materias') {
      return (
        <div className="plan-materias">
          <div className="plan-materias-header">
            <div>
              <h2>Materias</h2>
              <p>Gestioná las materias asociadas al plan de estudio.</p>
            </div>
            {materias.length > 0 && (
              <button type="button" className="create-plan-button" onClick={() => setIsLoadingSubjects(true)}>
                <Plus size={14} /> Agregar materias
              </button>
            )}
          </div>

          {listError && <p className="field-error" role="alert">{listError}</p>}

          {isLoadingList ? (
            <p>Cargando materias...</p>
          ) : materias.length === 0 ? (
            <div className="plan-materias-empty">
              <div className="plan-materias-icon"><FileText size={32} /></div>
              <h3>Todavía no hay materias cargadas</h3>
              <p>Agrega las materias para comenzar a organizar la estructura académica.</p>
              <button type="button" className="create-plan-button" onClick={() => setIsLoadingSubjects(true)}>
                <Plus size={14} /> Agregar materias
              </button>
            </div>
          ) : (
            <div className="plan-materias-list">
              <div className="plan-materias-list-row plan-materias-list-head">
                <span>N.º</span>
                <span>Formato</span>
                <span>Materia</span>
                <span>Año</span>
                <span>Régimen</span>
                <span>Hs. cátedra</span>
                <span>Hs. reloj</span>
                <span>Acciones</span>
              </div>
              {[...materias].sort(sortByOrder).map((materia) => (
                <div className="plan-materias-list-row" key={materia.id}>
                  <span>{materia.orden}</span>
                  <span>{materia.formato}</span>
                  <span>{materia.materia}</span>
                  <span>{materia.anio}</span>
                  <span>{materia.regimen}</span>
                  <span>{materia.horasCatedra}</span>
                  <span>{materia.horasReloj}</span>
                  <span className="plan-materias-actions">
                    <button type="button" className="subject-edit-button" aria-label={`Editar ${materia.materia}`} onClick={() => setEditingSubject(materia)}>
                      <Pencil size={16} />
                    </button>
                    <button type="button" className="subject-delete-button" aria-label={`Eliminar ${materia.materia}`} onClick={() => setSubjectToDelete(materia)}>
                      <Trash2 size={16} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'Materias por año') {
      const countByYear = (year) => materias.filter((materia) => materia.anio === year).length;
      const subjectsOfYear = materias.filter((materia) => materia.anio === selectedYear).sort(sortByOrder);

      return (
        <div className="plan-materias">
          <h2>Materias por año</h2>
          <p className="plan-materias-subtitle">Visualiza las materias que conforman cada año del plan de estudio.</p>

          <div className="year-tabs">
            {YEARS.map((year) => {
              const count = countByYear(year);
              return (
                <button
                  key={year}
                  type="button"
                  className={`year-tab ${selectedYear === year ? 'active' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  <strong>{yearLabel(year)}</strong>
                  <span>{count} {count === 1 ? 'materia' : 'materias'}</span>
                </button>
              );
            })}
          </div>

          <div className="year-subjects">
            <div className="year-subjects-row year-subjects-head">
              <span>N.º orden</span>
              <span>Formato</span>
              <span>Materia</span>
              <span>Régimen</span>
            </div>
            {subjectsOfYear.length === 0 ? (
              <p className="year-subjects-empty">No hay materias cargadas para este año.</p>
            ) : (
              subjectsOfYear.map((materia) => (
                <div className="year-subjects-row" key={materia.id}>
                  <span>{materia.orden}</span>
                  <span>{materia.formato}</span>
                  <span>{materia.materia}</span>
                  <span>{materia.regimen}</span>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return renderCorrelatives();
  };

  return (
    <section className="plan-detalle-page">
      {showSavedToast && (
        <div className="plan-toast" role="status">
          <CircleCheck size={22} className="plan-toast-icon" />
          <div className="plan-toast-text">
            <strong>Correlatividades actualizadas</strong>
            <span>Los cambios se guardaron correctamente.</span>
          </div>
          <button type="button" className="plan-toast-close" aria-label="Cerrar notificación" onClick={() => setShowSavedToast(false)}>
            <X size={18} />
          </button>
        </div>
      )}

      <nav className="plan-detalle-breadcrumb" aria-label="Breadcrumb">
        <button type="button" onClick={onBack}>Planes de Estudio</button>
        <ChevronRight size={14} />
        <span>{plan.codigo} – {plan.nombre}</span>
      </nav>

      <div className="plan-detalle-heading">
        <div className="plan-detalle-title">
          <h1>{plan.codigo} – {plan.nombre}</h1>
          <span className={`plan-badge ${plan.activo ? 'plan-badge-active' : 'plan-badge-inactive'}`}>
            {plan.activo ? 'Activo' : 'Archivado'}
          </span>
        </div>
        {activeTab === 'Resumen' && (
          <div className="plan-detalle-actions">
            <button type="button" className="plan-detalle-button" onClick={() => setIsEditingPlan(true)}>Editar</button>
            <button type="button" className="plan-detalle-button" onClick={() => setIsArchiveModalOpen(true)}>
              {plan.activo ? 'Archivar' : 'Restaurar'}
            </button>
          </div>
        )}
      </div>

      <div className="plan-detalle-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}

      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSave={handleUpdateSubject}
        />
      )}

      {isConfirmingCorrelatives && (
        <ConfirmCorrelativesModal
          subject={materias.find((materia) => materia.subjectId === selectedSubjectId)}
          correlatives={(draftCorrelatives[selectedSubjectId] ?? [])
            .map((id) => materias.find((materia) => materia.subjectId === id))
            .filter(Boolean)
            .sort(sortByOrder)}
          isSaving={isSavingCorrelatives}
          onClose={() => setIsConfirmingCorrelatives(false)}
          onConfirm={confirmSaveCorrelatives}
        />
      )}

      {isEditingPlan && (
        <EditPlanModal
          plan={plan}
          onClose={() => setIsEditingPlan(false)}
          onSave={handleUpdatePlan}
        />
      )}

      {isArchiveModalOpen && (
        <ArchivePlanModal
          plan={plan}
          onClose={() => setIsArchiveModalOpen(false)}
          onConfirm={handleToggleArchive}
        />
      )}

      {subjectToDelete && (
        <DeleteSubjectModal
          subject={subjectToDelete}
          onClose={() => setSubjectToDelete(null)}
          onConfirm={handleConfirmDeleteSubject}
        />
      )}
    </section>
  );
}

export default PlanDetalle;