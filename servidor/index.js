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

// SESIONES (express-session)
app.use(session({
  secret: 'tienda-secreta',
  resave: false,
  saveUninitialized: false,   // 🔥 IMPORTANTE
  cookie: {
    secure: false,
    httpOnly: false,
    sameSite: "lax"
  }
}))

// ======================
// CONEXIÓN MONGODB
// ======================
mongoose.connect('mongodb://127.0.0.1:27017/tienda')
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
    // 🔍 Buscar usuario en MongoDB
    const usuarioDB = await Usuario.findOne({ email })

    if (!usuarioDB) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // 🧠 Guardar en sesión
    req.session.email = usuarioDB.email
    req.session.rol = usuarioDB.rol

    if (!req.session.visitas) {
      req.session.visitas = 1
    }

    req.session.save(() => {
      res.json({
        email: req.session.email,
        rol: req.session.rol,
        visitas: req.session.visitas
      })
    })

  } catch (error) {
    res.status(500).json({ error: "Error en login" })
  }
})

// ======================
// PANEL USUARIO (VISITAS)
// ======================
app.get('/usuario', (req, res) => {
  console.log("COOKIE RECIBIDA:", req.headers.cookie)
  console.log("SESSION:", req.session)

  if (!req.session.email) {
    return res.status(401).json({ error: "No hay sesión activa" })
  }

  req.session.visitas++

  res.json({
    email: req.session.email,
    visitas: req.session.visitas
  })
})

// ======================
// SERVIDOR
// ======================
const PORT = 3001

app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
})