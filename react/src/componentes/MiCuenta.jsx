import { useState, useEffect } from 'react'

export default function MiCuenta({ usuario, setUsuario, estaOnline }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaRegistro, setFechaRegistro] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || '')
      setApellido(usuario.apellido || '')
      setFechaRegistro(usuario.fechaRegistro || '')
      setTelefono(usuario.telefono || '')
      setDireccion(usuario.direccion || '')
      setCiudad(usuario.ciudad || '')
    }
  }, [usuario])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMensajeExito('')
    
    if (!nombre.trim()) {
      setError('El nombre no puede estar vacío')
      setTimeout(() => setError(''), 3000)
      return
    }

    setCargando(true)

    try {
      const response = await fetch('http://localhost:3001/usuarios/actualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: usuario.email,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          fechaRegistro: fechaRegistro,
          telefono: telefono,
          direccion: direccion,
          ciudad: ciudad
        })
      })

      console.log('Respuesta status:', response.status)

      if (response.ok) {
        const data = await response.json()
        setUsuario((prev) => ({
          ...prev,
          nombre: data.nombre,
          apellido: data.apellido,
          fechaRegistro: data.fechaRegistro,
          telefono: data.telefono,
          direccion: data.direccion,
          ciudad: data.ciudad
        }))
        setMensajeExito('Datos actualizados correctamente')
        setTimeout(() => setMensajeExito(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al actualizar los datos')
        setTimeout(() => setError(''), 3000)
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      setError('Error de conexión con el servidor')
      setTimeout(() => setError(''), 3000)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="formulario-edicion-cuenta">
      <h2>Mi cuenta</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="campo-edicion">
          <label>Email (no editable)</label>
          <input
            type="email"
            value={usuario?.email || ''}
            disabled
          />
        </div>

        <div className="campo-edicion">
          <label>Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!estaOnline || cargando}
            placeholder="Tu nombre"
          />
        </div>

        <div className="campo-edicion">
          <label>Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            disabled={!estaOnline || cargando}
            placeholder="Tu apellido"
          />
        </div>

        <div className="campo-edicion">
          <label>Teléfono</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            disabled={!estaOnline || cargando}
            placeholder="Número de teléfono"
          />
        </div>

        <div className="campo-edicion">
          <label>Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            disabled={!estaOnline || cargando}
            placeholder="Tu dirección"
          />
        </div>

        <div className="campo-edicion">
          <label>Ciudad</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            disabled={!estaOnline || cargando}
            placeholder="Tu ciudad"
          />
        </div>

        <div className="campo-edicion">
          <label>Fecha de registro</label>
          <input
            type="date"
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
            disabled={!estaOnline || cargando}
          />
        </div>

        {error && <div className="error-mensaje">{error}</div>}
        {mensajeExito && <div className="exito-mensaje">{mensajeExito}</div>}

        <button 
          type="submit" 
          className="btn-guardar"
          disabled={!estaOnline || cargando}
        >
          {cargando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}