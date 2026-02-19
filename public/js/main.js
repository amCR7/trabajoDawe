import { Producto } from './producto.js';
import { productosTienda } from "./tienda.js";

// IMPORTAR LAS CLASES DE PRODUCTOS PERSONALIZABLES
import {
    ProductoElectrodomestico,
    ProductoSmartphone,
    ProductoAudio,
    ProductoAccesorio,
    ProductoVideojuego
} from "./productosPersonalizables.js";

// IMPORTAR FUNCIONES DEL CARRITO DESDE TIENDA.JS
import {
    carrito,
    MAX_COPIAS,
    addToCarrito,
    setCantidadCarrito,
    getItemsCarrito,
    getTotalCarrito,
    getCantidadCarrito
} from "./tienda.js";

// ====================================================
// CONSTANTES GLOBALES
// ====================================================
const PRODUCTOS_POR_PAGINA = 6;
let paginaActual = 1;
//let carrito = [];
let favoritos = [];
let productosFiltrados = [...productosTienda]; // GLOBAL
let mostrandoVistaFavoritos = false; // GLOBAL
//const MAX_COPIAS = 20;

// --------------------
// FORMULARIO AÑADIR PRODUCTO
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  // ====================================================
  // 1. OBTENER REFERENCIAS A ELEMENTOS DEL DOM
  // ====================================================
  const selectTipo = document.getElementById("tipo-producto");
  const campoExtraContainer = document.getElementById("campo-extra-container");
  const formulario = document.getElementById("formulario-producto");
  const mensajeFormulario = document.getElementById("mensaje-formulario");
  const fileInput = document.getElementById("archivo-imagen");
  const dragDropArea = document.getElementById("drag-drop-area");
  const gridProductos = document.getElementById("grid-productos");
  const inputBuscador = document.getElementById("buscador");

  if (!selectTipo || !campoExtraContainer || !formulario || !mensajeFormulario || !fileInput || !dragDropArea || !gridProductos) return;

  // ====================================================
  // 2. CONSTANTES
  // ====================================================
  const IMAGEN_DEFECTO = "imagenes/default-product.png";

  // ====================================================
  // 3. CONFIGURACIÓN DE CAMPOS EXTRA POR TIPO
  // ====================================================
  const camposExtra = {
    televisor: {
      label: "Años de garantía",
      type: "number",
      placeholder: "Ej: 2",
      required: true,
      min: 1,
      step: 1
    },
    smartphone: {
      label: "Sistema Operativo",
      type: "text",
      placeholder: "Ej: Android 14, iOS 17",
      required: true
    },
    audio: {
      label: "Tipo de audio",
      type: "text",
      placeholder: "Ej: Altavoz portátil, Auriculares",
      required: true
    },
    accesorio: {
      label: "Compatibilidad",
      type: "text",
      placeholder: "Ej: USB-C, Universal, PS5",
      required: true
    },
    videojuego: {
      label: "Plataforma/Generación",
      type: "text",
      placeholder: "Ej: PS5, Xbox Series X, Nintendo Switch",
      required: true
    }
  };

  // ====================================================
  // 4. VARIABLES GLOBALES DEL FORMULARIO
  // ====================================================
  let campoExtraActual = null;

  // ====================================================
  // 5. FUNCIÓN PARA LIMPIAR ARCHIVO SELECCIONADO
  // ====================================================
  function limpiarArchivoSeleccionado() {
    const dt = new DataTransfer();
    fileInput.files = dt.files;
    fileInput.value = "";
    dragDropArea.innerHTML = `<p class="m-0">Arrastra una imagen aquí o haz clic</p>`;
    dragDropArea.classList.remove("added", "preview", "drag-over");
  }

  // Limpiar al cargar
  limpiarArchivoSeleccionado();

  // ====================================================
  // 6. FUNCIÓN PARA ACTUALIZAR CAMPO EXTRA SEGÚN TIPO
  // ====================================================
  function actualizarCampoExtra() {
    const tipoSeleccionado = selectTipo.value;
    
    campoExtraContainer.innerHTML = "";
    campoExtraActual = null;

    if (!tipoSeleccionado) return;

    const config = camposExtra[tipoSeleccionado];
    if (!config) return;

    const div = document.createElement("div");
    div.className = "mb-3";
    div.id = "campo-extra-dinamico";
    
    const label = document.createElement("label");
    label.htmlFor = "campo-extra-input";
    label.className = "form-label";
    label.textContent = config.label;
    
    const input = document.createElement("input");
    input.type = config.type;
    input.className = "form-control";
    input.id = "campo-extra-input";
    input.name = "campoExtra";
    input.placeholder = config.placeholder || "";
    if (config.min) input.min = config.min;
    if (config.step) input.step = config.step;
    if (config.required) input.required = true;
    
    div.appendChild(label);
    div.appendChild(input);
    campoExtraContainer.appendChild(div);
    
    campoExtraActual = input;
  }

  selectTipo.addEventListener("change", actualizarCampoExtra);

  // ====================================================
  // 7. FUNCIONES PARA MENSAJES
  // ====================================================
  function mostrarMensajeError(texto, duracion = 2000) {
    mensajeFormulario.innerHTML = `<div class="alert alert-danger py-1 px-2 mb-0">❌ ${texto}</div>`;
    setTimeout(() => {
      mensajeFormulario.innerHTML = "";
    }, duracion);
  }

  function mostrarMensajeExito(texto, duracion = 2000) {
    mensajeFormulario.innerHTML = `<div class="alert alert-success py-1 px-2 mb-0">✅ ${texto}</div>`;
    setTimeout(() => {
      mensajeFormulario.innerHTML = "";
    }, duracion);
  }

  // ====================================================
  // 8. VALIDACIÓN DE ARCHIVOS
  // ====================================================
  function validarArchivo(file) {
    if (!file) return { valido: false, error: "No se ha seleccionado ningún archivo" };
    
    const extension = file.name.split('.').pop().toLowerCase();
    const tipoMIME = file.type.toLowerCase();
    
    const extensionesPermitidas = ['jpg', 'jpeg', 'png'];
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!extensionesPermitidas.includes(extension)) {
        return { 
            valido: false, 
            error: `Solo se permiten archivos JPG/JPEG o PNG (extensión .${extension} no válida)` 
        };
    }
    
    if (!tiposPermitidos.includes(tipoMIME)) {
        return { 
            valido: false, 
            error: `Tipo de archivo no válido: ${tipoMIME || 'desconocido'}. Solo JPG/JPEG o PNG` 
        };
    }
    
    return { valido: true };
  }

  // ====================================================
  // 9. DRAG & DROP HANDLER
  // ====================================================
  const dropHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragDropArea.classList.remove("drag-over");

    const files = e.dataTransfer.files;
    
    if (files.length > 1) {
        mostrarMensajeError("Solo se permite subir un archivo");
        e.dataTransfer.clearData();
        limpiarArchivoSeleccionado();
        return;
    }
    
    const file = files[0];
    if (!file) return;
    
    console.log("Archivo:", file.name, "Tipo:", file.type);
    
    const validacion = validarArchivo(file);
    if (!validacion.valido) {
        mostrarMensajeError(validacion.error);
        e.dataTransfer.clearData();
        limpiarArchivoSeleccionado();
        return;
    }
    
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;

    const reader = new FileReader();
    reader.onload = function (e) {
        dragDropArea.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "150px";
        img.style.objectFit = "contain";
        dragDropArea.appendChild(img);
        dragDropArea.classList.add("added", "preview");
    };
    reader.readAsDataURL(file);
  };

  // ====================================================
  // 10. EVENTO CHANGE DEL FILE INPUT
  // ====================================================
  const changeHandler = function() {
    console.log("Files seleccionados:", this.files.length);
    
    if (this.files.length > 1) {
        mostrarMensajeError("Solo se permite subir un archivo");
        limpiarArchivoSeleccionado();
        return;
    }
    
    const file = this.files[0];
    if (!file) return;
    
    console.log("Archivo seleccionado:", file.name, "Tipo:", file.type, "Tamaño:", file.size);
    
    const validacion = validarArchivo(file);
    if (!validacion.valido) {
        mostrarMensajeError(validacion.error);
        limpiarArchivoSeleccionado();
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function (e) {
        dragDropArea.innerHTML = "";
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%";
        img.style.maxHeight = "150px";
        img.style.objectFit = "contain";
        dragDropArea.appendChild(img);
        dragDropArea.classList.add("added", "preview");
    };
    reader.onerror = function() {
        mostrarMensajeError("Error al leer el archivo");
        limpiarArchivoSeleccionado();
    };
    reader.readAsDataURL(file);
  };

  fileInput.addEventListener("change", changeHandler);

  // ====================================================
  // 11. ACTIVAR DRAG & DROP
  // ====================================================
  dragDropArea.addEventListener("click", () => {
    fileInput.click();
  });

  dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("drag-over");
  });

  dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.classList.remove("drag-over");
  });

  dragDropArea.addEventListener("drop", dropHandler);

  // ====================================================
  // 12. FUNCIÓN PARA RESETEAR DRAG & DROP
  // ====================================================
  function resetDragDrop() {
    dragDropArea.innerHTML = `<p class="m-0">Arrastra una imagen aquí o haz clic</p>`;
    dragDropArea.classList.remove("added", "preview", "drag-over");
    limpiarArchivoSeleccionado();
  }

  // ====================================================
  // 13. FUNCIÓN PARA CREAR INSTANCIA
  // ====================================================
  function crearInstanciaProducto(tipo, nombre, precio, descripcion, imagen, valorExtra) {
    const nextId = productosTienda.length + 1;
    
    switch(tipo) {
      case "televisor":
        return new ProductoElectrodomestico(
          nextId, 
          nombre, 
          parseFloat(precio), 
          descripcion, 
          imagen, 
          parseInt(valorExtra) || 2
        );
      case "smartphone":
        return new ProductoSmartphone(
          nextId, 
          nombre, 
          parseFloat(precio), 
          descripcion, 
          imagen, 
          valorExtra
        );
      case "audio":
        return new ProductoAudio(
          nextId, 
          nombre, 
          parseFloat(precio), 
          descripcion, 
          imagen, 
          valorExtra
        );
      case "accesorio":
        return new ProductoAccesorio(
          nextId, 
          nombre, 
          parseFloat(precio), 
          descripcion, 
          imagen, 
          valorExtra
        );
      case "videojuego":
        return new ProductoVideojuego(
          nextId, 
          nombre, 
          parseFloat(precio), 
          descripcion, 
          imagen, 
          valorExtra
        );
      default:
        return new Producto(
          nextId, 
          nombre, 
          parseFloat(precio), 
          descripcion, 
          imagen
        );
    }
  }

  // ====================================================
  // 14. FUNCIÓN PARA AÑADIR PRODUCTO Y ACTUALIZAR
  // ====================================================
  function añadirProductoATienda(nuevoProducto) {
    productosTienda.push(nuevoProducto);
    
    if (inputBuscador) {
      inputBuscador.dispatchEvent(new Event('input'));
    }
    
    console.log("Producto añadido:", nuevoProducto);
  }

  // ====================================================
  // 15. EVENTO SUBMIT DEL FORMULARIO
  // ====================================================
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!selectTipo.value) {
      mostrarMensajeError("Debes seleccionar un tipo de producto");
      selectTipo.focus();
      return;
    }
    
    const nombre = document.getElementById("nombre-producto");
    const precio = document.getElementById("precio-producto");
    const descripcion = document.getElementById("descripcion-producto");
    
    if (!nombre.value.trim()) {
      mostrarMensajeError("El nombre es obligatorio");
      nombre.focus();
      return;
    }
    
    if (!precio.value || parseFloat(precio.value) <= 0) {
      mostrarMensajeError("El precio debe ser un número positivo");
      precio.focus();
      return;
    }
    
    if (campoExtraActual && campoExtraActual.required) {
      if (!campoExtraActual.value.trim()) {
        mostrarMensajeError(`El campo ${camposExtra[selectTipo.value].label} es obligatorio`);
        campoExtraActual.focus();
        return;
      }
      
      if (selectTipo.value === "televisor") {
        const garantia = parseInt(campoExtraActual.value);
        if (isNaN(garantia) || garantia <= 0) {
          mostrarMensajeError("La garantía debe ser un número positivo");
          campoExtraActual.focus();
          return;
        }
      }
    }
    
    let imagenSrc = IMAGEN_DEFECTO;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      imagenSrc = URL.createObjectURL(file);
    }
    
    const valorExtra = campoExtraActual ? campoExtraActual.value.trim() : "";
    
    const nuevoProducto = crearInstanciaProducto(
      selectTipo.value,
      nombre.value.trim(),
      precio.value,
      descripcion.value.trim() || "Sin descripción",
      imagenSrc,
      valorExtra
    );
    
    añadirProductoATienda(nuevoProducto);
    mostrarMensajeExito("Producto añadido correctamente");
    
    formulario.reset();
    resetDragDrop();
    actualizarCampoExtra();
    
    if (fileInput.files.length > 0 && imagenSrc !== IMAGEN_DEFECTO) {
      URL.revokeObjectURL(imagenSrc);
    }
  });
});

