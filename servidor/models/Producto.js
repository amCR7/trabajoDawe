const mongoose = require('mongoose')

const productoSchema = new mongoose.Schema({
  tipo: String,
  nombre: String,
  precio: Number,
  descripcion: String,
  extra: String,
  imagen: String
})

module.exports = mongoose.model('Producto', productoSchema)