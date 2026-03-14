function MenuNavegacion({ estaOnline, onAbrirCarrito }) {
  return (
    <nav className="menu-navegacion">

      {/*ENLACES DEL MENÚ*/}
      <ul className="menu-enlaces">

        {/*ENLACE INICIO*/}
        <li><a href="#">Inicio</a></li>

        {/*ENLACE PARA ABRIR EL CARRITO*/}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault() //evita recargar la página
              onAbrirCarrito() //abre el panel del carrito
            }}
          >
            Carrito
          </a>
        </li>
        {/*ENLACE FAVORITOS*/}
        <li><a href="#">Favoritos</a></li>
      </ul>

      {/*MENSAJE SI NO HAY CONEXIÓN*/}
      {!estaOnline && (
        <div className="mensaje-offline">
          Estás offline
        </div>
      )}
    </nav>
  )
}

export default MenuNavegacion