import { Producto } from './producto.js';

import { productosTienda } from "./tienda.js";
console.log("Productos cargados:", productosTienda);
const PRODUCTOS_POR_PAGINA = 6;
let paginaActual = 1;
let carrito = [];
let favoritos = [];
let productosFiltrados = [...productosTienda]; // GLOBAL
let mostrandoVistaFavoritos = false; // GLOBAL
const MAX_COPIAS = 20;

// --------------------
// CARRITO: mensaje 1-2s
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

// --------------------
// AVISO debajo del input del carrito (estilo como la foto)
// --------------------
function mostrarAvisoBajoInput(lineaProductoDiv, texto) {
  const slot = lineaProductoDiv.querySelector(".aviso-slot");
  if (!slot) return;

  slot.innerHTML = "";

  const msg = document.createElement("div");
  msg.className = "aviso-max-copias";
  msg.textContent = texto;

  // Estilo inline para que siempre se vea
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

// --------------------
// TOTAL CARRITO
// --------------------
function actualizarTotalCarrito() {
  const carritoTotal = document.getElementById("carrito-total");
  if (!carritoTotal) return;

  if (carrito.length === 0) {
    carritoTotal.innerHTML = "";
    return;
  }

  const totalCarrito = carrito.reduce((sum, p) => {
    const cant = p.cantidad ?? 1;
    return sum + (p.precio * cant);
  }, 0);

  carritoTotal.innerHTML = `<h5>Total: ${totalCarrito.toFixed(2)} €</h5>`;
}

// --------------------
// BOTÓN "AÑADIR" del catálogo: activar/desactivar según cantidad
// --------------------
function actualizarBotonAddCatalogo(idProducto, deshabilitar) {
  const cardOriginal = document.querySelector(`.card[data-pid="${idProducto}"]`);
  if (!cardOriginal) return;
  const btn = cardOriginal.querySelector(".btn-add-carrito");
  if (!btn) return;
  btn.disabled = !!deshabilitar;
}

// --------------------
// AGREGAR AL CARRITO
// --------------------
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    const actual = existente.cantidad ?? 1;

    if (actual >= MAX_COPIAS) {
      // NO actualizar (se queda en 20) y marcar para mostrar aviso en el carrito
      existente._avisarMax = true;
      existente.cantidad = MAX_COPIAS;
    } else {
      existente.cantidad = Math.min(MAX_COPIAS, actual + 1);
    }
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  // Si llega a 20 por añadir, desactivar botón del catálogo
  actualizarBotonAddCatalogo(producto.id, (carrito.find(p => p.id === producto.id)?.cantidad ?? 0) >= MAX_COPIAS);

  mostrarCarrito();
}

