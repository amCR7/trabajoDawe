import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

function FormularioNuevosProductos() {
  /*Esto sustituye a:
  FileReader
  dragover
  drop
  dragleave
  */
  const [file, setFile] = useState(null); //Guarda archivo que sube usuario
  const [dragging, setDragging] = useState(false); //Detecta si usuairo esta arrastrando archivo encima
  const [preview, setPreview] = useState(null); //Guarda URL de la imagen para mostrar preview

  const [tipoProducto, setTipoProducto] = useState(""); //Tipo seleccionado
  const [valorExtra, setValorExtra] = useState(""); //Valor campo extra dinámico
  const camposExtra = {
    televisor: { label: "Años de garantía", type: "number", placeholder: "Ej: 2" },
    smartphone: { label: "Sistema Operativo", type: "text", placeholder: "Ej: Android 14, iOS 17" },
    audio: { label: "Tipo de audio", type: "text", placeholder: "Ej: Altavoz portátil, Auriculares" },
    accesorio: { label: "Compatibilidad", type: "text", placeholder: "Ej: USB-C, Universal, PS5" },
    videojuego: { label: "Plataforma/Generación", type: "text", placeholder: "Ej: PS5, Xbox Series X, Nintendo Switch" },
  };

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (file) => {
    if (!file) return;
  
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    if (file) { //liberar URL
      URL.revokeObjectURL(preview);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!tipoProducto) {
      setMensaje("Debes seleccionar un tipo de producto");
      return;
    }
  
    if (!nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }
  
    if (!precio || parseFloat(precio) <= 0) {
      setMensaje("El precio debe ser un número positivo");
      return;
    }
  
    if (tipoProducto && !valorExtra.trim()) {
      setMensaje(`El campo ${camposExtra[tipoProducto].label} es obligatorio`);
      return;
    }
  
    const imagenSrc = file ? URL.createObjectURL(file) : "imagenes/default-product.png";
  
    const nuevoProducto = {
      tipo: tipoProducto,
      nombre,
      precio: parseFloat(precio),
      descripcion: descripcion || "Sin descripción",
      imagen: imagenSrc,
      valorExtra
    };
  
    console.log("Producto añadido:", nuevoProducto);
  
    setMensaje("Producto añadido correctamente");
  
    // Resetear formulario
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setTipoProducto("");
    setValorExtra("");
    setFile(null);
    setPreview(null);
  };
  
  return (
    <form className="formulario-productos" onSubmit={handleSubmit}>
      <h2>Nuevo producto</h2>
      {/* Select tipo de producto */}
      <select
        className="form-select mb-3"
        value={tipoProducto}
        onChange={(e) => setTipoProducto(e.target.value)}
        required
      >
        <option value="">Escoge un tipo</option>
        <option value="televisor">Televisor</option>
        <option value="smartphone">Smartphone</option>
        <option value="audio">Audio (altavoz / auriculares)</option>
        <option value="accesorio">Accesorio</option>
        <option value="videojuego">Videojuego</option>
      </select>

      {/* Campo extra dinámico */}
      {tipoProducto && camposExtra[tipoProducto] && (
        <div className="mb-3">
          <label className="form-label">{camposExtra[tipoProducto].label}</label>
          <input
            type={camposExtra[tipoProducto].type}
            className="form-control"
            placeholder={camposExtra[tipoProducto].placeholder}
            value={valorExtra}
            onChange={(e) => setValorExtra(e.target.value)}
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input
          type="number"
          className="form-control"
          min="0"
          step="0.01"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          rows="3"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>


      <FileUploader
        handleChange={handleChange}
        name="file"
        types={["JPG", "JPEG", "PNG"]}
        onDraggingStateChange={(drag) => setDragging(drag)} //cuando usuario arrastra archivo drag es true
      >
        <div className={`drag-drop-area ${preview ? "preview added" : ""}`}>
          {preview ? (
            <img src={preview} alt="preview" /> //si hay preview, muestra
          ) : (
            dragging && <p className="m-0">Suelta la imagen</p>//si no hay preview, comprueba si esta arrastrando archivo
          )}
  
        </div>
      </FileUploader>

      {mensaje && <div className="small mt-2">{mensaje}</div>}

      <button type="submit" className="btn btn-primary w-100 mt-3">
        Añadir producto
      </button>
  
    </form>
  );
}

export default FormularioNuevosProductos