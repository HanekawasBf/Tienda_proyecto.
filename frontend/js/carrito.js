/*
Clase Carrito: guarda los productos que el usuario va agregando.
Usa find() para buscar un producto ya agregado y filter() para quitarlo.
*/

export class Carrito {
    constructor() {
        this.items = []; // cada item: { producto, cantidad }
    }

    agregar(producto) {
        // find() recorre el arreglo y regresa el PRIMER elemento que cumpla la condicion,
        // o "undefined" si ninguno cumple. Aquí buscamos si ese producto ya esta en el carrito.
        let itemExistente = this.items.find(item => item.producto.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad = itemExistente.cantidad + 1;
        } else {
            this.items.push({ producto: producto, cantidad: 1 });
        }
    }

    eliminar(idProducto) {
        // filter() recorre el arreglo y devuelve un ARREGLO NUEVO solo con los elementos
        // que cumplen la condicion. Aqui nos quedamos con todo excepto ese producto.
        this.items = this.items.filter(item => item.producto.id !== idProducto);
    }

    calcularTotal() {
        let total = 0;
        for (let i = 0; i < this.items.length; i++) {
            total += this.items[i].producto.precio * this.items[i].cantidad;
        }
        return total;
    }

    renderResumen() {
        if (this.items.length === 0) {
            return '<p class="text-muted">El carrito está vacío.</p>';
        }

        let html = '<ul class="list-group mb-3">';
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            let subtotal = item.producto.precio * item.cantidad;
            html += '<li class="list-group-item d-flex justify-content-between">';
            html += item.producto.nombre + ' (x' + item.cantidad + ')';
            html += '<span>$' + subtotal + '</span>';
            html += '</li>';
        }
        html += '</ul>';
        html += '<h5 class="text-end">Total: $' + this.calcularTotal() + '</h5>';

        return html;
    }
}
