import { Edit, Trash2 } from 'lucide-react';

function ManagementTable({ management, rows, query, onQueryChange, onAction }) {
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="management-table">
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="search-input"
          aria-label="Buscar en tabla"
        />
      </div>
      <table aria-label={`Tabla de ${management.plural}`}>
        <thead>
          <tr>
            {management.columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id}>
              {management.columns.map((col) => (
                <td key={`${row.id}-${col.key}`}>{row[col.key]}</td>
              ))}
              <td>
                <div className="actions">
                  <button type="button" onClick={() => onAction('Editar', row.id)} aria-label={`Editar ${row.nombre || row.id}`}>
                    <Edit size={16} />
                  </button>
                  <button type="button" onClick={() => onAction('Eliminar', row.id)} aria-label={`Eliminar ${row.nombre || row.id}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagementTable;
