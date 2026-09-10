import { db } from '@/lib/db';

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

export default async function TransparenciaPage() {
  const { balance, movimientos } = await getDatosEconomicos();

  return (
    <main className="container py-4">
      {/* Banner de Transparencia */}
      <div className="bg-white p-4 rounded shadow-sm border mb-4">
        <h1 className="h3 fw-bold text-primary mb-2">Transparencia Económica</h1>
        <p className="text-muted mb-0">
          Estado financiero y registro de cuentas públicas del establecimiento.
        </p>
      </div>

      {/* Resumen de Cuentas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <span className="text-muted small">Total Ingresos</span>
            <span className="fs-4 fw-bold text-success">
              +${Number(balance.total_ingresos || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <span className="text-muted small">Total Egresos</span>
            <span className="fs-4 fw-bold text-danger">
              -${Number(balance.total_egresos || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm text-center p-3 bg-light">
            <span className="text-muted small">Saldo Disponible</span>
            <span className="fs-4 fw-bold text-dark">
              ${Number(balance.saldo || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabla Pública de Movimientos */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold text-secondary">Registro Público de Movimientos</h5>
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
                      No hay datos públicos registrados.
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
    </main>
  );
}