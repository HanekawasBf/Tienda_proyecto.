/*
Clase Producto: representa un producto y arma su propio HTML (template)
usando clases de Bootstrap. Se exporta para poder usarla en otros archivos.
*/

export class Producto {
    constructor(id, nombre, precio, stock, categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
    }

    // "static" = se llama sobre la clase (Producto.crearDesdeObjeto), no sobre una instancia.
    // La usamos como "fábrica": recibe datos sueltos y devuelve un Producto ya armado.
    static crearDesdeObjeto(obj) {
        return new Producto(obj.id, obj.nombre, obj.precio, obj.stock, obj.categoria);
    }

    // Arma y retorna el HTML (card de Bootstrap) listo para insertarse en el DOM
    renderCard() {
        let etiquetaStock = "";
        if (this.stock > 0) {
            etiquetaStock = '<span class="badge bg-success">Disponible</span>';
        } else {
            etiquetaStock = '<span class="badge bg-danger">Agotado</span>';
        }

        let html = '<div class="col-md-4 mb-4">';
        html += '<div class="card h-100 shadow-sm">';
        html += '<div class="card-body d-flex flex-column">';
        html += '<h5 class="card-title">' + this.nombre + '</h5>';
        html += '<h6 class="card-subtitle mb-2 text-muted">' + this.categoria + '</h6>';
        html += '<p class="card-text fs-5 fw-bold">$' + this.precio + '</p>';
        html += '<p class="card-text">' + etiquetaStock + ' <small class="text-muted">Stock: ' + this.stock + '</small></p>';
        // data-id="..." guarda el id del producto directamente en el boton del HTML.
        // Luego en app.js lo leemos con boton.dataset.id para saber a que producto aplica el clic.
        html += '<div class="mt-auto d-flex gap-2">';
        html += '<button class="btn btn-primary btn-sm btn-agregar" data-id="' + this.id + '">Agregar</button>';
        html += '<button class="btn btn-outline-secondary btn-sm btn-editar" data-id="' + this.id + '">Editar</button>';
        html += '<button class="btn btn-outline-danger btn-sm btn-eliminar" data-id="' + this.id + '">Eliminar</button>';
        html += '</div></div></div></div>';

        return html;
    }
}
