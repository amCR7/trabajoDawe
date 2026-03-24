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
  //ESTADO DE CONEXIÓN ONLINE/OFFLINE
  const [estaOnline, setEstaOnline] = useState(navigator.onLine)

  //ESTADO PARA ABRIR O CERRAR EL PANEL DEL CARRITO
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  //PRODUCTOS
  const [productos, setProductos] = useState([])

  //AGREGAR LOS PRODUCTOS DEL FORMULARIO
  const agregarProducto = (producto) => {
    setProductos([...productos, producto])
  }

  //ESTADO PRINCIPAL DEL CARRITO (SE CARGA DESDE LOCALSTORAGE)
  const [carrito, setCarrito] = useState(() => cargarCarrito())

  //FORMULARIO DESHABILITADO SOLO SI NO HAY CONEXIÓN
  const formularioDeshabilitado = !estaOnline

  //VISTA FAVORITOS
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)

  //DETECTAR CAMBIOS DE CONEXIÓN A INTERNET
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

  //GUARDAR CARRITO EN LOCALSTORAGE CUANDO CAMBIE
  useEffect(() => {
    guardarCarritoCompleto(carrito)
  }, [carrito])

  //AÑADIR PRODUCTO AL CARRITO
  function agregarAlCarrito(producto) {
    let resultado = { ok: true, maximoAlcanzado: false }

    setCarrito((previo) => {
      const existente = previo.find((item) => item.id === producto.id)

      //SI EL PRODUCTO NO ESTÁ EN EL CARRITO
      if (!existente) {
        resultado = { ok: true, maximoAlcanzado: false }
        return [...previo, { ...producto, cantidad: 1 }]
      }

      //SI YA ALCANZÓ EL MÁXIMO DE COPIAS
      if (existente.cantidad >= MAX_COPIAS) {
        resultado = { ok: false, maximoAlcanzado: true }
        return previo
      }

      //SI EL PRODUCTO YA EXISTE, AUMENTAR CANTIDAD
      resultado = { ok: true, maximoAlcanzado: false }

      return previo.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: Math.min(item.cantidad + 1, MAX_COPIAS) }
          : item
      )
    })

    return resultado
  }

  //CAMBIAR CANTIDAD DE UN PRODUCTO DEL CARRITO
  function cambiarCantidadProducto(idProducto, nuevaCantidad) {
    setCarrito((previo) => {
      const cantidadNumerica = Number(nuevaCantidad)

      //SI LA CANTIDAD ES 0 O INVÁLIDA, SE ELIMINA EL PRODUCTO
      if (!Number.isFinite(cantidadNumerica) || cantidadNumerica <= 0) {
        return previo.filter((item) => item.id !== idProducto)
      }

      //ACTUALIZAR CANTIDAD LIMITADA ENTRE 1 Y MAX_COPIAS
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

  //ELIMINAR PRODUCTO DEL CARRITO
  function eliminarDelCarrito(idProducto) {
    setCarrito((previo) => previo.filter((item) => item.id !== idProducto))
  }

  //VACIAR COMPLETAMENTE EL CARRITO
  function vaciarCarrito() {
    setCarrito([])
  }

  //CAMBIAR A LA PÁGINA DE FAVORITOS
  function toggleMostrarFavoritos() {
    setMostrarFavoritos(prev => !prev)
  }

  return (
    <div className="app-tienda">
      {/*CABECERA DE LA APLICACIÓN*/}
      <Cabecera titulo="TecnoManía" />

      {/*MENÚ DE NAVEGACIÓN*/}
      <MenuNavegacion
        estaOnline={estaOnline}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        onMostrarFavoritos={toggleMostrarFavoritos}
        onMostrarTodos={() => setMostrarFavoritos(false)}
        mostrarFavoritos={mostrarFavoritos}
      />

      {/*CONTENIDO PRINCIPAL*/}
      <div className="contenido-principal">
        {/*FORMULARIO PARA AÑADIR PRODUCTOS*/}
        <aside className="zona-lateral">
          <FormularioNuevosProductos 
            onNuevoProducto={agregarProducto}
            onAgregarAlCarrito={agregarAlCarrito}
            deshabilitado={formularioDeshabilitado}
          />
        </aside>

        {/*ESCAPARATE DE PRODUCTOS*/}
        <main className="zona-productos">
          <EscaparateProductos 
            productos={productos}
            carrito={carrito}
            onAgregarAlCarrito={agregarAlCarrito}
            mostrarSoloFavoritos={mostrarFavoritos}
          />
        </main>
      </div>

      {/*PIE DE PÁGINA*/}
      <Pie texto="© 2026 TecnoManía" />

      {/*PANEL LATERAL DEL CARRITO*/}
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