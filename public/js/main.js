import { Producto } from './producto.js';

const PRODUCTOS_POR_PAGINA = 6;
let paginaActual = 1;
let carrito = [];

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
// TOTAL CARRITO
// --------------------
function actualizarTotalCarrito() {
  const totalCarrito = carrito.reduce((sum, p) => {
    const cant = p.cantidad ?? 1;
    return sum + (p.precio * cant);
  }, 0);

  const carritoTotal = document.getElementById("carrito-total");
  carritoTotal.innerHTML = `<h5>Total: ${totalCarrito.toFixed(2)} €</h5>`;
}

// --------------------
// AGREGAR AL CARRITO
// --------------------
function agregarAlCarrito(producto) {
  const existente = carrito.find(p => p.id === producto.id);

  if (existente) {
    existente.cantidad = Math.min(20, (existente.cantidad ?? 1) + 1);
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }

  mostrarCarrito();
}

// --------------------
// MOSTRAR CARRITO
// --------------------
function mostrarCarrito() {
  const carritoProductos = document.getElementById("carrito-productos");
  carritoProductos.innerHTML = "";

  carrito.forEach((producto) => {
    const cantidadInicial = producto.cantidad ?? 1;

    const divProducto = document.createElement("div");
    divProducto.className = "d-flex align-items-center mb-3";

    divProducto.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid" style="width: 50px; height: 50px; margin-right: 10px;">
      <div class="flex-fill">
        <div><strong>${producto.nombre}</strong></div>
        <div>${producto.precio} €</div>

        <input type="number"
          class="form-control cantidad"
          value="${cantidadInicial}"
          min="1" max="20"
        >

        <div class="precio-total mt-1">
          Total: ${(producto.precio * cantidadInicial).toFixed(2)} €
        </div>
      </div>
    `;

    const input = divProducto.querySelector("input.cantidad");
    const totalLineaDiv = divProducto.querySelector(".precio-total");

    input.addEventListener("input", () => {
      let cantidad = parseInt(input.value, 10);
      if (Number.isNaN(cantidad)) cantidad = 1;
      cantidad = Math.max(1, Math.min(20, cantidad));
      input.value = cantidad;

      // Actualiza el objeto
      producto.cantidad = cantidad;

      // Actualiza total de esa línea
      totalLineaDiv.textContent = `Total: ${(producto.precio * cantidad).toFixed(2)} €`;

      // Actualiza total del carrito
      actualizarTotalCarrito();
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

  const nombreProducto = card.querySelector(".card-title").textContent;
  const precioProducto = parseFloat(card.querySelector(".fw-bold").textContent.replace(" €", ""));
  const descripcionProducto = card.querySelector(".card-text")?.textContent || "Descripción no disponible";
  const imagenProducto = card.querySelector(".card-img-top").src;

  //id no aleatorio
  if (!card.dataset.pid) {
    card.dataset.pid = nombreProducto
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }
  const idProducto = card.dataset.pid;

  const producto = new Producto(idProducto, nombreProducto, precioProducto, descripcionProducto, imagenProducto);

  agregarAlCarrito(producto);
  mostrarMensajeCarrito(card, "Añadido al carrito ✅");
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



  if (!gridProductos || !infoPaginacion || !paginacionDiv) {
    console.error("Faltan elementos: #grid-productos, #info-paginacion o #paginacion");
    return;
  }

  const productosOriginales = Array.from(gridProductos.children);
  let productosFiltrados = [...productosOriginales];


  function getTotalPaginas() {
    return Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA); 
  }



  function pintarProductos() {
    gridProductos.innerHTML = "";

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;

    const productosPagina = productosFiltrados.slice(inicio, fin);
    productosPagina.forEach((nodo) => gridProductos.appendChild(nodo));

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
      productosFiltrados = [...productosOriginales];
    } else {
      productosFiltrados = productosOriginales.filter((card) => {
        const nombre = card.querySelector(".card-title")?.textContent ?? "";
        return nombre.toLowerCase().includes(textoLower);
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
