require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')

const app = express()

// ======================
// MIDDLEWARE
// ======================
// CORS (IMPORTANTE para React + cookies)
app.use(cors({
  origin: "http://localhost:5173", // cambia si tu React usa otro puerto
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// SESIONES (express-session)
app.use(session({
  secret: 'tienda-secreta',
  resave: false,
  saveUninitialized: true,   // 🔥 IMPORTANTE
  cookie: {
    secure: false,
    httpOnly: false,
    sameSite: "lax"
  }
}))

// ======================
// CONEXIÓN MONGODB
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error conexión MongoDB:', err))

// ======================
// RUTAS (archivos externos)
// ======================
app.use('/usuarios', require('./rutas/usuarios'))
app.use('/productos', require('./rutas/productos'))

// ======================
// LOGIN (CREAR SESIÓN)
// ======================
const Usuario = require('./models/Usuario') // 👈 importante

app.post('/login', async (req, res) => {
  const { email } = req.body

  try {
    const usuarioDB = await Usuario.findOne({ email })

    if (!usuarioDB) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // 🧠 Guardar sesión completa
    req.session.email = usuarioDB.email
    req.session.nombre = usuarioDB.nombre
    req.session.apellido = usuarioDB.apellido
    req.session.rol = usuarioDB.rol

    // 🔥 NO reiniciar siempre a 1
    req.session.visitas = 1
  

    req.session.save(() => {
      res.json({
        email: usuarioDB.email,
        nombre: usuarioDB.nombre,
        apellido: usuarioDB.apellido,
        rol: usuarioDB.rol,
        visitas: req.session.visitas
      })
    })

  } catch (error) {
    res.status(500).json({ error: "Error en login" })
  }
})

// ======================
// PANEL USUARIO (LECTURA)
// ======================
app.get('/usuario', async (req, res) => {

  if (!req.session.email) {
    return res.status(401).json({
      error: "No hay sesión activa"
    })
  }

  try {

    const usuarioDB = await Usuario.findOne({
      email: req.session.email
    })

    if (!usuarioDB) {
      return res.status(404).json({
        error: "Usuario no encontrado"
      })
    }

    const ahora = Date.now()

    if (!req.session.lastAccess || ahora - req.session.lastAccess > 500) {
      req.session.visitas = (req.session.visitas || 1) + 1
      req.session.lastAccess = ahora
    }

    res.json({
      email: usuarioDB.email,
      nombre: usuarioDB.nombre,
      apellido: usuarioDB.apellido,
      rol: usuarioDB.rol,
      fechaRegistro: usuarioDB.fechaRegistro,
      telefono: usuarioDB.telefono,
      direccion: usuarioDB.direccion,
      ciudad: usuarioDB.ciudad,
      visitas: req.session.visitas
    })

  } catch (error) {

    res.status(500).json({
      error: "Error obteniendo usuario"
    })

  }
})

app.put('/usuario', async (req, res) => {
  try {

    if (!req.session.email) {
      return res.status(401).json({
        error: "No autenticado"
      })
    }

    const { nombre, apellido } = req.body

    await Usuario.findOneAndUpdate(
      { email: req.session.email },
      {
        nombre,
        apellido
      }
    )

    const usuarioActualizado = await Usuario.findOne({
      email: req.session.email
    })

    req.session.nombre = usuarioActualizado.nombre
    req.session.apellido = usuarioActualizado.apellido

    res.json({
      email: usuarioActualizado.email,
      nombre: usuarioActualizado.nombre,
      apellido: usuarioActualizado.apellido,
      rol: usuarioActualizado.rol
    })

  } catch (error) {
    res.status(500).json({
      error: "Error actualizando usuario"
    })
  }
})

// ======================
// LOGOUT (CERRAR SESIÓN)
// ======================
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.json({ message: "Sesión cerrada" })
  })
})

// ======================
// CREAR PRODUCTO
// ======================
const Producto = require('./models/Producto')

app.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body)
    const guardado = await nuevoProducto.save()

    res.json(guardado)
  } catch (error) {
    res.status(500).json({ error: "Error creando producto" })
  }
})

app.get('/debug-session', (req, res) => {
  res.json(req.session)
})

// ======================
// SERVIDOR
// ======================
const PORT = 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
})