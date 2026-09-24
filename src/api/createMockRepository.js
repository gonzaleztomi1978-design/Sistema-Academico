const wait = (milliseconds = 180) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const copy = (value) => structuredClone(value);

export function createMockRepository(seed) {
  let records = copy(seed);

  return {
    async list() {
      await wait();
      return copy(records);
    },
    async create(payload) {
      await wait();
      const nextId = Math.max(0, ...records.map(({ id }) => id)) + 1;
      const record = { id: nextId, ...payload };
      records = [record, ...records];
      return copy(record);
    },
    async update(id, changes) {
      await wait();
      const record = records.find((item) => item.id === id);
      if (!record) throw new Error('No se encontró el registro solicitado.');
      const updatedRecord = { ...record, ...changes };
      records = records.map((item) => (item.id === id ? updatedRecord : item));
      return copy(updatedRecord);
    },
    async remove(id) {
      await wait();
      const exists = records.some((item) => item.id === id);
      if (!exists) throw new Error('No se encontró el registro solicitado.');
      records = records.filter((item) => item.id !== id);
    },
  };
}
