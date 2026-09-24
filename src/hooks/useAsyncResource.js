import { useCallback, useEffect, useState } from 'react';

export function useAsyncResource(loadResource, dependencies = []) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      setData(await loadResource());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No fue posible cargar los datos.');
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  useEffect(() => { reload(); }, [reload]);

  return { data, setData, isLoading, error, reload };
}
