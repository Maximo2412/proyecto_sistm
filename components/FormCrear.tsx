'use client'

import { crearProducto, type EstadoProducto } from '@/app/_actions/economia-actions'
import { useActionState } from 'react'

const estadoInicial: EstadoProducto = {
    exito: false,
    mensaje: ''
}

export default function FormCrear() {
    const [estado, accionFormulario, pendiente] = useActionState(crearProducto, estadoInicial)
    return (
        <form action={accionFormulario} >
            {estado.mensaje && (<p>{estado.mensaje}</p>)}

            <input name="codigo" placeholder="Codigo..." type="text" required />
            <input name="nombre" placeholder="Nombre..." type="text" required />
            <input name="precio" placeholder="Precio..." type="number" required />
            
            <button disabled={pendiente}>
                {pendiente ? 'Guardando...' : 'Guardar'}
            </button>
        </form>
    )
}