// --------------------
// MOSTRAR CARRITO
// --------------------
function mostrarCarrito() {
  const carritoProductos = document.getElementById("carrito-productos");
  if (!carritoProductos) return;
  carritoProductos.innerHTML = "";

  carrito.forEach((producto) => {
    const cantidadInicial = producto.cantidad ?? 1;

    const divProducto = document.createElement("div");
    divProducto.className = "d-flex align-items-start mb-3";

    divProducto.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid" style="width: 50px; height: 50px; margin-right: 10px;">
      <div class="flex-fill">
        <div><strong>${producto.nombre}</strong></div>
        <div>${producto.precio} €</div>

        <input type="number"
          class="form-control cantidad"
          value="${cantidadInicial}"
          min="0" max="${MAX_COPIAS}"
        >
        <div class="aviso-slot"></div>
        <div class="precio-total mt-1">
          Total: ${(producto.precio * cantidadInicial).toFixed(2)} €
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
        producto._avisarMax = true;
        mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
      }
    }
    input.addEventListener("pointerdown", detectarClickSpinnerSubir);

    //Si está en 1, borrar
    function detectarClickSpinnerBajar(e) {
      const rect = input.getBoundingClientRect();

      const clickEnZonaSpinner = e.clientX > rect.right - 30;
      if (!clickEnZonaSpinner) return;

      const clickEnParteInferior = e.clientY >= (rect.top + rect.height / 2);
      if (!clickEnParteInferior) return;

      const actual = parseInt(input.value, 10);
      if (Number.isFinite(actual) && actual === 1) {
        e.preventDefault();
        carrito = carrito.filter(p => p.id !== producto.id);

        //Al borrar, reactivar botón del catálogo
        actualizarBotonAddCatalogo(producto.id, false);

        mostrarCarrito();
      }
    }
    input.addEventListener("pointerdown", detectarClickSpinnerBajar);

    function actualizarCantidadDesdeInput() {
      const valorEscrito = parseInt(input.value, 10);
      const intentoPasarMax = Number.isFinite(valorEscrito) && valorEscrito > MAX_COPIAS;

      let cantidad = valorEscrito;
      if (Number.isNaN(cantidad)) cantidad = 0;

      if (cantidad <= 0) {
        carrito = carrito.filter(p => p.id !== producto.id);

        //Al borrar, reactivar botón del catálogo
        actualizarBotonAddCatalogo(producto.id, false);

        mostrarCarrito();
        return;
      }

      cantidad = Math.min(MAX_COPIAS, cantidad);

      if (intentoPasarMax) {
        producto._avisarMax = true;
        mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
      }

      input.value = cantidad;
      producto.cantidad = cantidad;

      //desactivar/activar botón del catálogo según cantidad
      actualizarBotonAddCatalogo(producto.id, cantidad >= MAX_COPIAS);

      totalLineaDiv.textContent = `Total: ${(producto.precio * cantidad).toFixed(2)} €`;
      actualizarTotalCarrito();
    }

    input.addEventListener("input", actualizarCantidadDesdeInput);
    input.addEventListener("change", actualizarCantidadDesdeInput);
    input.addEventListener("keydown", (e) => {
      // Flecha arriba cuando ya está en MAX
      if (e.key === "ArrowUp") {
        const actual = parseInt(input.value, 10);
        if (Number.isFinite(actual) && actual >= MAX_COPIAS) {
          e.preventDefault();

          input.value = MAX_COPIAS;
          producto.cantidad = MAX_COPIAS;

          // Desactivar botón del catálogo automáticamente al llegar a 20
          actualizarBotonAddCatalogo(producto.id, true);

          totalLineaDiv.textContent = `Total: ${(producto.precio * MAX_COPIAS).toFixed(2)} €`;
          actualizarTotalCarrito();

          producto._avisarMax = true;
          mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
        }
      }

      // cuando esta en uno y le damos flecha abajo -> borrar y desaparecer
      if (e.key === "ArrowDown") {
        const actual = parseInt(input.value, 10);
        if (Number.isFinite(actual) && actual === 1) {
          e.preventDefault();
          carrito = carrito.filter(p => p.id !== producto.id);

          // Al borrar, reactivar botón del catálogo
          actualizarBotonAddCatalogo(producto.id, false);

          mostrarCarrito();
        }
      }
    });

    carritoProductos.appendChild(divProducto);

    // Mostrar mensaje maximo 20 copias
    if (producto._avisarMax) {
      mostrarAvisoBajoInput(divProducto, `No se permiten más de ${MAX_COPIAS} copias.`);
      delete producto._avisarMax;
    }
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

  const nombreProducto = card.querySelector(".card-title").textContent;
  const precioProducto = parseFloat(card.querySelector(".fw-bold").textContent.replace(" €", ""));
  const descripcionProducto = card.querySelector(".card-text")?.textContent || "Descripción no disponible";
  const imagenProducto = card.querySelector(".card-img-top").src;

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

  const existente = carrito.find(p => p.id === idProducto);
  if (existente && existente.cantidad >= MAX_COPIAS) {
    boton.disabled = true;
  }

  mostrarMensajeCarrito(card, "Añadido al carrito ✅");
});

