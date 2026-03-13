import { useState } from 'react'
import { DIVISA, MAX_COPIAS, getTotalCarrito } from '../tienda'

function Carrito({
  carrito,
  onCerrar,
  onCambiarCantidad,
  onEliminarProducto,
  onVaciarCarrito
}) {
  const total = getTotalCarrito(carrito)
  const [avisos, setAvisos] = useState({})

  function mostrarAviso(idProducto, texto) {
    setAvisos((previo) => ({
      ...previo,
      [idProducto]: texto
    }))

    setTimeout(() => {
      setAvisos((previo) => {
        const copia = { ...previo }
        delete copia[idProducto]
        return copia
      })
    }, 1500)
  }

  function manejarCambioCantidad(idProducto, valor) {
    const cantidadNumerica = Number(valor)

    if (cantidadNumerica > MAX_COPIAS) {
      onCambiarCantidad(idProducto, MAX_COPIAS)
      mostrarAviso(idProducto, `No se permiten más de ${MAX_COPIAS} copias.`)
      return
    }

    if (!Number.isFinite(cantidadNumerica) || cantidadNumerica <= 0) {
      onEliminarProducto(idProducto)
      return
    }

    onCambiarCantidad(idProducto, cantidadNumerica)
  }

  function manejarKeyDownInput(evento, producto) {
    if (evento.key === 'ArrowUp' && producto.cantidad >= MAX_COPIAS) {
      evento.preventDefault()
      mostrarAviso(
        producto.id,
        `No se permiten más de ${MAX_COPIAS} copias.`
      )
    }

    if (evento.key === 'ArrowDown' && producto.cantidad === 1) {
      evento.preventDefault()
      onEliminarProducto(producto.id)
    }
  }

  function manejarPointerDownSpinner(evento, producto) {
    const input = evento.currentTarget
    const rect = input.getBoundingClientRect()

    const clickEnZonaSpinner = evento.clientX > rect.right - 30
    if (!clickEnZonaSpinner) return

    const clickEnParteSuperior = evento.clientY < rect.top + rect.height / 2
    const clickEnParteInferior = !clickEnParteSuperior

    if (clickEnParteSuperior && producto.cantidad >= MAX_COPIAS) {
      evento.preventDefault()
      mostrarAviso(
        producto.id,
        `No se permiten más de ${MAX_COPIAS} copias.`
      )
    }

    if (clickEnParteInferior && producto.cantidad === 1) {
      evento.preventDefault()
      onEliminarProducto(producto.id)
    }
  }

  return (
    <div className="overlay-carrito">
      <div className="panel-carrito">
        <div className="cabecera-carrito">
          <h2>Carrito de la compra</h2>
          <button onClick={onCerrar} type="button">
            ✕
          </button>
        </div>

        <div className="contenido-carrito">
          {carrito.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            <>
              <div className="lista-carrito">
                {carrito.map((producto) => (
                  <article key={producto.id} className="item-carrito-react">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="imagen-item-carrito"
                    />

                    <div className="datos-item-carrito">
                      <h3>{producto.nombre}</h3>
                      <p>
                        {producto.precio} {DIVISA}
                      </p>

                      <div className="controles-item-carrito">
                        <label htmlFor={`cantidad-${producto.id}`}>
                          Cantidad:
                        </label>

                        <input
                          id={`cantidad-${producto.id}`}
                          type="number"
                          min="0"
                          max={MAX_COPIAS}
                          value={producto.cantidad}
                          onChange={(e) =>
                            manejarCambioCantidad(producto.id, e.target.value)
                          }
                          onKeyDown={(e) => manejarKeyDownInput(e, producto)}
                          onPointerDown={(e) =>
                            manejarPointerDownSpinner(e, producto)
                          }
                        />

                        <button
                          type="button"
                          onClick={() => onEliminarProducto(producto.id)}
                        >
                          Eliminar
                        </button>
                      </div>

                      {avisos[producto.id] && (
                        <div className="aviso-max-copias-react">
                          {avisos[producto.id]}
                        </div>
                      )}

                      <div className="subtotal-item-carrito">
                        Subtotal: {(producto.precio * producto.cantidad).toFixed(2)}{' '}
                        {DIVISA}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <hr />

              <div className="pie-carrito">
                <h3>
                  Total: {total.toFixed(2)} {DIVISA}
                </h3>

                <button
                  type="button"
                  className="btn-vaciar-carrito"
                  onClick={onVaciarCarrito}
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Carrito