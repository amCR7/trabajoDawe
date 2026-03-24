export const DIVISA = '€'
export const MAX_COPIAS = 20

export const productosIniciales = [
  {
    id: 1,
    nombre: 'Televisión Samsung 55"',
    precio: 599,
    descripcion: 'Smart TV 4K UHD con HDR',
    imagen: 'imagenes/TVSamsung.png',
    categoria: 'electrodomestico',
    extra: 'Garantía: 2 años',
    favorito: false
  },
  {
    id: 2,
    nombre: 'Televisión LG 65"',
    precio: 899,
    descripcion: 'OLED 4K con inteligencia artificial',
    imagen: 'imagenes/LGTV.jpg',
    categoria: 'electrodomestico',
    extra: 'Garantía: 3 años',
    favorito: false
  },
  {
    id: 3,
    nombre: 'Televisión Sony 50"',
    precio: 499,
    descripcion: 'LED 4K con Android TV',
    imagen: 'imagenes/SonyTV.jpg',
    categoria: 'electrodomestico',
    extra: 'Garantía: 2 años',
    favorito: false
  },
  {
    id: 4,
    nombre: 'iPhone 15',
    precio: 999,
    descripcion: 'Smartphone de última generación',
    imagen: 'imagenes/iphone.jpg',
    categoria: 'smartphone',
    extra: 'Sistema: iOS',
    favorito: false
  },
  {
    id: 5,
    nombre: 'Samsung Galaxy S24',
    precio: 899,
    descripcion: 'Pantalla AMOLED y cámara 108MP',
    imagen: 'imagenes/galaxy.jpg',
    categoria: 'smartphone',
    extra: 'Sistema: Android',
    favorito: false
  },
  {
    id: 6,
    nombre: 'Apple Watch Series 9',
    precio: 449,
    descripcion: 'Smartwatch con GPS y monitor cardíaco',
    imagen: 'imagenes/SmartWatch.png',
    categoria: 'smartphone',
    extra: 'Sistema: watchOS',
    favorito: false
  },
  {
    id: 7,
    nombre: 'Altavoz JBL Flip',
    precio: 129,
    descripcion: 'Altavoz Bluetooth resistente al agua',
    imagen: 'imagenes/AltavozJBL.png',
    categoria: 'audio',
    extra: 'Tipo: Altavoz portátil',
    favorito: false
  },
  {
    id: 8,
    nombre: 'Auriculares Sony WH-1000XM5',
    precio: 299,
    descripcion: 'Cancelación de ruido premium',
    imagen: 'imagenes/AuricularesSony.png',
    categoria: 'audio',
    extra: 'Tipo: Auriculares inalámbricos',
    favorito: false
  },
  {
    id: 9,
    nombre: 'Barra de sonido LG',
    precio: 199,
    descripcion: 'Sistema de sonido 2.1 con subwoofer',
    imagen: 'imagenes/Barra.jpg',
    categoria: 'audio',
    extra: 'Tipo: Barra de sonido',
    favorito: false
  },
  {
    id: 10,
    nombre: 'FC 26',
    precio: 70,
    descripcion: 'Simulador de fútbol realista',
    imagen: 'imagenes/FC26.png',
    categoria: 'videojuego',
    extra: 'Generación: Nintendo Switch 2',
    favorito: false
  },
  {
    id: 11,
    nombre: 'Call of Duty Modern Warfare',
    precio: 75,
    descripcion: 'Shooter en primera persona',
    imagen: 'imagenes/CallOf.png',
    categoria: 'videojuego',
    extra: 'Generación: Xbox Series X',
    favorito: false
  },
  {
    id: 12,
    nombre: 'God of War Ragnarok',
    precio: 69,
    descripcion: 'Aventura épica mitológica',
    imagen: 'imagenes/GODVideojuegoPS5.png',
    categoria: 'videojuego',
    extra: 'Generación: PS5',
    favorito: false
  },
  {
    id: 13,
    nombre: 'Cargador USB-C 65W',
    precio: 29,
    descripcion: 'Carga rápida compatible con múltiples dispositivos',
    imagen: 'imagenes/CargadorRapido.png',
    categoria: 'accesorio',
    extra: 'Compatibilidad: USB-C',
    favorito: false
  },
  {
    id: 14,
    nombre: 'Cable HDMI 2.1',
    precio: 19,
    descripcion: 'Compatible con 4K y 8K',
    imagen: 'imagenes/HDMI.jpg',
    categoria: 'accesorio',
    extra: 'Compatibilidad: Universal',
    favorito: false
  },
  {
    id: 15,
    nombre: 'Base de carga DualSense',
    precio: 39,
    descripcion: 'Base de carga para mandos PS5',
    imagen: 'imagenes/BaseCarga.jpeg',
    categoria: 'accesorio',
    extra: 'Compatibilidad: PS5',
    favorito: false
  }
]

const STORAGE_KEY = 'tecnomania_carrito'

export function cargarCarrito() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (!guardado) return []

    const carritoParseado = JSON.parse(guardado)
    if (!Array.isArray(carritoParseado)) return []

    return carritoParseado
  } catch (error) {
    console.error('Error al cargar el carrito:', error)
    return []
  }
}

export function guardarCarritoCompleto(carrito) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito))
}

export function getTotalCarrito(carrito) {
  return carrito.reduce((total, item) => {
    return total + item.precio * item.cantidad
  }, 0)
}

export function getCantidadProductoEnCarrito(carrito, idProducto) {
  const item = carrito.find((producto) => producto.id === idProducto)
  return item ? item.cantidad : 0
}

export function obtenerCategoriaProducto(producto) {
  const nombreClase = producto.constructor?.name || ''
  
  switch (nombreClase) {
    case 'ProductoElectrodomestico':
      return 'electrodomestico'
    case 'ProductoSmartphone':
      return 'smartphone'
    case 'ProductoAudio':
      return 'audio'
    case 'ProductoAccesorio':
      return 'accesorio'
    case 'ProductoVideojuego':
      return 'videojuego'
    default:
      return 'general'
  }
}

// Función para obtener todas las categorías únicas
export function obtenerCategoriasUnicas(productos) {
  const categorias = new Set()
  productos.forEach(prod => {
    categorias.add(obtenerCategoriaProducto(prod))
  })
  return Array.from(categorias).sort()
}