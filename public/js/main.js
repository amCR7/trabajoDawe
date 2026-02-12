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
