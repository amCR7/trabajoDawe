function MenuNavegacion({ estaOnline, onAbrirCarrito }) {
  return (
    <nav className="menu-navegacion">
      <ul className="menu-enlaces">
        <li><a href="#">Inicio</a></li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onAbrirCarrito()
            }}
          >
            Carrito
          </a>
        </li>
        <li><a href="#">Favoritos</a></li>
      </ul>

      {!estaOnline && (
        <div className="mensaje-offline">
          Estás offline
        </div>
      )}
    </nav>
  )
}

export default MenuNavegacion