import { useMemo, useState } from 'react'
import { productosIniciales, DIVISA } from '../tienda'

function EscaparateProductos() {
  const [productos] = useState(productosIniciales)
  const [busqueda, setBusqueda] = useState('')
  const [paginaActual, setPaginaActual] = useState(1)

  const PRODUCTOS_POR_PAGINA = 6

  function normalizarTexto(texto) {
    return (texto ?? '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
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

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) || 1
  const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
  const indiceFin = indiceInicio + PRODUCTOS_POR_PAGINA

  const productosPagina = productosFiltrados.slice(indiceInicio, indiceFin)

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
      <h2>Catálogo de productos</h2>

      <div className="bloque-buscador">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={manejarBusqueda}
        />
      </div>

      <div className="rejilla-productos">
        {productosPagina.length > 0 ? (
          productosPagina.map((producto) => (
            <article key={producto.id} className="tarjeta-producto">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="imagen-producto"
              />

              <h3>{producto.nombre}</h3>

              <p>{producto.descripcion}</p>

              <p className="precio-producto">
                {producto.precio} {DIVISA}
              </p>
            </article>
          ))
        ) : (
          <p>No hay productos que coincidan con la búsqueda.</p>
        )}
      </div>

      <div className="info-paginacion">
        Mostrando {productosPagina.length} de {productosFiltrados.length}
      </div>

      <div className="paginacion">
        <button onClick={irPaginaAnterior} disabled={paginaActual === 1}>
          Anterior
        </button>

        <span>
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={irPaginaSiguiente}
          disabled={paginaActual === totalPaginas || productosFiltrados.length === 0}
        >
          Siguiente
        </button>
      </div>
    </section>
  )
}

export default EscaparateProductos