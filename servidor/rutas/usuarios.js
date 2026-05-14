const express = require('express')
const router = express.Router()
const Usuario = require('../models/Usuario')

// GET todos usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find()
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET usuario actual
router.get('/actual', async (req, res) => {
  try {
    if (!req.session.email) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const usuario = await Usuario.findOne({ email: req.session.email })
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({
      email: usuario.email,
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      rol: usuario.rol || 'usuario',
      fechaRegistro: usuario.fechaRegistro || '',
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || '',
      ciudad: usuario.ciudad || '',
      visitas: req.session.visitas || 1
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT actualizar datos del usuario autenticado
router.put('/actualizar', async (req, res) => {
  console.log('=== PUT /actualizar ===')
  console.log('Session email:', req.session?.email)
  console.log('Body:', req.body)

  try {
    if (!req.session.email) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const { email, nombre, apellido, fechaRegistro, telefono, direccion, ciudad } = req.body

    if (req.session.email !== email) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre no puede estar vacío' })
    }

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { email: email },
      {
        nombre: nombre.trim(),
        apellido: apellido || '',
        fechaRegistro: fechaRegistro || '',
        telefono: telefono || '',
        direccion: direccion || '',
        ciudad: ciudad || ''
      },
      { new: true }
    )

    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    console.log('✅ Usuario actualizado:', usuarioActualizado)

    res.json({
      nombre: usuarioActualizado.nombre,
      apellido: usuarioActualizado.apellido,
      fechaRegistro: usuarioActualizado.fechaRegistro,
      telefono: usuarioActualizado.telefono,
      direccion: usuarioActualizado.direccion,
      ciudad: usuarioActualizado.ciudad
    })

  } catch (error) {
    console.error('Error actualizando usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router