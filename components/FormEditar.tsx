'use client'

import { useActionState } from 'react'
import { actualizarProducto, type EstadoProducto } from '@/app/_actions/economia-actions'

type Producto = {
    id: number | string
    codigo: string
    nombre: string
    precio: number | string
}

type Props = {
    producto: Producto
}

const estadoInicial: EstadoProducto = {
    exito: false,
    mensaje: ''
}

export default function FormEditar({ producto }: Props) {
    const [estado, accionFormulario, pendiente] = useActionState(
        async (prevState: EstadoProducto, formData: FormData) => {
            return await actualizarProducto(String(producto.id), prevState, formData)
        },
        estadoInicial
    )

    return (
        <form action={accionFormulario}>
            {estado.mensaje && (<p>{estado.mensaje}</p>)}

            <input name="codigo" defaultValue={producto.codigo} type="text" required />
            <input name="nombre" defaultValue={producto.nombre} type="text" required />
            <input name="precio" defaultValue={producto.precio} type="number" required />

            <button disabled={pendiente}>
                {pendiente ? 'Actualizando...' : 'Actualizar'}
            </button>
        </form>
    )
}