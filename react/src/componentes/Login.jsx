import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

export default function Login({ setUsuario, setVisitas }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log("🔥 FRONT LOGIN CLICK")
  
    try {
      // 1. Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
  
      const userEmail = userCredential.user.email
  
      // 2. Crear sesión en Express
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email: userEmail })
      })
  
      const data = await response.json()
      console.log("DATA BACKEND:", data)
  
      console.log("Sesión creada:", data)
  
      // 🔥 3. AQUÍ VA EL setUsuario (con rol incluido)
      setUsuario({
        email: data.email,
        nombre: data.nombre,
        apellido: data.apellido,
        rol: data.rol
      })

      setVisitas(data.visitas)
  
      setError("")
  
    } catch (error) {
      setError("Login incorrecto")
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}