//CAPTURAR FAVOS
document.addEventListener("click", (e) => {
  const botonFav = e.target.closest(".btn-favorito"); // detecta clicks en cualquier botón de favorito
  if (!botonFav) return;

  const card = botonFav.closest(".card");
  if (!card) return;

  const idProducto = Number(card.dataset.pid);

  // buscamos el producto en tu array global `productosTienda` o `productos` dentro de DOMContentLoaded
  const producto = productosTienda.find(p => p.id === idProducto);
  if (!producto) return;

  // alternamos su estado de favorito
  producto.favorito = !producto.favorito;

  favoritos = productosTienda.filter(p => p.favorito);

  // cambiamos el icono del botón
  botonFav.textContent = producto.favorito ? "❤️" : "🤍";

  if (mostrandoVistaFavoritos && !producto.favorito) {
    // eliminar el card del DOM sin refrescar todo
    card.remove();

    // actualizar productosFiltrados para mantener consistencia
    productosFiltrados = productosFiltrados.filter(p => p.favorito);

    // opcional: actualizar la paginación y el texto
    const infoPaginacion = document.getElementById("info-paginacion");
    if (infoPaginacion) {
      infoPaginacion.textContent = `Mostrando ${productosFiltrados.length} de ${productosTienda.length}`;
    }

    // si la paginación estaba activa, volver a pintar botones
    const paginacionDiv = document.getElementById("paginacion");
    if (paginacionDiv) pintarBotones();
  }
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

  // Guardamos TODOS los productos (cada hijo es un <div class="col-...">)
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
  
    infoPaginacion.textContent = `Mostrando ${productosPagina.length} de ${productos.length}`;
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

    // Anterior (solo si no estamos en la primera)
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

    // Números
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

    // Siguiente (solo si no estamos en la última)
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
// DRAG & DROP IMAGEN + PREVIEW + RESET
// --------------------
document.addEventListener("DOMContentLoaded", () => {

  const dragDropArea = document.getElementById("drag-drop-area");
  const fileInput = document.getElementById("archivo-imagen");
  const formulario = document.getElementById("formulario-producto");

  if (!dragDropArea || !fileInput || !formulario) return;

  const mensajeOriginal = "Arrastra una imagen aquí o haz clic";

  function mostrarPreview(file) {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      dragDropArea.innerHTML = "";
      const img = document.createElement("img");
      img.src = e.target.result;

      dragDropArea.appendChild(img);
      dragDropArea.classList.add("added", "preview");
    };

    reader.readAsDataURL(file);
  }

  function resetDragDrop() {
    dragDropArea.innerHTML = `<p class="m-0">${mensajeOriginal}</p>`;
    dragDropArea.classList.remove("added", "preview", "drag-over");
    fileInput.value = "";
  }

  // Click abre selector
  dragDropArea.addEventListener("click", () => {
    fileInput.click();
  });

  // Arrastrando encima
  dragDropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dragDropArea.classList.add("drag-over");
  });

  dragDropArea.addEventListener("dragleave", () => {
    dragDropArea.classList.remove("drag-over");
  });

  // Soltar archivo
  dragDropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dragDropArea.classList.remove("drag-over");

    const file = e.dataTransfer.files[0];
    if (file) {
      fileInput.files = e.dataTransfer.files;
      mostrarPreview(file);
    }
  });

  // Selección manual
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      mostrarPreview(file);
    }
  });

  // RESET cuando se envía el formulario
  formulario.addEventListener("submit", () => {
    setTimeout(() => {
      resetDragDrop();
    }, 100); 
  });

});

// --------------------
// DESCRIPCIÓN EXTENDIDA DEL PRODUCTO 
// --------------------
document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".card img");
    if (!img) return; // solo reaccionar al click en imagen

    // Si ya hay un modal abierto, cerrarlo y salir
    const existingOverlay = document.querySelector(".product-overlay");
    const existingModal = document.querySelector(".product-modal");
    if (existingOverlay || existingModal) {
      existingOverlay?.remove();
      existingModal?.remove();
      return;
    }

    const card = img.closest(".card");

    // Obtener datos del producto
    const titulo = card.querySelector(".card-title")?.textContent || "";
    const precio = card.querySelector(".fw-bold")?.textContent || "";
    const extra = card.querySelector("small")?.textContent || "";
    const descripcion = card.querySelector(".card-text")?.textContent || "";

    // Crear overlay
    const overlay = document.createElement("div");
    overlay.className = "product-overlay";

    // Crear modal
    const modal = document.createElement("div");
    modal.className = "product-modal";

    // Imagen
    const modalImage = document.createElement("div");
    modalImage.className = "modal-image";
    const modalImg = document.createElement("img");
    modalImg.src = img.src;
    modalImage.appendChild(modalImg);

    // Detalles
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

    // Función cerrar
    function cerrarModal() {
      modal.remove();
      overlay.remove();
    }

    overlay.addEventListener("click", cerrarModal);
    modal.querySelector(".close-modal").addEventListener("click", cerrarModal);
  });


});
