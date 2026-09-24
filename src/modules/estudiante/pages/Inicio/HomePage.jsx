import { BookOpen, CalendarDays, ChevronDown, ChevronRight, CheckCircle2, GraduationCap, LockKeyhole } from 'lucide-react';

const ESTUDIANTE = {
  nombre: 'Lucas Fernández',
  plan: 'Plan Tec. en Programación 2026',
  legajo: '2026-0148',
};

function StatCard({ icon, value, label, color, trend }) {
  return <article className="stat"><span className={`stat-icon ${color}`}>{icon}</span><div><b>{value}</b><p>{label}</p><small>{trend}</small></div></article>;
}

function ActivityItem({ color, icon, title, detail, time }) {
  return <article className="activity-item"><span className={`activity-icon ${color}`}>{icon}</span><div><b>{title}</b><p>{detail}</p></div><time>{time}</time></article>;
}

function HomePage() {
  return (
    <section className="estudiante-dashboard student-homepage">
      <div className="welcome">
        <div>
          <p className="eyebrow">LUNES, 24 DE AGOSTO DE 2026</p>
          <h1>Hola, {ESTUDIANTE.nombre} <span>👋</span></h1>
          <p>Te damos la bienvenida a tu espacio académico.</p>
        </div>
        <button className="period" type="button"><CalendarDays size={18} /><span>Período lectivo</span><b>2026</b><ChevronDown size={15} /></button>
      </div>

      <div className="student-home-meta"><span>Legajo {ESTUDIANTE.legajo}</span><span><GraduationCap size={15} /> {ESTUDIANTE.plan}</span></div>

      <div className="stats">
        <StatCard icon={<BookOpen />} value="5" label="Materias del plan" color="blue" trend="Plan vigente" />
        <StatCard icon={<CheckCircle2 />} value="2" label="Materias aprobadas" color="green" trend="Estado académico" />
        <StatCard icon={<GraduationCap />} value="2" label="Materias disponibles" color="violet" trend="Período marzo" />
        <StatCard icon={<LockKeyhole />} value="1" label="Materia bloqueada" color="orange" trend="Requiere correlativa" />
      </div>

      <div className="dashboard-grid">
        <section className="panel activity">
          <div className="panel-title"><div><h2>Actividad académica</h2><p>Últimos movimientos de tu trayectoria</p></div><button type="button">Ver todo <ChevronRight size={16} /></button></div>
          <div className="activity-list">
            <ActivityItem color="blue" icon={<CheckCircle2 size={17} />} title="Materia aprobada" detail="Programación I · Estado actualizado" time="Hace 2 días" />
            <ActivityItem color="green" icon={<BookOpen size={17} />} title="Período de inscripción abierto" detail="Podés inscribirte a materias habilitadas" time="Hace 5 días" />
            <ActivityItem color="orange" icon={<LockKeyhole size={17} />} title="Correlativa pendiente" detail="Desarrollo Web requiere Programación II" time="Hace 1 semana" />
          </div>
        </section>

        <section className="panel shortcuts">
          <div className="panel-title"><div><h2>Accesos rápidos</h2><p>Gestioná tu cursada</p></div></div>
          <a className="shortcut primary" href="/estudiante/inscripciones"><span><BookOpen size={20} /></span><div><b>Inscripción a materias</b><small>Consultar materias disponibles</small></div><ChevronRight size={17} /></a>
          <button className="shortcut" type="button"><span><GraduationCap size={20} /></span><div><b>Mi plan de estudio</b><small>{ESTUDIANTE.plan}</small></div><ChevronRight size={17} /></button>
        </section>
      </div>
    </section>
  );
}

export default HomePage;