// --------------------
// FUNCIONES DEL CARRITO
// --------------------

function mostrarMensajeCarrito(card, texto) {
  const existente = card.querySelector(".mensaje-carrito");
  if (existente) existente.remove();

  const msg = document.createElement("div");
  msg.className = "mensaje-carrito";
  msg.textContent = texto;
  card.appendChild(msg);

  setTimeout(() => msg.remove(), 1500);
}

function mostrarAvisoBajoInput(lineaProductoDiv, texto) {
  const slot = lineaProductoDiv.querySelector(".aviso-slot");
  if (!slot) return;

  slot.innerHTML = "";

  const msg = document.createElement("div");
  msg.className = "aviso-max-copias";
  msg.textContent = texto;

  msg.style.background = "#f8d7da";
  msg.style.border = "1px solid #f5c2c7";
  msg.style.color = "#842029";
  msg.style.padding = "10px 12px";
  msg.style.borderRadius = "6px";
  msg.style.marginTop = "10px";
  msg.style.fontSize = "0.9rem";
  msg.style.fontWeight = "600";

  slot.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}

function actualizarTotalCarrito() {
  const carritoTotal = document.getElementById("carrito-total");
  if (!carritoTotal) return;

  if (carrito.size === 0) {
    carritoTotal.innerHTML = "";
    return;
  }

  const total = getTotalCarrito();
  carritoTotal.innerHTML = `<h5>Total: ${total.toFixed(2)} €</h5>`;
}

