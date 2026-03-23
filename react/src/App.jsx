import './App.css'
import { useEffect, useState } from 'react'
import Cabecera from './componentes/cabecera'
import MenuNavegacion from './componentes/menuNavegacion'
import EscaparateProductos from './componentes/escaparateProductos'
import FormularioNuevosProductos from './componentes/formularioNuevosProductos'
import Carrito from './componentes/carrito'
import Pie from './componentes/pie'

function App() {
  const [estaOnline, setEstaOnline] = useState(navigator.onLine)
  const [carritoAbierto, setCarritoAbierto] = useState(false)
  const [productos, setProductos] = useState([])
  
  const agregarProducto = (producto) => {
    setProductos([...productos, producto])
  }

  useEffect(() => {
    const activarOnline = () => setEstaOnline(true)
    const activarOffline = () => setEstaOnline(false)

    window.addEventListener('online', activarOnline)
    window.addEventListener('offline', activarOffline)

    return () => {
      window.removeEventListener('online', activarOnline)
      window.removeEventListener('offline', activarOffline)
    }
  }, [])

  return (
    <div className="app-tienda">
      <Cabecera titulo="TecnoManía" />

      <MenuNavegacion
        estaOnline={estaOnline}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <div className="contenido-principal">
        <aside className="zona-lateral">
          <FormularioNuevosProductos onNuevoProducto={agregarProducto} />
        </aside>

        <main className="zona-productos">
          <EscaparateProductos productos={productos} />
        </main>
      </div>

      <Pie texto="© 2026 TecnoManía" />

      {carritoAbierto && (
        <Carrito onCerrar={() => setCarritoAbierto(false)} />
      )}
    </div>
  )
}

export default App