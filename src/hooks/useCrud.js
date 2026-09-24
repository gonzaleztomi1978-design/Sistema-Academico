import { useCallback, useEffect, useState } from 'react';

export function useCrud({ api, createPayload, validate = () => null, entityLabel }) {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const notify = useCallback((action) => setNotice(`${action} ${entityLabel}: acción simulada correctamente.`), [entityLabel]);
  const reload = useCallback(async () => {
    setIsLoading(true);
    try { setRows(await api.list()); setError(''); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar los datos.'); }
    finally { setIsLoading(false); }
  }, [api]);
  useEffect(() => { reload(); }, [reload]);

  const create = async () => {
    const payload = createPayload();
    const validationError = validate(payload);
    if (validationError) { setError(validationError); return; }
    const created = await api.create(payload);
    setRows((currentRows) => [created, ...currentRows]);
    notify('Crear');
  };

  const remove = async (id) => {
    await api.remove(id);
    setRows((currentRows) => currentRows.filter((row) => row.id !== id));
    notify('Eliminar');
  };

  return { rows, notice, setNotice, create, remove, notify, isLoading, error, reload };
}