function actualizarBotonAddCatalogo(idProducto, deshabilitar) {
  const idStr = String(idProducto);
  const cardOriginal = document.querySelector(`.card[data-pid="${idStr}"]`);
  if (!cardOriginal) return;

  const btn = cardOriginal.querySelector(".btn-add-carrito");
  if (!btn) return;

  btn.disabled = !!deshabilitar;
}

function agregarAlCarrito(producto) {
  const res = addToCarrito(producto);
  const cantidad = getCantidadCarrito(producto.id);
  actualizarBotonAddCatalogo(producto.id, cantidad >= MAX_COPIAS);
  mostrarCarrito();
}

function mostrarCarrito() {
  const carritoProductos = document.getElementById("carrito-productos");
  if (!carritoProductos) return;

  carritoProductos.innerHTML = "";
  const items = getItemsCarrito();

  items.forEach((item) => {
    const cantidadInicial = item.cantidad ?? 1;

    const divProducto = document.createElement("div");
    divProducto.className = "d-flex align-items-start mb-3";

    divProducto.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" class="img-fluid" style="width: 50px; height: 50px; margin-right: 10px;">
      <div class="flex-fill">
        <div><strong>${item.nombre}</strong></div>
        <div>${item.precio} €</div>
        <input type="number"
          class="form-control cantidad"
          value="${cantidadInicial}"
          min="0" max="${MAX_COPIAS}"
        >
        <div class="aviso-slot"></div>
        <div class="precio-total mt-1">
          Total: ${(item.precio * cantidadInicial).toFixed(2)} €
        </div>
      </div>
    `;

    const input = divProducto.querySelector("input.cantidad");
    const totalLineaDiv = divProducto.querySelector(".precio-total");

    function detectarClickSpinnerSubir(e) {
      const rect = input.getBoundingClientRect();
      const clickEnZonaSpinner = e.clientX > rect.right - 30;
      if (!clickEnZonaSpinner) return;

      const clickEnParteSuperior = e.clientY < (rect.top + rect.height / 2);
      if (!clickEnParteSuperior) return;

      const actual = parseInt(input.value, 10);
      if (Number.isFinite(actual) && actual >= MAX_COPIAS) {
        e.preventDefault();
        mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
      }
    }
    input.addEventListener("pointerdown", detectarClickSpinnerSubir);

    function detectarClickSpinnerBajar(e) {
      const rect = input.getBoundingClientRect();
      const clickEnZonaSpinner = e.clientX > rect.right - 30;
      if (!clickEnZonaSpinner) return;

      const clickEnParteInferior = e.clientY >= (rect.top + rect.height / 2);
      if (!clickEnParteInferior) return;

      const actual = parseInt(input.value, 10);
      if (Number.isFinite(actual) && actual === 1) {
        e.preventDefault();
        setCantidadCarrito(item.id, 0);
        actualizarBotonAddCatalogo(item.id, false);
        mostrarCarrito();
      }
    }
    input.addEventListener("pointerdown", detectarClickSpinnerBajar);

    function actualizarCantidadDesdeInput() {
      const valorEscrito = parseInt(input.value, 10);
      if (Number.isNaN(valorEscrito)) return;

      const res = setCantidadCarrito(item.id, valorEscrito);

      if (res.action === "deleted") {
        actualizarBotonAddCatalogo(item.id, false);
        mostrarCarrito();
        return;
      }

      if (res.action === "max_clamped") {
        mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
      }

      input.value = res.cantidad;
      totalLineaDiv.textContent = `Total: ${(item.precio * res.cantidad).toFixed(2)} €`;
      actualizarBotonAddCatalogo(item.id, res.cantidad >= MAX_COPIAS);
      actualizarTotalCarrito();
    }

    input.addEventListener("input", actualizarCantidadDesdeInput);
    input.addEventListener("change", actualizarCantidadDesdeInput);

    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        const actual = parseInt(input.value, 10);
        if (Number.isFinite(actual) && actual >= MAX_COPIAS) {
          e.preventDefault();
          mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
        }
      }

      if (e.key === "ArrowDown") {
        const actual = parseInt(input.value, 10);
        if (Number.isFinite(actual) && actual === 1) {
          e.preventDefault();
          setCantidadCarrito(item.id, 0);
          actualizarBotonAddCatalogo(item.id, false);
          mostrarCarrito();
        }
      }
    });

    carritoProductos.appendChild(divProducto);
  });

  actualizarTotalCarrito();
}

// --------------------
// CLICK AÑADIR AL CARRITO
// --------------------
document.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn-add-carrito");
  if (!boton) return;

  const card = boton.closest(".card");
  if (!card) return;

  const nombreProducto = card.querySelector(".card-title")?.textContent?.trim() || "";
  const precioProducto = parseFloat(
    (card.querySelector(".fw-bold")?.textContent || "0").replace(" €", "")
  );
  const descripcionProducto = card.querySelector(".card-text")?.textContent || "Descripción no disponible";
  const imagenProducto = card.querySelector(".card-img-top")?.src || "";

  //id no aleatorio
  //if (!card.dataset.pid) {
  //  card.dataset.pid = nombreProducto
    //  .toLowerCase()
      //.trim()
      //.replace(/\s+/g, "-")
      //.replace(/[^a-z0-9\-]/g, "");
 // }
  const idProducto = card.dataset.pid;

  const producto = new Producto(idProducto, nombreProducto, precioProducto, descripcionProducto, imagenProducto);
  agregarAlCarrito(producto);

  const cant = getCantidadCarrito(producto.id);
  if (cant >= MAX_COPIAS) {
    boton.disabled = true;
  }

  mostrarMensajeCarrito(card, "Añadido al carrito ✅");
});

// --------------------
// CAPTURAR FAVOS
// --------------------
document.addEventListener("click", (e) => {
  const botonFav = e.target.closest(".btn-favorito");
  if (!botonFav) return;

  const card = botonFav.closest(".card");
  if (!card) return;

  const idProducto = Number(card.dataset.pid);
  const producto = productosTienda.find(p => p.id === idProducto);
  if (!producto) return;

  // alternar favorito
  producto.favorito = !producto.favorito;

  // actualizar icono inmediatamente
  botonFav.textContent = producto.favorito ? "❤️" : "🤍";

  // recalcular lista según la vista actual
  if (mostrandoVistaFavoritos) {
    productosFiltrados = productosTienda.filter(p => p.favorito);
  } else {
    productosFiltrados = [...productosTienda];
  }

  // ajustar página actual si la eliminación reduce total de páginas
  const totalPaginas = window.miApp.getTotalPaginas();
  if (paginaActual > totalPaginas) paginaActual = totalPaginas || 1;

  // repintar productos y botones sin cambiar la página actual
  window.miApp.pintarProductos();
  window.miApp.pintarBotones();
});






// --------------------
// PAGINACIÓN
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const gridProductos = document.getElementById("grid-productos");
  const infoPaginacion = document.getElementById("info-paginacion");
  const paginacionDiv = document.getElementById("paginacion");
  const inputBuscador = document.getElementById("buscador");
  const tituloMain = document.getElementById("titulo-productos");
  const btnFavoritos = document.getElementById("btn-favoritos");
  const btnInicio = document.getElementById("btn-inicio");



  if (!gridProductos || !infoPaginacion || !paginacionDiv) {
    console.error("Faltan elementos: #grid-productos, #info-paginacion o #paginacion");
    return;
  }

  const productos = productosTienda;
  //let productosFiltrados = [...productos];

  function getTotalPaginas() {
    return Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  }

  function obtenerExtra(producto) {
    if (producto.constructor.name === "ProductoElectrodomestico")
      return `Garantía: ${producto.garantia} años`;
    if (producto.constructor.name === "ProductoSmartphone")
      return `Sistema: ${producto.sistemaOperativo}`;
    if (producto.constructor.name === "ProductoAudio")
      return `Tipo: ${producto.tipoAudio}`;
    if (producto.constructor.name === "ProductoAccesorio")
      return `Compatibilidad: ${producto.compatibilidad}`;
    if (producto.constructor.name === "ProductoVideojuego")
      return `Generación: ${producto.generacion}`;
    return "";
  }

  function pintarProductos() {
    gridProductos.innerHTML = "";

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    productosPagina.forEach((prod) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4";

      col.innerHTML = `
        <div class="card h-100" data-pid="${prod.id}">
          <button class="btn btn-dark rounded-circle position-absolute top-0 end-0 m-2 btn-add-carrito">
            🛒
          </button>
          <button class="btn btn-danger rounded-circle position-absolute top-0 start-0 m-2 btn-favorito">
            ${prod.favorito ? "❤️" : "🤍"}
          </button>
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">${prod.descripcion}</p>
            <div class="fw-bold">${prod.precio} €</div>
            <small class="text-muted">${obtenerExtra(prod)}</small>
          </div>
        </div>
      `;

      gridProductos.appendChild(col);
    });

    infoPaginacion.textContent = `Mostrando ${productosPagina.length} de ${productosFiltrados.length}`;
  }

  function pintarBotones() {
    const total = getTotalPaginas();
    if (total <= 1) {
      paginacionDiv.innerHTML = "";
      return;
    }

    paginacionDiv.innerHTML = "";
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Paginación de productos");
    const ul = document.createElement("ul");
    ul.className = "pagination m-0";

    if (paginaActual > 1) {
      const liAnt = document.createElement("li");
      liAnt.className = "page-item";
      liAnt.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
      liAnt.addEventListener("click", (ev) => {
        ev.preventDefault();
        paginaActual--;
        actualizar();
      });
      ul.appendChild(liAnt);
    }

    for (let i = 1; i <= total; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === paginaActual ? "active" : ""}`;
      li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      li.addEventListener("click", (ev) => {
        ev.preventDefault();
        paginaActual = i;
        actualizar();
      });
      ul.appendChild(li);
    }

    if (paginaActual < total) {
      const liSig = document.createElement("li");
      liSig.className = "page-item";
      liSig.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
      liSig.addEventListener("click", (ev) => {
        ev.preventDefault();
        paginaActual++;
        actualizar();
      });
      ul.appendChild(liSig);
    }

    nav.appendChild(ul);
    paginacionDiv.appendChild(nav);
  }

  function actualizar() {
    const total = getTotalPaginas();
    if (paginaActual > total) paginaActual = total || 1;
    pintarProductos();
    pintarBotones();
  }

  function aplicarBusqueda() {
    const texto = (inputBuscador?.value ?? "").trim();
    const textoLower = texto.toLowerCase();

    if (tituloMain) {
      tituloMain.textContent = (texto === "")
        ? "Todos los productos"
        : `Buscando por: ${texto}`;
    }

    if (texto === "") {
      productosFiltrados = [...productos];
    } else {
      productosFiltrados = productos.filter((prod) => {
        return prod.nombre.toLowerCase().includes(textoLower);
      });
    }

    paginaActual = 1;
    actualizar();
  }

  window.miApp = {
    pintarProductos,
    pintarBotones,
    actualizar,
    getTotalPaginas
  };

  if (inputBuscador) {
    inputBuscador.addEventListener("input", aplicarBusqueda);
    aplicarBusqueda();
  } else {
    actualizar();
  }

  if (btnFavoritos) {
    btnFavoritos.addEventListener("click", (e) => {
      e.preventDefault();
      mostrandoVistaFavoritos = true;
      productosFiltrados = productos.filter(p => p.favorito);
      paginaActual = 1;
      actualizar();
    });
  }

  if (btnInicio) {
    btnInicio.addEventListener("click", (e) => {
      e.preventDefault();
      mostrandoVistaFavoritos = false;
      productosFiltrados = [...productos];
      paginaActual = 1;
      actualizar();
    });
  }
});

