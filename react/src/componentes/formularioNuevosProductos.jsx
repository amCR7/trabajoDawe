import { useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

function FormularioNuevosProductos({ onNuevoProducto, deshabilitado }) {
  /*Esto sustituye a:
  FileReader
  dragover
  drop
  dragleave
  */

  //ESTADOS PARA LA IMAGEN
  const [file, setFile] = useState(null); //Guarda archivo que sube usuario
  const [dragging, setDragging] = useState(false); //Detecta si usuairo esta arrastrando archivo encima
  const [preview, setPreview] = useState(null); //Guarda URL de la imagen para mostrar preview


  //REFERENCIA AL INPUT FILE INTERNO
  const uploaderRef = useRef(null);

  //ESTADOS DEL TIPO DE PRODUCTO
  const [tipoProducto, setTipoProducto] = useState(""); //Tipo seleccionado
  const [valorExtra, setValorExtra] = useState(""); //Valor campo extra dinámico

  //CONFIGURACIÓN DE CAMPOS EXTRA SEGÚN EL TIPO DE PRODUCTO
  const camposExtra = {
    televisor: { label: "Años de garantía", type: "number", placeholder: "Ej: 2" },
    smartphone: { label: "Sistema Operativo", type: "text", placeholder: "Ej: Android 14, iOS 17" },
    audio: { label: "Tipo de audio", type: "text", placeholder: "Ej: Altavoz portátil, Auriculares" },
    accesorio: { label: "Compatibilidad", type: "text", placeholder: "Ej: USB-C, Universal, PS5" },
    videojuego: { label: "Plataforma/Generación", type: "text", placeholder: "Ej: PS5, Xbox Series X, Nintendo Switch" },
  };

  //ESTADOS DEL FORMULARIO
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  //MOSTRAR MENSAJE DE ERROR
  function mostrarMensajeError(texto, duracion = 3000) {
    setMensaje(`❌ ${texto}`);
    setTimeout(() => {
      setMensaje("");
    }, duracion);
  }

  //MOSTRAR MENSAJE DE ÉXITO
  function mostrarMensajeExito(texto, duracion = 3000) {
    setMensaje(`✅ ${texto}`);
    setTimeout(() => {
      setMensaje("");
    }, duracion);
  }

  //LIMPIAR ARCHIVO SELECCIONADO
  function limpiarArchivoSeleccionado() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);

    const inputFile = uploaderRef.current?.querySelector('input[type="file"]');
    if (inputFile) {
      inputFile.value = "";
    }
  }

  //VALIDAR ARCHIVO
  function validarArchivo(file) {
    if (!file) {
      return { valido: false, error: "No se ha seleccionado ningún archivo" };
    }

    const extension = file.name.split(".").pop().toLowerCase();
    const tipoMIME = file.type.toLowerCase();

    const extensionesPermitidas = ["jpg", "jpeg", "png"];
    const tiposPermitidos = ["image/jpeg", "image/jpg", "image/png"];

    if (!extensionesPermitidas.includes(extension)) {
      return {
        valido: false,
        error: `Solo se permiten archivos JPG/JPEG o PNG (extensión .${extension} no válida)`
      };
    }

    if (!tiposPermitidos.includes(tipoMIME)) {
      return {
        valido: false,
        error: `Tipo de archivo no válido: ${tipoMIME || "desconocido"}. Solo JPG/JPEG o PNG`
      };
    }

    return { valido: true };
  }

  //PROCESAR UN ARCHIVO VÁLIDO
  function procesarArchivo(archivo) {
    const validacion = validarArchivo(archivo);
    if (!validacion.valido) {
      mostrarMensajeError(validacion.error);
      limpiarArchivoSeleccionado();
      return;
    }

    if (preview) { //liberar URL
      URL.revokeObjectURL(preview);
    }

    const url = URL.createObjectURL(archivo);
    setPreview(url);
    setFile(archivo);
    mostrarMensajeExito("Imagen seleccionada correctamente");
  }

  //GESTIONAR CAMBIO DE IMAGEN
  const handleChange = (entrada) => {
    if (deshabilitado) return;
    if (!entrada) return;

    const archivos = Array.isArray(entrada)
      ? entrada
      : entrada instanceof FileList
      ? Array.from(entrada)
      : [entrada];

    if (archivos.length > 1) {
      mostrarMensajeError("Solo se permite subir un archivo");
      limpiarArchivoSeleccionado();
      return;
    }

    const archivo = archivos[0];
    if (!archivo) return;

    procesarArchivo(archivo);
  };

  //GESTIONAR DROP MANUALMENTE PARA DETECTAR VARIOS ARCHIVOS
  //GESTIONAR DROP MANUALMENTE PARA DETECTAR VARIOS ARCHIVOS
  const handleDrop = (e) => {
    if (deshabilitado) return;

    const archivos = Array.from(e.dataTransfer?.files || []);

    if (archivos.length > 1) {
      mostrarMensajeError("Solo se permite subir un archivo");
      limpiarArchivoSeleccionado();
      return;
    }

    const archivo = archivos[0];
    if (!archivo) return;

    procesarArchivo(archivo);
  };

  //GESTIONAR SELECCIÓN DESDE EL INPUT FILE
  const handleInputChange = (e) => {
    if (deshabilitado) return;

    const archivos = Array.from(e.target.files || []);

    if (archivos.length > 1) {
      mostrarMensajeError("Solo se permite subir un archivo");
      limpiarArchivoSeleccionado();
      return;
    }

    const archivo = archivos[0];
    if (!archivo) return;

    procesarArchivo(archivo);
  };

  //GESTIONAR ENVÍO DEL FORMULARIO
  const handleSubmit = (e) => {
    e.preventDefault();
    if (deshabilitado) return;

    //VALIDAR TIPO DE PRODUCTO
    if (!tipoProducto) {
      setMensaje("Debes seleccionar un tipo de producto");
      return;
    }

    //VALIDAR NOMBRE
    if (!nombre.trim()) {
      setMensaje("El nombre es obligatorio");
      return;
    }

    //VALIDAR PRECIO
    if (!precio || parseFloat(precio) <= 0) {
      setMensaje("El precio debe ser un número positivo");
      return;
    }

    //VALIDAR CAMPO EXTRA
    if (tipoProducto && !valorExtra.trim()) {
      setMensaje(`El campo ${camposExtra[tipoProducto].label} es obligatorio`);
      return;
    }

    //CREAR IMAGEN DEL PRODUCTO
    const imagenSrc = file ? URL.createObjectURL(file) : "imagenes/default-product.png";

    //CREAR OBJETO DEL NUEVO PRODUCTO (POR DEFECTO)
    const nuevoProducto = {
      tipo: tipoProducto,
      nombre,
      precio: parseFloat(precio),
      descripcion: descripcion || "Sin descripción",
      imagen: imagenSrc,
      extra: valorExtra
    };

    console.log("Producto añadido:", nuevoProducto);
    onNuevoProducto(nuevoProducto);

    mostrarMensajeExito("Producto añadido correctamente");

    // Resetear formulario
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setTipoProducto("");
    setValorExtra("");
    limpiarArchivoSeleccionado();
  };

  return (
    <form className="formulario-productos" onSubmit={handleSubmit}>
      <h2 className="mb-3">Añadir producto</h2>

      {/* Tipo de producto */}
      <div className="mb-3">
        <label className="form-label">Tipo de producto</label>

        <select
          className="form-select"
          value={tipoProducto}
          onChange={(e) => setTipoProducto(e.target.value)}
          required
          disabled={deshabilitado}
        >
          <option value="">Escoge un tipo</option>
          <option value="televisor">Electrodoméstico</option>
          <option value="smartphone">Smartphone</option>
          <option value="audio">Audio (altavoz / auriculares)</option>
          <option value="accesorio">Accesorio</option>
          <option value="videojuego">Videojuego</option>
        </select>
      </div>

      {/* Campo extra dinámico */}
      {tipoProducto && camposExtra[tipoProducto] && (
        <div className="mb-3">
          <label className="form-label">
            {camposExtra[tipoProducto].label}
          </label>

          <input
            type={camposExtra[tipoProducto].type}
            className="form-control"
            placeholder={camposExtra[tipoProducto].placeholder}
            value={valorExtra}
            onChange={(e) => setValorExtra(e.target.value)}
            required
            disabled={deshabilitado}
          />
        </div>
      )}

      {/* Campo nombre */}
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          disabled={deshabilitado}
        />
      </div>

      {/* Campo precio */}
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
          disabled={deshabilitado}
        />
      </div>

      {/* Campo descripción */}
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <textarea
          className="form-control"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={deshabilitado}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Imagen</label>
        <div ref={uploaderRef}>
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={["JPG", "JPEG", "PNG"]}
            multiple={true}
            onDrop={handleDrop}
            onDraggingStateChange={(drag) => !deshabilitado && setDragging(drag)} //cuando usuario arrastra archivo drag es true
            disabled={deshabilitado}
          >
            <div
              className={`drag-drop-area ${preview ? "preview added" : ""} ${deshabilitado ? "drag-drop-disabled" : ""} ${dragging ? "drag-over" : ""}`}
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" />
                  {!deshabilitado && (
                    <button
                      type="button"
                      className="btn-eliminar-imagen"
                      onClick={limpiarArchivoSeleccionado}
                      title="Eliminar imagen"
                    >
                      ✕
                    </button>
                  )}
                </>
              ) : (
                <p className="m-0">
                  {deshabilitado
                    ? "Subida deshabilitada"
                    : dragging
                    ? "Suelta la imagen"
                    : "Arrastra una imagen aquí o haz clic"}
                </p>
              )}
            </div>
          </FileUploader>
        </div>
      </div>

      {mensaje && <div className="small mt-2">{mensaje}</div>}

      {/*BOTÓN AÑADIR PRODUCTO*/}
      <button
        type="submit"
        className="btn-submit-producto"
        disabled={deshabilitado}
      >
        Añadir producto
      </button>
    </form>
  );
}

export default FormularioNuevosProductos;