import { useMemo, useState, useEffect } from 'react'
import {
  productosIniciales,
  DIVISA,
  MAX_COPIAS,
  getCantidadProductoEnCarrito
} from '../tienda'

function EscaparateProductos({ productos, carrito, onAgregarAlCarrito, mostrarSoloFavoritos, onToggleFavorito }) {

  //ESTADOS PRINCIPALES DEL COMPONENTE
  //const [productos] = useState(productosIniciales)
  
  //ESTADOS PARA FILTROS
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [orden, setOrden] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  
  const [mensajesPorProducto, setMensajesPorProducto] = useState({})

  //ESTADO PARA EL MODAL
  const [productoModal, setProductoModal] = useState(null)

  //CONFIGURACIÓN PAGINACIÓN
  const PRODUCTOS_POR_PAGINA = 6

  // Función para obtener la categoría del producto
  function obtenerCategoriaProducto(producto) {
    if (producto.categoria === 'electrodomestico') {
      return 'electrodomesticos'
    }
    return producto.categoria
  }

  //NORMALIZAR TEXTO PARA BUSCADOR
  function normalizarTexto(texto) {
    return (texto ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  //ACORTAR DESCRIPCIÓN DEL PRODUCTO
  function shortDescription(texto, palabras = 3) {
    if (!texto) return ''

    const partes = texto.trim().split(/\s+/)

    if (partes.length <= palabras) {
      return texto
    }

    return partes.slice(0, palabras).join(' ') + '...'
  }

  //MOSTRAR MENSAJE TEMPORAL EN LA CARD
  function mostrarMensajeEnCard(idProducto, texto) {
    setMensajesPorProducto((previo) => ({
      ...previo,
      [idProducto]: texto
    }))

    setTimeout(() => {
      setMensajesPorProducto((previo) => {
        const copia = { ...previo }
        delete copia[idProducto]
        return copia
      })
    }, 1500)
  }

  //GESTIONAR AÑADIR PRODUCTO AL CARRITO
  function manejarAgregarCarrito(producto) {
    const resultado = onAgregarAlCarrito(producto)

    if (resultado?.ok) {
      mostrarMensajeEnCard(producto.id, 'Añadido al carrito ✅')
    } else if (resultado?.maximoAlcanzado) {
      mostrarMensajeEnCard(
        producto.id,
        `No se permiten más de ${MAX_COPIAS} copias.`
      )
    }
  }

  // ABRIR MODAL CON DESCRIPCIÓN EXTENDIDA
  function abrirModal(producto) {
    setProductoModal(producto)
  }

  // CERRAR MODAL
  function cerrarModal() {
    setProductoModal(null)
  }

  // CATEGORÍAS DISPONIBLES
  const categoriasDisponibles = [
    { valor: 'electrodomesticos', nombre: 'Electrodomésticos' },
    { valor: 'smartphone', nombre: 'Smartphones' },
    { valor: 'audio', nombre: 'Audio' },
    { valor: 'videojuego', nombre: 'Videojuegos' },
    { valor: 'accesorio', nombre: 'Accesorios' }
  ]

  // OPCIONES DE ORDEN
  const opcionesOrden = [
    { valor: 'nombre_asc', nombre: 'Nombre (A-Z)' },
    { valor: 'nombre_desc', nombre: 'Nombre (Z-A)' },
    { valor: 'precio_asc', nombre: 'Precio (menor a mayor)' },
    { valor: 'precio_desc', nombre: 'Precio (mayor a menor)' }
  ]

  // FILTRAR Y ORDENAR PRODUCTOS
  const productosFiltrados = useMemo(() => {
    let resultado = [...productos]

    // FILTRAR SOLO FAVORITOS
    if (mostrarSoloFavoritos) {
      resultado = resultado.filter(p => p.favorito)
    }

    // 1. FILTRAR POR CATEGORÍA
    if (categoria && categoria !== '') {
      resultado = resultado.filter(p => {
        const catProducto = obtenerCategoriaProducto(p)
        return catProducto === categoria
      })
    }

    // 2. FILTRAR POR BÚSQUEDA
    const textoBusqueda = normalizarTexto(busqueda.trim())
    if (textoBusqueda !== '') {
      resultado = resultado.filter((producto) =>
        normalizarTexto(producto.nombre).includes(textoBusqueda)
      )
    }

    // 3. ORDENAR
    if (orden && orden !== '') {
      switch (orden) {
        case 'precio_asc':
          resultado.sort((a, b) => a.precio - b.precio)
          break
        case 'precio_desc':
          resultado.sort((a, b) => b.precio - a.precio)
          break
        case 'nombre_asc':
          resultado.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
          break
        case 'nombre_desc':
          resultado.sort((a, b) => b.nombre.localeCompare(a.nombre, 'es', { sensitivity: 'base' }))
          break
        default:
          break
      }
    }

    return resultado
  }, [productos, busqueda, categoria, orden, mostrarSoloFavoritos])

  //TÍTULO DINÁMICO
  /*
  Ahorramos memoria
  Sin useMemo, el título se recalcularía en cada renderizado
  (sin que los filtros se cambien)
  con useMemo, solo se recalcula cuando cambian busqueda, categoria, favos u orden
  */
  const tituloDinamico = useMemo(() => {
    
    const partes = []
    const textoLimpio = busqueda.trim()
    
    //BUSCADOR
    if (textoLimpio !== '') {
      return `Buscando: ${textoLimpio}`
    }

    //FAVORITOS
    if (mostrarSoloFavoritos) {
      partes.push('Favoritos')
    }

    //CATEGORIA
    if (categoria && categoria !== '') {
      const catNombre = categoriasDisponibles.find(c => c.valor === categoria)?.nombre
      if (catNombre) partes.push(catNombre)
    }

    //ORDEN
    if (orden && orden !== '') {
      const ordenNombre = opcionesOrden.find(o => o.valor === orden)?.nombre
      if (ordenNombre) partes.push(ordenNombre)
    }
    if (partes.length === 0) {
      return 'Todos los productos'
    }

    return partes.join(' ⇨ ')
  }, [busqueda, categoria, mostrarSoloFavoritos, orden])

  //CÁLCULO DE PAGINACIÓN
  const totalPaginas =
    Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) || 1
  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const fin = inicio + PRODUCTOS_POR_PAGINA
  const productosPagina = productosFiltrados.slice(inicio, fin)
  const paginaActualAjustada = Math.min(paginaActual, totalPaginas)

  // Resetear página cuando cambian los filtros
  function resetearPagina() {
    setPaginaActual(1)
  }

  //EVENTOS
  function manejarBusqueda(evento) {
    setBusqueda(evento.target.value)
    resetearPagina()
  }

  function manejarCambioCategoria(evento) {
    setCategoria(evento.target.value)
    resetearPagina()
  }

  function manejarCambioOrden(evento) {
    setOrden(evento.target.value)
    resetearPagina()
  }

  //BOTÓN PAGINACIÓN
  function irPaginaAnterior() {
    setPaginaActual((previa) => Math.max(previa - 1, 1))
  }

  function irPaginaSiguiente() {
    setPaginaActual((previa) => Math.min(previa + 1, totalPaginas))
  }

  //ESTO RESETEA LAS COSAS (ejecuta acciones/efectos)
  /*
  Cuando cambio a favoritos, resetea los filtros y vuelve a pág 1
  useEffect se dispara cuando hay una acción y ejecuta algo
  acción ejecutada cuando cambia la variable de los corchetes
  */
  useEffect(() => {
    setPaginaActual(1)
    setBusqueda('')
    setCategoria('')
    setOrden('')
  }, [mostrarSoloFavoritos])

  return (
    <>
    <section className="escaparate-productos">

      {/*CABECERA CATÁLOGO - TÍTULO IZQUIERDA, FILTROS DERECHA EN HORIZONTAL*/}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          <h2 className="titulo-productos" style={{ margin: 0 }}>{tituloDinamico}</h2>

          {/* CONTENEDOR DE FILTROS EN HORIZONTAL */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row',
            gap: '12px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Selector de categoría */}
            <select
              value={categoria}
              onChange={manejarCambioCategoria}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="">-- Filtro Categoría --</option>
              {categoriasDisponibles.map(cat => (
                <option key={cat.valor} value={cat.valor}>{cat.nombre}</option>
              ))}
            </select>

            {/* Selector de orden */}
            <select
              value={orden}
              onChange={manejarCambioOrden}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="">-- Filtro Orden --</option>
              {opcionesOrden.map(opt => (
                <option key={opt.valor} value={opt.valor}>{opt.nombre}</option>
              ))}
            </select>

            {/* Buscador */}
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={manejarBusqueda}
              style={{ 
                padding: '8px 12px', 
                borderRadius: '4px', 
                border: '1px solid #ddd',
                fontSize: '14px',
                minWidth: '200px'
              }}
            />
          </div>
        </div>

        <hr />

      {/*GRID PRODUCTOS*/}
      <div className="grid-productos-react">
        {productosPagina.length > 0 ? (
          productosPagina.map((producto) => {

            //CANTIDAD ACTUAL EN CARRITO
            const cantidadEnCarrito = getCantidadProductoEnCarrito(
              carrito,
              producto.id
            )

            //DESACTIVAR BOTÓN SI SE ALCANZA EL MÁXIMO
            const deshabilitado = cantidadEnCarrito >= MAX_COPIAS

            return (
              <article key={producto.id} className="card-producto-react">

                {/*BOTÓN CARRITO*/}
                <button
                  className="btn-carrito-card"
                  type="button"
                  onClick={() => manejarAgregarCarrito(producto)}
                  disabled={deshabilitado}
                  title={
                    deshabilitado
                      ? `Máximo ${MAX_COPIAS} copias alcanzado`
                      : 'Añadir al carrito'
                  }
                >
                  🛒
                </button>

                {/*BOTÓN FAVORITO*/}
                <button
                  className="btn-favorito-card"
                  type="button"
                  onClick={() => onToggleFavorito(producto.id)}
                >
                  {producto.favorito ? '❤️' : '🤍'}
                </button>

                {/*IMAGEN PRODUCTO*/}
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="imagen-producto-react"
                  style={{ cursor: 'pointer' }}
                  onClick={() => abrirModal(producto)}
                />

                {/*CUERPO CARD*/}
                <div className="cuerpo-card-producto">
                  <h3 className="nombre-producto-react">{producto.nombre}</h3>

                  <p className="descripcion-producto-react">
                    {shortDescription(producto.descripcion, 3)}
                  </p>

                  <div className="precio-producto-react">
                    {producto.precio} {DIVISA}
                  </div>

                  <small className="extra-producto-react">
                    {producto.extra}
                  </small>

                  {/*MOSTRAR CANTIDAD EN CARRITO*/}
                  {cantidadEnCarrito > 0 && (
                    <small className="cantidad-en-carrito-react">
                      En carrito: {cantidadEnCarrito}
                    </small>
                  )}

                  {/*MENSAJE DENTRO DE LA CARD*/}
                  {mensajesPorProducto[producto.id] && (
                    <div className="mensaje-carrito-card-react">
                      {mensajesPorProducto[producto.id]}
                    </div>
                  )}
                </div>
              </article>
            )
          })
        ) : (
          <p>No hay productos favoritos.</p>
        )}
      </div>

      {/*INFO PAGINACIÓN*/}
      <div className="info-paginacion-react">
        Mostrando {productosPagina.length} de {productosFiltrados.length}
      </div>

      {/*CONTROLES PAGINACIÓN*/}
      <div className="contenedor-paginacion-react">
        <div className="paginacion-react">
          <button onClick={irPaginaAnterior} disabled={paginaActual === 1}>
            Anterior
          </button>

          <span>
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={irPaginaSiguiente}
            disabled={
              paginaActual === totalPaginas || productosFiltrados.length === 0
            }
          >
            Siguiente
          </button>
        </div>
      </div>

    </section>

    {/* MODAL PARA DESCRIPCIÓN EXTENDIDA */}
    {productoModal && (
      <>
        <div className="product-overlay" onClick={cerrarModal}></div>
        <div className="product-modal">
          <div className="modal-image">
            <img src={productoModal.imagen} alt={productoModal.nombre} />
          </div>
          <div className="modal-details">
            <span className="close-modal" onClick={cerrarModal}>&times;</span>
            <h3>{productoModal.nombre}</h3>
            <div className="price">{productoModal.precio} {DIVISA}</div>
            <div className="extra">{productoModal.extra}</div>
            <div className="description">{productoModal.descripcion}</div>
          </div>
        </div>
      </>
    )}
  </>
  )
}

export default EscaparateProductos