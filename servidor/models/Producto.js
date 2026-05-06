const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
  imagen: String,
  categoria: String,   // 🔥 mejor que "tipo"
  extra: String,
  favorito: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Producto', productoSchema)