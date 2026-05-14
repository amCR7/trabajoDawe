import './App.css'
import { useEffect, useState } from 'react'
import Cabecera from './componentes/cabecera'
import MenuNavegacion from './componentes/menuNavegacion'
import EscaparateProductos from './componentes/escaparateProductos'
import FormularioNuevosProductos from './componentes/formularioNuevosProductos'
import Carrito from './componentes/carrito'
import Pie from './componentes/pie'
import MiCuenta from './componentes/MiCuenta'

import {
  cargarCarrito,
  guardarCarritoCompleto,
  MAX_COPIAS,
} from './tienda'
import Login from './componentes/Login'

function App() {
  //ESTADO DE CONEXIÓN ONLINE/OFFLINE
  const [estaOnline, setEstaOnline] = useState(navigator.onLine)

  //ESTADO PARA ABRIR O CERRAR EL PANEL DEL CARRITO
  const [carritoAbierto, setCarritoAbierto] = useState(false)

  //PRODUCTOS DESDE MONGODB
  const [productos, setProductos] = useState([])

  //LOGIN
  const [usuario, setUsuario] = useState(null)
  const [visitas, setVisitas] = useState(0)

  //AGREGAR LOS PRODUCTOS DEL FORMULARIO
  const agregarProducto = (producto) => {
    setProductos([...productos, producto])
  }

  const [vista, setVista] = useState("inicio")

  //ALTERNAR FAVORITO
  function toggleFavorito(idProducto) {
    setProductos(prev =>
      prev.map(p =>
        p.id === idProducto
          ? { ...p, favorito: !p.favorito }
          : p
      )
    )
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

  //CAMBIAR CANTIDAD DE UN PRODUCTO DEL CARRITO
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

  //MANTENER USUARIO AL REFRESCAR
useEffect(() => {
  const comprobarSesion = async () => {
    try {
      const res = await fetch("http://localhost:3001/usuario", {
        credentials: "include"
      })
  
      if (!res.ok) return
  
      const data = await res.json()
  
      setUsuario({
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol,
        fechaRegistro: data.fechaRegistro,
        telefono: data.telefono,
        direccion: data.direccion,
        ciudad: data.ciudad
      })
  
      setVisitas(data.visitas)
    } catch (error) {
      console.error("Error comprobando sesión:", error)
    }
  }
  
  comprobarSesion()
}, [])

  //CARGAR PRODUCTOS DE MONGODB
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await fetch("http://localhost:3001/productos")
        const data = await res.json()
  
        console.log("PRODUCTOS BACKEND:", data)

        setProductos(
          data.map(p => ({
            id: p._id,
            nombre: p.nombre,
            precio: p.precio,
            descripcion: p.descripcion,
            imagen: p.imagen,
            categoria: p.categoria,
            extra: p.extra,
            favorito: p.favorito ?? false
          }))
        )
  
      } catch (error) {
        console.error("Error cargando productos:", error)
      }
    }
  
    cargarProductos()
  }, [])

  //LOGOUT
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/logout", {
        method: "POST",
        credentials: "include"
      })
  
      setUsuario(null)
      setVisitas(0)
  
    } catch (error) {
      console.error("Error al cerrar sesión", error)
    }
  }

  return (
    <div className="app-tienda">
  
      {/*CABECERA*/}
      <Cabecera titulo="TecnoManía" />
  
      {/*MENÚ*/}
      <MenuNavegacion
        estaOnline={estaOnline}
        onAbrirCarrito={() => setCarritoAbierto(true)}
        onMostrarFavoritos={toggleMostrarFavoritos}
        onMostrarTodos={() => setMostrarFavoritos(false)}
        mostrarFavoritos={mostrarFavoritos}
        usuario={usuario}
        setVista={setVista}
      />
  
      {/*CONTENIDO*/}
      <div className="contenido-principal">
  
        {/* ASIDE = LOGIN / PANEL USUARIO */}
        <aside className="zona-lateral">
  
          {!usuario ? (
            <Login setUsuario={setUsuario} setVisitas={setVisitas} />
          ) : (
            <div className="panel-usuario">
              <h3>Bienvenide,</h3>
              <p>{usuario.nombre} {usuario.apellido}</p>

              <div className="info-usuario">
                <p><strong>Rol:</strong> {usuario.rol || "usuario"}</p>
                <p><strong>Visitas:</strong> {visitas}</p>
              </div>

              <button onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
  
        </aside>
  
        {/* MAIN = TIENDA SIEMPRE */}
        <main className="zona-productos">
          
          {/* INICIO → PRODUCTOS */}
          {vista === "inicio" && (
            <EscaparateProductos 
              productos={productos}
              carrito={carrito}
              onAgregarAlCarrito={agregarAlCarrito}
              mostrarSoloFavoritos={mostrarFavoritos}
              onToggleFavorito={toggleFavorito}
            />
          )}

          {/* AÑADIR PRODUCTO */}
          {vista === "anadir" && usuario?.rol === "admin" && (
            <FormularioNuevosProductos 
              onNuevoProducto={agregarProducto}
              onAgregarAlCarrito={agregarAlCarrito}
              deshabilitado={formularioDeshabilitado}
            />
          )}

          {/* MI CUENTA */}
          {vista === "cuenta" && usuario && (
            <MiCuenta 
              usuario={usuario}
              setUsuario={setUsuario}
              estaOnline={estaOnline}
            />
          )}

        </main>
      </div>
  
      {/*PIE*/}
      <Pie texto="© 2026 TecnoManía" />
  
      {/*CARRITO*/}
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