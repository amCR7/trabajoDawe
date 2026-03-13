import './App.css'
import { useEffect, useState } from 'react'
import Cabecera from './componentes/cabecera'
import MenuNavegacion from './componentes/menuNavegacion'
import EscaparateProductos from './componentes/escaparateProductos'
import FormularioNuevosProductos from './componentes/formularioNuevosProductos'
import Carrito from './componentes/carrito'
import Pie from './componentes/pie'
import {
  cargarCarrito,
  guardarCarritoCompleto,
  MAX_COPIAS
} from './tienda'

function App() {
  const [estaOnline, setEstaOnline] = useState(navigator.onLine)
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [carrito, setCarrito] = useState(() => cargarCarrito())

  useEffect(() => {
    const activarOnline = () => setEstaOnline(true)
    const activarOffline = () => setEstaOnline(false)

    window.addEventListener('online', activarOnline)
    window.addEventListener('offline', activarOffline)

    return () => {
      window.removeEventListener('online', activarOnline)
      window.removeEventListener('offline', activarOffline)
    }
  }, [])

  useEffect(() => {
    guardarCarritoCompleto(carrito)
  }, [carrito])

  function agregarAlCarrito(producto) {
    let resultado = { ok: true, maximoAlcanzado: false }

    setCarrito((previo) => {
      const existente = previo.find((item) => item.id === producto.id)

      if (!existente) {
        resultado = { ok: true, maximoAlcanzado: false }
        return [...previo, { ...producto, cantidad: 1 }]
      }

      if (existente.cantidad >= MAX_COPIAS) {
        resultado = { ok: false, maximoAlcanzado: true }
        return previo
      }

      resultado = { ok: true, maximoAlcanzado: false }

      return previo.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: Math.min(item.cantidad + 1, MAX_COPIAS) }
          : item
      )
    })

    return resultado
  }

  function cambiarCantidadProducto(idProducto, nuevaCantidad) {
    setCarrito((previo) => {
      const cantidadNumerica = Number(nuevaCantidad)

      if (!Number.isFinite(cantidadNumerica) || cantidadNumerica <= 0) {
        return previo.filter((item) => item.id !== idProducto)
      }

      return previo.map((item) =>
        item.id === idProducto
          ? {
              ...item,
              cantidad: Math.min(Math.max(cantidadNumerica, 1), MAX_COPIAS)
            }
          : item
      )
    })
  }

  function eliminarDelCarrito(idProducto) {
    setCarrito((previo) => previo.filter((item) => item.id !== idProducto))
  }

  function vaciarCarrito() {
    setCarrito([])
  }

  return (
    <div className="app-tienda">
      <Cabecera titulo="TecnoManía" />

      <MenuNavegacion
        estaOnline={estaOnline}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <div className="contenido-principal">
        <aside className="zona-lateral">
          <FormularioNuevosProductos />
        </aside>

        <main className="zona-productos">
          <EscaparateProductos
            carrito={carrito}
            onAgregarAlCarrito={agregarAlCarrito}
          />
        </main>
      </div>

      <Pie texto="© 2026 TecnoManía" />

      {carritoAbierto && (
        <Carrito
          carrito={carrito}
          onCerrar={() => setCarritoAbierto(false)}
          onCambiarCantidad={cambiarCantidadProducto}
          onEliminarProducto={eliminarDelCarrito}
          onVaciarCarrito={vaciarCarrito}
        />
      )}
    </div>
  )
}

export default App