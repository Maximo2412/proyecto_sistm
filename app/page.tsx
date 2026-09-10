import { db } from '@/lib/db';
import { crearMovimiento } from './_actions/movimientos';

async function getDatosEconomicos() {
  try {
    const saldos: any = await db`SELECT * FROM vista_saldo_actual`;
    const movimientos: any = await db`
      SELECT m.id, m.tipo, m.monto, m.fecha, m.descripcion, c.nombre AS categoria 
      FROM movimientos_economicos m 
      LEFT JOIN categorias_economicas c ON m.categoria_id = c.id
      ORDER BY m.fecha DESC
    `;

    return {
      balance: saldos[0] || { total_ingresos: 0, total_egresos: 0, saldo: 0 },
      movimientos: movimientos || []
    };
  } catch (error) {
    console.error('Error al obtener datos económicos:', error);
    return {
      balance: { total_ingresos: 0, total_egresos: 0, saldo: 0 },
      movimientos: []
    };
  }
}

export default async function Home() {
  const { balance, movimientos } = await getDatosEconomicos();

  return (
    <main className="container py-4">
      {/* Encabezado y Saldo */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm border">
        <div>
          <h1 className="h3 mb-0 text-primary fw-bold">Sistema Técnico Nº 8</h1>
          <small className="text-muted">Gestión de Tesorería y Movimientos</small>
        </div>
        <div className="text-end">
          <span className="text-muted d-block small">Saldo actual</span>
          <span className="fs-4 fw-bold text-success">
            ${Number(balance.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulario de Carga */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white fw-bold">
              Registrar Movimiento
            </div>
            <div className="card-body">
              <form action={crearMovimiento}>
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label fw-bold">
                    Tipo de movimiento
                  </label>
                  <select className="form-select" id="tipo" name="tipo" defaultValue="ingreso">
                    <option value="ingreso">Ingreso (+)</option>
                    <option value="egreso">Egreso (-)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label fw-bold">
                    Concepto / Detalle
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    placeholder="Ej: Insumos de taller, Cuota cooperadora"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="monto" className="form-label fw-bold">
                    Monto ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="monto"
                    name="monto"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fecha" className="form-label fw-bold">
                    Fecha
                  </label>
                  <input type="date" className="form-control" id="fecha" name="fecha" required />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  Guardar Movimiento
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Historial de Tabla */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold text-secondary">Historial de Movimientos</h5>
              <span className="badge bg-secondary">{movimientos.length} registros</span>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3">Fecha</th>
                      <th>Concepto</th>
                      <th>Categoría</th>
                      <th>Tipo</th>
                      <th className="text-end pe-3">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          No hay movimientos registrados.
                        </td>
                      </tr>
                    ) : (
                      movimientos.map((m: any) => {
                        const esIngreso = m.tipo?.toUpperCase() === 'INGRESO';
                        const fechaFormatted = m.fecha 
                          ? new Date(m.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' }) 
                          : '-';

                        return (
                          <tr key={m.id}>
                            <td className="ps-3 text-muted">{fechaFormatted}</td>
                            <td className="fw-semibold">{m.descripcion || '-'}</td>
                            <td>
                              <span className="badge bg-light text-dark border">
                                {m.categoria || 'Sin categoría'}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  esIngreso
                                    ? 'bg-success-subtle text-success border border-success-subtle'
                                    : 'bg-danger-subtle text-danger border border-danger-subtle'
                                }`}
                              >
                                {m.tipo}
                              </span>
                            </td>
                            <td
                              className={`text-end pe-3 fw-bold ${
                                esIngreso ? 'text-success' : 'text-danger'
                              }`}
                            >
                              {esIngreso ? '+' : '-'}$
                              {Number(m.monto).toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}