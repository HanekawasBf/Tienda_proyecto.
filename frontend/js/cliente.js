/*
Clase Cliente: representa a un cliente y arma su propio template (fila de tabla).
*/

export class Cliente {
    constructor(id, nombre, edad, correo) {
        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.correo = correo;
    }

    // convierte el JSON plano que llega del backend en un Cliente real
    static crearDesdeObjeto(obj) {
        return new Cliente(obj.id, obj.nombre, obj.edad, obj.correo);
    }

    renderFila() {
        let html = "<tr>";
        html += "<td>" + this.id + "</td>";
        html += "<td>" + this.nombre + "</td>";
        html += "<td>" + this.edad + "</td>";
        html += "<td>" + this.correo + "</td>";
        html += "<td>";
        html += '<button class="btn btn-sm btn-outline-secondary btn-editar-cliente" data-id="' + this.id + '">Editar</button> ';
        html += '<button class="btn btn-sm btn-outline-danger btn-eliminar-cliente" data-id="' + this.id + '">Eliminar</button>';
        html += "</td></tr>";

        return html;
    }
}