// --------------------
// DESCRIPCIÓN EXTENDIDA DEL PRODUCTO 
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".card img");
    if (!img) return;

    const existingOverlay = document.querySelector(".product-overlay");
    const existingModal = document.querySelector(".product-modal");
    if (existingOverlay || existingModal) {
      existingOverlay?.remove();
      existingModal?.remove();
      return;
    }

    const card = img.closest(".card");
    const titulo = card.querySelector(".card-title")?.textContent || "";
    const precio = card.querySelector(".fw-bold")?.textContent || "";
    const extra = card.querySelector("small")?.textContent || "";
    const descripcion = card.querySelector(".card-text")?.textContent || "";

    const overlay = document.createElement("div");
    overlay.className = "product-overlay";

    const modal = document.createElement("div");
    modal.className = "product-modal";

    const modalImage = document.createElement("div");
    modalImage.className = "modal-image";
    const modalImg = document.createElement("img");
    modalImg.src = img.src;
    modalImage.appendChild(modalImg);

    const modalDetails = document.createElement("div");
    modalDetails.className = "modal-details";
    modalDetails.innerHTML = `
      <span class="close-modal">&times;</span>
      <h3>${titulo}</h3>
      <div class="price">${precio}</div>
      <div class="extra">${extra}</div>
      <div class="description">${descripcion}</div>
    `;

    modal.appendChild(modalImage);
    modal.appendChild(modalDetails);

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    function cerrarModal() {
      modal.remove();
      overlay.remove();
    }

    overlay.addEventListener("click", cerrarModal);
    modal.querySelector(".close-modal").addEventListener("click", cerrarModal);
  });
});