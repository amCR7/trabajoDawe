class ProductoElectrodomestico extends Producto{
    #garantia;

    constructor(id, nombre, precio, descripcion, imagen, garantia){
        super(id, nombre, percio, descripcion, imagen);
        this.#garantia = garantia;
    }

    get garantia(){
        return this.#garantia;
    }

    set garantia(nuevaGarantia){
        this.#garantia = nuevaGarantia;
    }
}

class ProductoSmartphone extends Producto{
    #sistemaOperativo;

    constructor(id, nombre, precio, descripcion, imagen, sistemaOperativo){
        super(id, nombre, precio, descripcion, imagen);
        this.#sistemaOperativo = sistemaOperativo;
    }

    get sistemaOperativo(){
        return this.#sistemaOperativo;
    }

    set sistemaOperativo(nuevoSO){
        this.#sistemaOperativo = nuevoSO;
    }
}

class ProductoAudio extends Producto{
    #tipoAudio;

    constructor(id, nombre, precio, descripcion, imagen, tipoAudio){
        super(id, nombre, precio, descripcion, imagen);
        this.#tipoAudio = tipoAudio;
    }

    get tipoAudio(){
        return this.#tipoAudio;
    }

    set tipoAudio(nuevoTipoAudio){
        this.#tipoAudio = nuevoTipoAudio;
    }
}

class ProductoAccesorio extends Producto{
    #compatibilidad;

    constructor(id, nombre, precio, descripcion, imagen, compatibilidad){
        super(id, nombre, precio, descripcion, imagen);
        this.#compatibilidad = compatibilidad;
    }

    get compatibilidad(){
        return this.#compatibilidad;
    }

    set compatibilidad(nuevaCompatibilidad){
        this.#compatibilidad = nuevaCompatibilidad;
    }
}

class ProductoVideojuego extends Producto{
    #generacion;

    constructor(id, nombre, precio, descripcion, imagen, generacion){
        super(id, nombre, precio, descripcion, imagen);
        this.#generacion = generacion;
    }

    get generacion(){
        return this.#generacion;
    }

    set generacion(nuevaGen){
        this.#generacion = nuevaGen;
    }
}