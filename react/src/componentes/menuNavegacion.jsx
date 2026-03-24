function MenuNavegacion({ estaOnline, onAbrirCarrito, onMostrarFavoritos, onMostrarTodos, mostrarFavoritos }) {
  return (
    <nav className="menu-navegacion">
      <ul className="menu-enlaces">
        <li>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              if (onMostrarTodos) onMostrarTodos()
            }}
            style={!mostrarFavoritos ? { fontWeight: 'bold' } : {}}
          >
            Inicio
          </a>
        </li>
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
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (onMostrarFavoritos) onMostrarFavoritos()
            }}
            style={mostrarFavoritos ? { fontWeight: 'bold', color: '#dc3545' } : {}}
          >
            {mostrarFavoritos ? '❤️' : '🤍'} Favoritos
          </a>
        </li>
      </ul>

      {!estaOnline && (
        <div className="mensaje-offline">
          ⚠️ Estás offline
        </div>
      )}
    </nav>
  )
}

export default MenuNavegacion