const mongoose = require("mongoose")
require("dotenv").config()

const Usuario = require("./models/Usuario")

const usuarios = [
  {
    nombre: "Eneko",
    apellido: "Agirre",
    email: "eneko@gmail.com",
    rol: "admin",
    fechaRegistro: '2026-05-04',
    calle: 'Gran Vía'
  }
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)

  await Usuario.deleteMany()
  await Usuario.insertMany(usuarios)

  console.log("Usuarios insertados")
  process.exit()
}

seed()