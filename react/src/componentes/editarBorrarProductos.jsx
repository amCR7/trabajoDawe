import { useState } from 'react'

function EditarBorrarProductos({
  productos,
  onProductosBorrados,
  onProductoActualizado,
  deshabilitado
}) {
  const [productosSeleccionados, setProductosSeleccionados] = useState([])
  const [productoEditando, setProductoEditando] = useState(null)
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imagen: '',
    categoria: '',
    extra: '',
    favorito: false
  })
  const [mensaje, setMensaje] = useState('')

  const camposExtra = {
    televisor: 'Años de garantía',
    electrodomestico: 'Años de garantía',
    smartphone: 'Sistema Operativo',
    audio: 'Tipo de audio',
    accesorio: 'Compatibilidad',
    videojuego: 'Plataforma/Generación'
  }

  function mostrarMensaje(texto, duracion = 3000) {
    setMensaje(texto)

    setTimeout(() => {
      setMensaje('')
    }, duracion)
  }

  async function leerRespuestaJSON(res) {
    const texto = await res.text()

    try {
      return JSON.parse(texto)
    } catch {
      throw new Error(texto || 'El servidor no ha devuelto JSON')
    }
  }

  function cambiarSeleccion(idProducto) {
    setProductosSeleccionados((previos) => {
      if (previos.includes(idProducto)) {
        return previos.filter((id) => id !== idProducto)
      }

      return [...previos, idProducto]
    })
  }

  function abrirCerrarFormulario(producto) {
    if (deshabilitado) return

    if (productoEditando === producto.id) {
      setProductoEditando(null)
      return
    }

    setProductoEditando(producto.id)

    setFormulario({
      nombre: producto.nombre || '',
      precio: producto.precio || '',
      descripcion: producto.descripcion || '',
      imagen: producto.imagen || '',
      categoria: producto.categoria || '',
      extra: producto.extra || '',
      favorito: producto.favorito ?? false
    })
  }

  function cambiarCampo(e) {
    const { name, value } = e.target

    setFormulario((previo) => ({
      ...previo,
      [name]: value
    }))
  }

  async function borrarSeleccionados() {
    if (deshabilitado) return

    if (productosSeleccionados.length === 0) {
      mostrarMensaje('❌ Selecciona al menos un producto para borrar')
      return
    }

    try {
      const res = await fetch('http://localhost:3001/productos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ids: productosSeleccionados
        })
      })

      const data = await leerRespuestaJSON(res)

      if (!res.ok) {
        throw new Error(data.error || 'Error borrando productos')
      }

      onProductosBorrados(productosSeleccionados)
      setProductosSeleccionados([])
      setProductoEditando(null)
      mostrarMensaje('✅ Productos borrados correctamente')
    } catch (error) {
      console.error('Error borrando productos:', error)
      mostrarMensaje(`❌ ${error.message}`)
    }
  }

  async function guardarCambios(e) {
    e.preventDefault()

    if (deshabilitado) return

    if (!formulario.nombre.trim()) {
      mostrarMensaje('❌ El nombre no puede estar vacío')
      return
    }

    if (!formulario.precio || Number(formulario.precio) <= 0) {
      mostrarMensaje('❌ El precio debe ser positivo')
      return
    }

    const productoActualizado = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      precio: Number(formulario.precio),
      descripcion: formulario.descripcion || 'Sin descripción'
    }

    try {
      const res = await fetch(`http://localhost:3001/productos/${productoEditando}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(productoActualizado)
      })

      const data = await leerRespuestaJSON(res)

      if (!res.ok) {
        throw new Error(data.error || 'Error actualizando producto')
      }

      onProductoActualizado({
        id: data._id,
        nombre: data.nombre,
        precio: data.precio,
        descripcion: data.descripcion,
        imagen: data.imagen,
        categoria: data.categoria,
        extra: data.extra,
        favorito: data.favorito ?? false
      })

      setProductoEditando(null)
      mostrarMensaje('✅ Producto actualizado correctamente')
    } catch (error) {
      console.error('Error actualizando producto:', error)
      mostrarMensaje(`❌ ${error.message}`)
    }
  }

  return (
    <section className="editar-borrar-productos">
      <div className="editar-cabecera">
        <h2>Editar/Borrar productos</h2>

        <button
          type="button"
          className="btn-borrar-seleccionados"
          onClick={borrarSeleccionados}
          disabled={deshabilitado || productosSeleccionados.length === 0}
        >
          Borrar todos los seleccionados
        </button>
      </div>

      {deshabilitado && (
        <p className="mensaje-offline">
          Estás sin conexión. No se pueden editar ni borrar productos.
        </p>
      )}

      {mensaje && <p className="mensaje-editar-productos">{mensaje}</p>}

      {productos.length === 0 ? (
        <p>No hay productos para editar o borrar.</p>
      ) : (
        <div className="lista-productos-edicion">
          {productos.map((producto) => (
            <article key={producto.id} className="producto-edicion">
              <div className="fila-producto-edicion">
                <input
                  type="checkbox"
                  className="checkbox-producto-edicion"
                  checked={productosSeleccionados.includes(producto.id)}
                  onChange={() => cambiarSeleccion(producto.id)}
                  disabled={deshabilitado}
                />

                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="imagen-producto-edicion"
                />

                <div className="datos-producto-edicion">
                  <h3>{producto.nombre}</h3>
                  <p className="precio-producto-edicion">{producto.precio} €</p>
                  <p className="categoria-producto-edicion">{producto.categoria}</p>
                </div>

                {deshabilitado ? (
                  <span className="editar-producto-deshabilitado">
                    Editar no disponible offline
                  </span>
                ) : (
                  <button
                    type="button"
                    className="btn-editar-producto"
                    onClick={() => abrirCerrarFormulario(producto)}
                  >
                    {productoEditando === producto.id ? 'Cerrar' : 'Editar'}
                  </button>
                )}
              </div>

              {productoEditando === producto.id && (
                <form className="formulario-editar-producto" onSubmit={guardarCambios}>
                  <div className="campo-editar-producto">
                    <label>Tipo de producto</label>
                    <input
                      type="text"
                      value={formulario.categoria}
                      disabled
                    />
                  </div>

                  <div className="campo-editar-producto">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={cambiarCampo}
                      disabled={deshabilitado}
                      required
                    />
                  </div>

                  <div className="campo-editar-producto">
                    <label>Precio</label>
                    <input
                      type="number"
                      name="precio"
                      min="0"
                      step="0.01"
                      value={formulario.precio}
                      onChange={cambiarCampo}
                      disabled={deshabilitado}
                      required
                    />
                  </div>

                  <div className="campo-editar-producto">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formulario.descripcion}
                      onChange={cambiarCampo}
                      disabled={deshabilitado}
                    />
                  </div>

                  <div className="campo-editar-producto">
                    <label>{camposExtra[formulario.categoria] || 'Campo extra'}</label>
                    <input
                      type="text"
                      name="extra"
                      value={formulario.extra}
                      onChange={cambiarCampo}
                      disabled={deshabilitado}
                    />
                  </div>

                  <div className="campo-editar-producto">
                    <label>Imagen</label>
                    <input
                      type="text"
                      name="imagen"
                      value={formulario.imagen}
                      onChange={cambiarCampo}
                      disabled={deshabilitado}
                    />

                    {formulario.imagen && (
                      <img
                        src={formulario.imagen}
                        alt={formulario.nombre}
                        className="preview-imagen-edicion"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-guardar-producto"
                    disabled={deshabilitado}
                  >
                    Guardar cambios
                  </button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default EditarBorrarProductos