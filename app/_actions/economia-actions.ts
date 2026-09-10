'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { obtenerSesionServidor } from '@/lib/auth'; 

export async function crearMovimientoEconómico(formData: FormData) {
  const usuario = await obtenerSesionServidor();

  if (!usuario) {
    throw new Error('Debés iniciar sesión para realizar esta acción.');
  }

  const rolesPermitidos = ['administrador', 'cooperadora'];
  if (!rolesPermitidos.includes(usuario.rol_nombre)) {
    throw new Error('Acceso denegado: Solo el personal de Cooperadora puede registrar o modificar gastos.');
  }

  const tipo = formData.get('tipo') as string;
  const monto = parseFloat(formData.get('monto') as string);
  const categoria_id = parseInt(formData.get('categoria_id') as string);
  const descripcion = formData.get('descripcion') as string;
  const fecha = formData.get('fecha') as string;

  await db`
    INSERT INTO movimientos_economicos 
      (tipo, monto, categoria_id, fecha, responsable_id, descripcion) 
    VALUES 
      (${tipo}, ${monto}, ${categoria_id}, ${fecha}, ${usuario.id}, ${descripcion})
  `;

  revalidatePath('/transparencia');
}

export type EstadoProducto = {
  exito: boolean;
  mensaje: string;
};

export async function crearProducto(prevState: EstadoProducto, formData: FormData): Promise<EstadoProducto> {
  return { exito: true, mensaje: 'Producto creado correctamente' };
}

export async function actualizarProducto(
  id: string,
  prevState: EstadoProducto,
  formData: FormData
): Promise<EstadoProducto> {
  return { exito: true, mensaje: 'Producto actualizado con éxito' };
}