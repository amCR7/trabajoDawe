const PRODUCTOS_POR_PAGINA = 6;
let paginaActual = 1;

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

document.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn-add-carrito");
  if (!boton) return;

  const card = boton.closest(".card");
  if (!card) return;

  mostrarMensajeCarrito(card, "Añadido al carrito ✅");
});

// --------------------
// PAGINACIÓN
// --------------------
document.addEventListener("DOMContentLoaded", () => {
  const gridProductos = document.getElementById("grid-productos");
  const infoPaginacion = document.getElementById("info-paginacion");
  const paginacionDiv = document.getElementById("paginacion");

  if (!gridProductos || !infoPaginacion || !paginacionDiv) {
    console.error("Faltan elementos: #grid-productos, #info-paginacion o #paginacion");
    return;
  }

  // Guardamos TODOS los productos (cada hijo es un <div class="col-...">)
  const productos = Array.from(gridProductos.children);

  function getTotalPaginas() {
    return Math.ceil(productos.length / PRODUCTOS_POR_PAGINA);
  }

  function pintarProductos() {
    gridProductos.innerHTML = "";

    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;

    const productosPagina = productos.slice(inicio, fin);
    productosPagina.forEach((nodo) => gridProductos.appendChild(nodo));

    infoPaginacion.textContent = `Mostrando ${productosPagina.length} de ${productos.length}`;
  }

  function pintarBotones() {
    paginacionDiv.innerHTML = "";

    const total = getTotalPaginas();
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
    // Por seguridad: si cambia el total y te quedas en una página inválida
    const total = getTotalPaginas();
    if (paginaActual > total) paginaActual = total || 1;

    pintarProductos();
    pintarBotones();
  }

  // Inicializa
  actualizar();
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
// DESCRIPCIÓN EXTENDIDA DEL PRODUCTO (seguro)
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
      return; //  importantísimo para que no cree otro modal
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

    // Añadir al body
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
