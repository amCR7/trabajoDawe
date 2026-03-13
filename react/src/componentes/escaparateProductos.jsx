import { useMemo, useState } from 'react'
import {
  productosIniciales,
  DIVISA,
  MAX_COPIAS,
  getCantidadProductoEnCarrito
} from '../tienda'

function EscaparateProductos({ carrito, onAgregarAlCarrito }) {
  const [productos] = useState(productosIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)
  const [mensajesPorProducto, setMensajesPorProducto] = useState({})

  const PRODUCTOS_POR_PAGINA = 6

  function normalizarTexto(texto) {
    return (texto ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  function shortDescription(texto, palabras = 3) {
    if (!texto) return ''

    const partes = texto.trim().split(/\s+/)

    if (partes.length <= palabras) {
      return texto
    }

    return partes.slice(0, palabras).join(' ') + '...'
  }

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

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda.trim())

    if (textoBusqueda === '') {
      return productos
    }

    return productos.filter((producto) =>
      normalizarTexto(producto.nombre).includes(textoBusqueda)
    )
  }, [productos, busqueda])

  const totalPaginas =
    Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) || 1

  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const fin = inicio + PRODUCTOS_POR_PAGINA
  const productosPagina = productosFiltrados.slice(inicio, fin)

  function manejarBusqueda(evento) {
    setBusqueda(evento.target.value)
    setPaginaActual(1)
  }

  function irPaginaAnterior() {
    setPaginaActual((previa) => Math.max(previa - 1, 1))
  }

  function irPaginaSiguiente() {
    setPaginaActual((previa) => Math.min(previa + 1, totalPaginas))
  }

  return (
    <section className="escaparate-productos">
      <div className="cabecera-catalogo">
        <h2 className="titulo-productos">Todos los productos</h2>

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

      <div className="grid-productos-react">
        {productosPagina.length > 0 ? (
          productosPagina.map((producto) => {
            const cantidadEnCarrito = getCantidadProductoEnCarrito(
              carrito,
              producto.id
            )

            const deshabilitado = cantidadEnCarrito >= MAX_COPIAS

            return (
              <article key={producto.id} className="card-producto-react">
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

                <button className="btn-favorito-card" type="button">
                  {producto.favorito ? '❤️' : '🤍'}
                </button>

                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="imagen-producto-react"
                />

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

                  {cantidadEnCarrito > 0 && (
                    <small className="cantidad-en-carrito-react">
                      En carrito: {cantidadEnCarrito}
                    </small>
                  )}

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

      <div className="info-paginacion-react">
        Mostrando {productosPagina.length} de {productosFiltrados.length}
      </div>

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