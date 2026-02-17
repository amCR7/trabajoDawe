// Importamos las clases
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

    // 🔹 3 Electrodomésticos (Televisiones)
    new ProductoElectrodomestico(
        1,
        "Televisión Samsung 55\"",
        599,
        "Smart TV 4K UHD con HDR",
        "imagenes/TVSamsung.png",
        2
    ),

    new ProductoElectrodomestico(
        2,
        "Televisión LG 65\"",
        899,
        "OLED 4K con inteligencia artificial",
        "imagenes/LGTV.jpg",
        3
    ),

    new ProductoElectrodomestico(
        3,
        "Televisión Sony 50\"",
        499,
        "LED 4K con Android TV",
        "imagenes/SonyTV.jpg",
        2
    ),


    // 🔹 3 Smartphones / Smartwatch
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


    // 🔹 3 Productos de Audio
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


    // 🔹 3 Videojuegos (Nueva clase)
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


    // 🔹 3 Accesorios
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


// ===============================
// ARRAY DEL CARRITO (VACÍO)
// ===============================

export const carrito = [];
