import './App.css'
import { useEffect, useState } from 'react'
import Cabecera from './componentes/cabecera'
import MenuNavegacion from './componentes/menuNavegacion'
import EscaparateProductos from './componentes/catalogoProductos'
import FormularioNuevosProductos from './componentes/formularioNuevosProductos'
import Carrito from './componentes/carrito'
import Pie from './componentes/pie'

function App() {

  const [estaOnline, setEstaOnline] = useState(navigator.onLine)

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

      <MenuNavegacion estaOnline={estaOnline} />

      <main className="contenido-principal">
        <section className="zona-productos">
          <EscaparateProductos />
        </section>

        <aside className="zona-lateral">
          <FormularioNuevosProductos />
          <Carrito />
        </aside>
      </main>

      <Pie texto="© 2026 TecnoManía" />
    </div>
  )
}

export default App