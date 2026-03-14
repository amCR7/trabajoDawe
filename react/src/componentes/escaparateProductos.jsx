import { useMemo, useState } from 'react'
import {
  productosIniciales,
  DIVISA,
  MAX_COPIAS,
  getCantidadProductoEnCarrito
} from '../tienda'

function EscaparateProductos({ carrito, onAgregarAlCarrito }) {

  //ESTADOS PRINCIPALES DEL COMPONENTE
  const [productos] = useState(productosIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [mensajesPorProducto, setMensajesPorProducto] = useState({})

  //CONFIGURACIÓN PAGINACIÓN
  const PRODUCTOS_POR_PAGINA = 6

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

  //FILTRAR PRODUCTOS SEGÚN BUSCADOR
  const productosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda.trim())

    if (textoBusqueda === '') {
      return productos
    }

    return productos.filter((producto) =>
      normalizarTexto(producto.nombre).includes(textoBusqueda)
    )
  }, [productos, busqueda])

  //MOSTRAR MENSAJE BUSCADOR
  const tituloDinamico = useMemo(() => {
    const textoLimpio = busqueda.trim()

    if (textoLimpio === '') {
      return 'Todos los productos'
    }

    return `Buscando: ${textoLimpio}`
  }, [busqueda])

  //CÁLCULO DE PAGINACIÓN
  const totalPaginas =
    Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) || 1

  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const fin = inicio + PRODUCTOS_POR_PAGINA
  const productosPagina = productosFiltrados.slice(inicio, fin)

  //EVENTO BUSCADOR
  function manejarBusqueda(evento) {
    setBusqueda(evento.target.value)
    setPaginaActual(1)
  }

  //BOTÓN PÁGINA ANTERIOR
  function irPaginaAnterior() {
    setPaginaActual((previa) => Math.max(previa - 1, 1))
  }

  //BOTÓN PÁGINA SIGUIENTE
  function irPaginaSiguiente() {
    setPaginaActual((previa) => Math.min(previa + 1, totalPaginas))
  }

  return (
    <section className="escaparate-productos">

      {/*CABECERA CATÁLOGO*/}
      <div className="cabecera-catalogo">
        <h2 className="titulo-productos">{tituloDinamico}</h2>

        <div className="zona-controles-catalogo">
          <input
            className="input-buscador"
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={manejarBusqueda}
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
                <button className="btn-favorito-card" type="button">
                  {producto.favorito ? '❤️' : '🤍'}
                </button>

                {/*IMAGEN PRODUCTO*/}
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="imagen-producto-react"
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
          <p>No hay productos que coincidan con la búsqueda.</p>
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
  )
}

export default EscaparateProductos