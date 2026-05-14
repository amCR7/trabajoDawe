import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

export default function Login({ setUsuario, setVisitas }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userEmail = userCredential.user.email

      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userEmail })
      })

      const data = await response.json()

      setUsuario({
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol
      })
      setVisitas(data.visitas)

    } catch (error) {
      setError("Credenciales incorrectas")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-panel">
      <div className="login-header">
        <h2 className="login-titulo">Inicio de sesión</h2>
      </div>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-campo">
          <label className="login-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-campo">
          <label className="login-label">Contraseña</label>
          <input
            className="login-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-btn" type="submit" disabled={cargando}>
          {cargando ? "Autenticando..." : "Autenticarse"}
        </button>
      </form>
    </div>
  )
}