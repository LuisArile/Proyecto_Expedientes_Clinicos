import { useEffect, useState } from 'react'

function App() {
  const [mensaje, setMensaje] = useState("Cargando...")

  useEffect(() => {
    fetch("http://localhost:3000/api/usuarios")
      .then(res => res.json())
      .then(data => {
        console.log("Datos recibidos:", data)
        setMensaje("Conexión exitosa, Los datos están en la consola.")
      })
      .catch(err => {
        console.error("Error al conectar:", err)
        setMensaje("Error: No se pudo conectar con el Backend")
      })
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Estado de la conexión:</h1>
      <p>{mensaje}</p>
    </div>
  )
}

export default App