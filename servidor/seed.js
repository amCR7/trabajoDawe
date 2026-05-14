const mongoose = require("mongoose")
require("dotenv").config()

const Producto = require("./models/Producto")

const productos = [
  {
    nombre: 'Televisión Samsung 55"',
    precio: 599,
    descripcion: 'Smart TV 4K UHD con HDR',
    imagen: 'imagenes/TVSamsung.png',
    categoria: 'electrodomestico',
    extra: 'Garantía: 2 años',
    favorito: false
  },
  {
    nombre: 'Televisión LG 65"',
    precio: 899,
    descripcion: 'OLED 4K con inteligencia artificial',
    imagen: 'imagenes/LGTV.jpg',
    categoria: 'electrodomestico',
    extra: 'Garantía: 3 años',
    favorito: false
  },
  {
    nombre: 'Televisión Sony 50"',
    precio: 499,
    descripcion: 'LED 4K con Android TV',
    imagen: 'imagenes/SonyTV.jpg',
    categoria: 'electrodomestico',
    extra: 'Garantía: 2 años',
    favorito: false
  },
  {
    nombre: 'iPhone 15',
    precio: 999,
    descripcion: 'Smartphone de última generación',
    imagen: 'imagenes/iphone.jpg',
    categoria: 'smartphone',
    extra: 'Sistema: iOS',
    favorito: false
  },
  {
    nombre: 'Samsung Galaxy S24',
    precio: 899,
    descripcion: 'Pantalla AMOLED y cámara 108MP',
    imagen: 'imagenes/galaxy.jpg',
    categoria: 'smartphone',
    extra: 'Sistema: Android',
    favorito: false
  },
  {
    nombre: 'Apple Watch Series 9',
    precio: 449,
    descripcion: 'Smartwatch con GPS y monitor cardíaco',
    imagen: 'imagenes/SmartWatch.png',
    categoria: 'smartphone',
    extra: 'Sistema: watchOS',
    favorito: false
  },
  {
    nombre: 'Altavoz JBL Flip',
    precio: 129,
    descripcion: 'Altavoz Bluetooth resistente al agua',
    imagen: 'imagenes/AltavozJBL.png',
    categoria: 'audio',
    extra: 'Altavoz portátil',
    favorito: false
  },
  {
    nombre: 'Auriculares Sony WH-1000XM5',
    precio: 299,
    descripcion: 'Cancelación de ruido premium',
    imagen: 'imagenes/AuricularesSony.png',
    categoria: 'audio',
    extra: 'Auriculares inalámbricos',
    favorito: false
  },
  {
    nombre: 'Barra de sonido LG',
    precio: 199,
    descripcion: 'Sistema de sonido 2.1 con subwoofer',
    imagen: 'imagenes/Barra.jpg',
    categoria: 'audio',
    extra: 'Barra de sonido',
    favorito: false
  },
  {
    nombre: 'FC 26',
    precio: 70,
    descripcion: 'Simulador de fútbol realista',
    imagen: 'imagenes/FC26.png',
    categoria: 'videojuego',
    extra: 'Nintendo Switch 2',
    favorito: false
  },
  {
    nombre: 'Call of Duty Modern Warfare',
    precio: 75,
    descripcion: 'Shooter en primera persona',
    imagen: 'imagenes/CallOf.png',
    categoria: 'videojuego',
    extra: 'Xbox Series X',
    favorito: false
  },
  {
    nombre: 'God of War Ragnarok',
    precio: 69,
    descripcion: 'Aventura épica mitológica',
    imagen: 'imagenes/GODVideojuegoPS5.png',
    categoria: 'videojuego',
    extra: 'PS5',
    favorito: false
  },
  {
    nombre: 'Cargador USB-C 65W',
    precio: 29,
    descripcion: 'Carga rápida compatible con múltiples dispositivos',
    imagen: 'imagenes/CargadorRapido.png',
    categoria: 'accesorio',
    extra: 'USB-C',
    favorito: false
  },
  {
    nombre: 'Cable HDMI 2.1',
    precio: 19,
    descripcion: 'Compatible con 4K y 8K',
    imagen: 'imagenes/HDMI.jpg',
    categoria: 'accesorio',
    extra: 'Universal',
    favorito: false
  },
  {
    nombre: 'Base de carga DualSense',
    precio: 39,
    descripcion: 'Base de carga para mandos PS5',
    imagen: 'imagenes/BaseCarga.jpeg',
    categoria: 'accesorio',
    favorito: false
  }
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log("🟢 Conectado a MongoDB")

    await Producto.deleteMany()
    console.log("🧹 Colección productos limpiada")

    await Producto.insertMany(productos)
    console.log("📦 Productos insertados correctamente")

    process.exit()
  } catch (err) {
    console.error("❌ Error en seed:", err)
    process.exit(1)
  }
}

seed()