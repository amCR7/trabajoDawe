import './App.css'
import Cabecera from './componentes/cabecera'
import MenuNavegacion from './componentes/menuNavegacion'
import EscaparateProductos from './componentes/catalogoProductos'
import FormularioNuevosProductos from './componentes/formularioNuevosProductos'
import Carrito from './componentes/carrito'
import Pie from './componentes/pie'

function App() {
  return (
    <div className="app-tienda">
      <Cabecera titulo="TecnoManía" />
      <MenuNavegacion />

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