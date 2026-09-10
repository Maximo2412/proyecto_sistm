'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function crearMovimiento(formData: FormData) {
  const tipo = formData.get('tipo') as string;
  const descripcion = formData.get('descripcion') as string;
  const monto = Math.abs(parseFloat(formData.get('monto') as string));
  const fecha = formData.get('fecha') as string;
  const categoriaRaw = formData.get('categoria_id');

  if (!tipo || !monto || !fecha) {
    return;
  }

  // Si no se selecciona categoría, guardamos NULL o el ID parseado
  const categoriaId = categoriaRaw ? parseInt(categoriaRaw as string, 10) : null;
  const tipoNormalizado = tipo.toUpperCase();

  await db`
    INSERT INTO movimientos_economicos (tipo, descripcion, monto, fecha, categoria_id, responsable_id)
    VALUES (${tipoNormalizado}, ${descripcion}, ${monto}, ${fecha}, ${categoriaId}, 1)
  `;

  revalidatePath('/');
  revalidatePath('/transparencia');
}