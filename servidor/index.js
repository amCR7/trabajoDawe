const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

//Middleware
app.use(cors())
app.use(express.json())

//Conexión MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tienda')
  .then(() => console.log('🟢 Conectado a MongoDB'))
  .catch(err => console.error('🔴 Error conexión MongoDB:', err))

//Rutas (las creas después)
app.use('/usuarios', require('./rutas/usuarios'))
app.use('/productos', require('./rutas/productos'))

//Servidor
const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`)
})