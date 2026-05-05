function MenuNavegacion({ estaOnline, onAbrirCarrito, onMostrarFavoritos, onMostrarTodos, mostrarFavoritos, usuario, setVista }) {
  return (
    <nav className="menu-navegacion">
  
      <ul className="menu-enlaces">
  
        {/*INICIO*/}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setVista("inicio")   // 🔥 NUEVO
              onMostrarTodos()     // lo mantienes
            }}
            style={!mostrarFavoritos ? { fontWeight: 'bold' } : {}}
          >
            Inicio
          </a>
        </li>
  
        {/*CARRITO*/}
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
  
        {/*FAVORITOS*/}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setVista("inicio")   // 🔥 para que siga mostrando productos
              onMostrarFavoritos()
            }}
            style={mostrarFavoritos ? { fontWeight: 'bold' } : {}}
          >
            Favoritos
          </a>
        </li>
  
        {/* 👤 MI CUENTA */}
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setVista("cuenta")   // 🔥 NUEVO
            }}
          >
            Mi cuenta
          </a>
        </li>
  
        {/* 👑 ADMIN */}
        {usuario?.rol === "admin" && (
          <>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setVista("anadir")   // 🔥 NUEVO
                }}
              >
                Añadir producto
              </a>
            </li>
  
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setVista("editar")   // 🔥 NUEVO
                }}
              >
                Editar/Borrar productos
              </a>
            </li>
          </>
        )}
  
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