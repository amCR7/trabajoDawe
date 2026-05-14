const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  rol: String,
  visitas: Number,
  fechaRegistro: String,
  telefono: String,    
  direccion: String,   
  ciudad: String       
})

module.exports = mongoose.model('Usuario', usuarioSchema)