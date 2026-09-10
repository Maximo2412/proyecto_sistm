'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function crearMovimiento(formData: FormData) {
  const tipo = formData.get('tipo') as string;
  const descripcion = formData.get('descripcion') as string;
  const monto = parseFloat(formData.get('monto') as string);
  const fecha = formData.get('fecha') as string;

  if (!tipo || !monto || !fecha) {
    return;
  }

  const tipoNormalizado = tipo.toUpperCase();

  await db`
    INSERT INTO movimientos_economicos (tipo, descripcion, monto, fecha, categoria_id, responsable_id)
    VALUES (${tipoNormalizado}, ${descripcion}, ${monto}, ${fecha}, 1, 1)
  `;

  revalidatePath('/');
}