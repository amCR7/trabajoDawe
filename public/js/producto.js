export class Producto{
    #id;
    #nombre;
    #precio;
    #descripcion;
    #imagen;

    constructor(id, nombre, precio, descripcion, imagen){
        this.#id = id;
        this.#nombre = nombre;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#imagen = imagen;
    }

    get id(){
        return this.#id;
    }

    set id(nuevoId){
        this.#id = nuevoId;
    }

    get nombre(){
        return this.#nombre;
    }

    set nombre(nuevoNombre){
        this.#nombre = nuevoNombre;
    }

    get precio(){
        return this.#precio;
    }

    set precio(nuevoPrecio){
        if (nuevoPrecio > 0){
            this.#precio = nuevoPrecio;
        }
    }

    get descripcion(){
        return this.#descripcion;
    }

    set descripcion(nuevaDescripcion){
        this.#descripcion = nuevaDescripcion;
    }

    get imagen(){
        return this.#imagen;
    }

    set imagen(nuevaImagen){
        this.#imagen = nuevaImagen;
    }
}