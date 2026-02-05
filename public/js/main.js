function mostrarMensajeCarrito(card, texto) {
  // Si ya hay un mensaje, lo quitamos para no duplicar
  const existente = card.querySelector(".mensaje-carrito");
  if (existente) existente.remove();

  const msg = document.createElement("div");
  msg.className = "mensaje-carrito";
  msg.textContent = texto;

  card.appendChild(msg);

  // Quitar a los 1.5 segundos (entre 1 y 2s como pide el enunciado)
  setTimeout(() => {
    msg.remove();
  }, 1500);
}

document.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn-add-carrito");
  if (!boton) return;

  const card = boton.closest(".card");
  if (!card) return;

  mostrarMensajeCarrito(card, "Añadido al carrito ✅");
});
