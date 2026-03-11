function MenuNavegacion({ estaOnline }) {
  return (
    <nav className="menu-navegacion">

      <div className="menu-enlaces">
        <span>Inicio</span>
        <span>Productos</span>
        <span>Carrito</span>
      </div>

      {!estaOnline && (
        <div className="mensaje-offline">
          Estás offline
        </div>
      )}

    </nav>
  )
}

export default MenuNavegacion