function Carrito({ onCerrar }) {
  return (
    <div className="overlay-carrito">
      <div className="panel-carrito">
        <div className="cabecera-carrito">
          <h2>Carrito de la compra</h2>
          <button onClick={onCerrar}>✕</button>
        </div>

        <div className="contenido-carrito">
          <p>El carrito está vacío.</p>
        </div>
      </div>
    </div>
  )
}

export default Carrito