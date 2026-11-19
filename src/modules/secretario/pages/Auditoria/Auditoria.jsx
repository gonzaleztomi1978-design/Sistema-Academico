import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { auditService } from '../../../../services/auditService';

const TAMANO_PAGINA = 10;

const NOMBRE_EVENTO = {
  LOGIN_EXITOSO: 'Inicio de sesión',
  LOGIN_FALLIDO: 'Inicio de sesión fallido',
  ACCESO_DENEGADO: 'Acceso denegado',
};
const NOMBRE_RESULTADO = { Success: 'Éxito', Failure: 'Fallido', Denied: 'Denegado' };
const CLASE_RESULTADO = { Success: 'exito', Failure: 'fallido', Denied: 'denegado' };
const FILTROS_VACIOS = { desde: '', hasta: '', usuario: '', evento: '', resultado: '' };

const formatearFecha = (iso) => new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'medium' });

// La API informa el tipo de evento y el resultado por separado; en pantalla el inicio de sesión se separa en exitoso y fallido.
const eventoDe = (registro) => {
  if (registro.eventType === 'AccessDenied') return 'ACCESO_DENEGADO';
  return registro.result === 'Success' ? 'LOGIN_EXITOSO' : 'LOGIN_FALLIDO';
};

// Los filtros de fecha son días completos en la hora local.
const inicioDelDia = (fecha) => new Date(`${fecha}T00:00:00`).toISOString();
const finDelDia = (fecha) => new Date(`${fecha}T23:59:59.999`).toISOString();

function Auditoria() {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS); // lo que se está escribiendo
  const [aplicados, setAplicados] = useState(FILTROS_VACIOS); // lo que se consultó
  const [pagina, setPagina] = useState(1);
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [errorFiltros, setErrorFiltros] = useState('');

  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError('');
    auditService
      .obtenerAccesos({
        desde: aplicados.desde ? inicioDelDia(aplicados.desde) : null,
        hasta: aplicados.hasta ? finDelDia(aplicados.hasta) : null,
      })
      .then((respuesta) => {
        if (vigente) setRegistros(respuesta);
      })
      .catch((loadError) => {
        if (vigente) setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el registro de auditoría.');
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });
    return () => {
      vigente = false;
    };
  }, [aplicados.desde, aplicados.hasta]);

  // Las fechas las filtra la API; el usuario, el evento y el resultado se filtran sobre lo que devolvió.
  const filtrados = useMemo(() => {
    const texto = aplicados.usuario.trim().toLowerCase();
    return registros.filter(
      (registro) =>
        (!texto || registro.user.toLowerCase().includes(texto)) &&
        (!aplicados.evento || eventoDe(registro) === aplicados.evento) &&
        (!aplicados.resultado || registro.result === aplicados.resultado),
    );
  }, [registros, aplicados.usuario, aplicados.evento, aplicados.resultado]);

  const cambiar = (campo) => (evento) => setFiltros((actuales) => ({ ...actuales, [campo]: evento.target.value }));

  const buscar = (evento) => {
    evento.preventDefault();
    if (filtros.desde && filtros.hasta && filtros.desde > filtros.hasta) {
      setErrorFiltros('La fecha "Desde" no puede ser posterior a "Hasta".');
      return;
    }
    setErrorFiltros('');
    setPagina(1);
    setAplicados(filtros);
  };

  const limpiar = () => {
    setFiltros(FILTROS_VACIOS);
    setErrorFiltros('');
    setPagina(1);
    setAplicados(FILTROS_VACIOS);
  };

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / TAMANO_PAGINA));
  const visibles = filtrados.slice((pagina - 1) * TAMANO_PAGINA, pagina * TAMANO_PAGINA);

  return (
    <section className="management-page">
      <div className="management-heading">
        <div>
          <span className="management-icon"><ShieldCheck size={23} /></span>
          <div>
            <h1>Auditoría</h1>
            <p>Registro de inicios de sesión y accesos denegados. Es de solo lectura.</p>
          </div>
        </div>
      </div>

      <form className="auditoria-filtros" onSubmit={buscar} noValidate>
        <div className="auditoria-campo">
          <label htmlFor="desde">Desde</label>
          <input id="desde" type="date" value={filtros.desde} onChange={cambiar('desde')} />
        </div>
        <div className="auditoria-campo">
          <label htmlFor="hasta">Hasta</label>
          <input id="hasta" type="date" value={filtros.hasta} onChange={cambiar('hasta')} />
        </div>
        <div className="auditoria-campo">
          <label htmlFor="usuario">Usuario</label>
          <input id="usuario" type="text" placeholder="Nombre o correo" value={filtros.usuario} onChange={cambiar('usuario')} />
        </div>
        <div className="auditoria-campo">
          <label htmlFor="evento">Evento</label>
          <select id="evento" value={filtros.evento} onChange={cambiar('evento')}>
            <option value="">Todos</option>
            {Object.entries(NOMBRE_EVENTO).map(([codigo, nombre]) => <option key={codigo} value={codigo}>{nombre}</option>)}
          </select>
        </div>
        <div className="auditoria-campo">
          <label htmlFor="resultado">Resultado</label>
          <select id="resultado" value={filtros.resultado} onChange={cambiar('resultado')}>
            <option value="">Todos</option>
            {Object.entries(NOMBRE_RESULTADO).map(([codigo, nombre]) => <option key={codigo} value={codigo}>{nombre}</option>)}
          </select>
        </div>
        <div className="auditoria-botones">
          <button type="submit" className="auditoria-buscar">Buscar</button>
          <button type="button" className="auditoria-limpiar" onClick={limpiar}>Limpiar</button>
        </div>
      </form>
      {errorFiltros && <p className="auditoria-error" role="alert">{errorFiltros}</p>}
      {error && <p className="auditoria-error" role="alert">{error}</p>}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="auditoria-caja">
          <table className="auditoria-tabla" aria-label="Registro de auditoría">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Evento</th>
                <th>Resultado</th>
                <th>Recurso</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((registro) => (
                <tr key={registro.id}>
                  <td>{formatearFecha(registro.occurredAt)}</td>
                  <td>{registro.user}</td>
                  <td>{NOMBRE_EVENTO[eventoDe(registro)]}</td>
                  <td>
                    <span className={`auditoria-estado auditoria-estado--${CLASE_RESULTADO[registro.result] ?? 'fallido'}`}>
                      {NOMBRE_RESULTADO[registro.result] ?? registro.result}
                    </span>
                  </td>
                  <td><code>{registro.module}</code></td>
                  <td>{registro.ipAddress ?? '—'}</td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr><td colSpan={6} className="auditoria-vacio">No hay eventos para los filtros elegidos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!cargando && (
        <div className="auditoria-paginacion">
          <span>{filtrados.length} eventos · Página {pagina} de {totalPaginas}</span>
          <div className="auditoria-botones">
            <button type="button" className="auditoria-limpiar" disabled={pagina <= 1} onClick={() => setPagina((actual) => actual - 1)}>Anterior</button>
            <button type="button" className="auditoria-limpiar" disabled={pagina >= totalPaginas} onClick={() => setPagina((actual) => actual + 1)}>Siguiente</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Auditoria;