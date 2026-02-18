import {
  ProductoElectrodomestico,
  ProductoSmartphone,
  ProductoAudio,
  ProductoAccesorio,
  ProductoVideojuego
} from "./productosPersonalizables.js";

// ===============================
// ARRAY DE PRODUCTOS DE LA TIENDA
// ===============================

export const productosTienda = [
 
  new ProductoElectrodomestico(
    1,
    'Televisión Samsung 55"',
    599,
    "Smart TV 4K UHD con HDR",
    "imagenes/TVSamsung.png",
    2
  ),
  new ProductoElectrodomestico(
    2,
    'Televisión LG 65"',
    899,
    "OLED 4K con inteligencia artificial",
    "imagenes/LGTV.jpg",
    3
  ),
  new ProductoElectrodomestico(
    3,
    'Televisión Sony 50"',
    499,
    "LED 4K con Android TV",
    "imagenes/SonyTV.jpg",
    2
  ),

  new ProductoSmartphone(
    4,
    "iPhone 15",
    999,
    "Smartphone de última generación",
    "imagenes/iphone.jpg",
    "iOS"
  ),
  new ProductoSmartphone(
    5,
    "Samsung Galaxy S24",
    899,
    "Pantalla AMOLED y cámara 108MP",
    "imagenes/galaxy.jpg",
    "Android"
  ),
  new ProductoSmartphone(
    6,
    "Apple Watch Series 9",
    449,
    "Smartwatch con GPS y monitor cardíaco",
    "imagenes/SmartWatch.png",
    "watchOS"
  ),


  new ProductoAudio(
    7,
    "Altavoz JBL Flip",
    129,
    "Altavoz Bluetooth resistente al agua",
    "imagenes/AltavozJBL.png",
    "Altavoz portátil"
  ),
  new ProductoAudio(
    8,
    "Auriculares Sony WH-1000XM5",
    299,
    "Cancelación de ruido premium",
    "imagenes/AuricularesSony.png",
    "Auriculares inalámbricos"
  ),
  new ProductoAudio(
    9,
    "Barra de sonido LG",
    199,
    "Sistema de sonido 2.1 con subwoofer",
    "imagenes/Barra.jpg",
    "Barra de sonido"
  ),


  new ProductoVideojuego(
    10,
    "FC 26",
    70,
    "Simulador de fútbol realista",
    "imagenes/FC26.png",
    "Nintendo Switch 2"
  ),
  new ProductoVideojuego(
    11,
    "Call of Duty Modern Warfare",
    75,
    "Shooter en primera persona",
    "imagenes/CallOf.png",
    "Xbox Series X"
  ),
  new ProductoVideojuego(
    12,
    "God of War Ragnarok",
    69,
    "Aventura épica mitológica",
    "imagenes/GODVideojuegoPS5.png",
    "PS5"
  ),


  new ProductoAccesorio(
    13,
    "Cargador USB-C 65W",
    29,
    "Carga rápida compatible con múltiples dispositivos",
    "imagenes/CargadorRapido.png",
    "USB-C"
  ),
  new ProductoAccesorio(
    14,
    "Cable HDMI 2.1",
    19,
    "Compatible con 4K y 8K",
    "imagenes/HDMI.jpg",
    "Universal"
  ),
  new ProductoAccesorio(
    15,
    "Base de carga DualSense",
    39,
    "Base de carga para mandos PS5",
    "imagenes/BaseCarga.jpeg",
    "PS5"
  )
];



export const carrito = new Map();

export const MAX_COPIAS = 20;



// Devuelve el item del carrito por id
export function getItemCarrito(idProducto) {
  return carrito.get(idProducto);
}

// Añade 1 unidad de un producto al carrito
// - Si no existe: lo crea con cantidad 1
// - Si existe: incrementa, sin pasar de MAX_COPIAS
export function addToCarrito(producto) {
  const id = producto.id;

  const existente = carrito.get(id);
  if (!existente) {
    carrito.set(id, {
      id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
    return { ok: true, cantidad: 1 };
  }

  if (existente.cantidad >= MAX_COPIAS) {
    // no permite 21
    existente.cantidad = MAX_COPIAS;
    carrito.set(id, existente);
    return { ok: false, cantidad: MAX_COPIAS };
  }

  existente.cantidad += 1;
  carrito.set(id, existente);
  return { ok: true, cantidad: existente.cantidad };
}


export function setCantidadCarrito(idProducto, nuevaCantidad) {
  const item = carrito.get(idProducto);
  if (!item) return { action: "deleted", cantidad: 0 };

  let n = parseInt(nuevaCantidad, 10);
  if (Number.isNaN(n)) n = 0;

  if (n <= 0) {
    carrito.delete(idProducto);
    return { action: "deleted", cantidad: 0 };
  }

  if (n > MAX_COPIAS) {
    // no se deja pasar de 20 -> se queda en 20
    item.cantidad = MAX_COPIAS;
    carrito.set(idProducto, item);
    return { action: "max_clamped", cantidad: MAX_COPIAS };
  }

  item.cantidad = n;
  carrito.set(idProducto, item);
  return { action: "updated", cantidad: n };
}

// Elimina un producto del carrito
export function removeFromCarrito(idProducto) {
  carrito.delete(idProducto);
}

// Vacía todo el carrito
export function clearCarrito() {
  carrito.clear();
}

// Total del carrito (sumatorio precio*cantidad)
export function getTotalCarrito() {
  let total = 0;
  for (const item of carrito.values()) {
    total += item.precio * item.cantidad;
  }
  return total;
}


export function getItemsCarrito() {
  return Array.from(carrito.values());
}

// Cantidad actual de un producto en el carrito (0 si no existe)
export function getCantidadCarrito(idProducto) {
  return carrito.get(idProducto)?.cantidad ?? 0;
}
