/**
Modulo principal de la tienda (separado de login.js).
Pide los datos a la API, los convierte en instancias de clase,
los muestra en pantalla y maneja crear/editar/eliminar.
*/

import { Producto } from "./producto.js";
import { Cliente } from "./cliente.js";
import { Carrito } from "./carrito.js";

const API_URL = "http://127.0.0.1:8000";

let carrito = new Carrito();
let productosCompletos = []; // TODOS los productos que trajo el backend
let productosActuales = []; // los que se están mostrando ahora mismo (ya filtrados)

//  PRODUCTOS 

async function cargarProductos() {
    let respuesta = await fetch(API_URL + "/productos");
    // .json() convierte el cuerpo de la respuesta (texto) en un objeto/arreglo de JS
    let datos = await respuesta.json();

    // Convertimos cada objeto plano del JSON en una instancia formal de Producto
    productosCompletos = [];
    for (let i = 0; i < datos.length; i++) {
        productosCompletos.push(Producto.crearDesdeObjeto(datos[i]));
    }

    // Aplicamos el texto que haya en la caja de busqueda
    filtrarProductos();
}

function filtrarProductos() {
    let texto = document.getElementById("buscar-nombre").value.toLowerCase();
    let categoria = document.getElementById("buscar-categoria").value.toLowerCase();

    // filter(): en cada tecla, filtramos en el navegador sobre la lista completa
    productosActuales = productosCompletos.filter(function (producto) {
        // includes() revisa si un texto contiene otro texto dentro
        let coincideNombre = producto.nombre.toLowerCase().includes(texto);
        let coincideCategoria = categoria === "" || producto.categoria.toLowerCase().includes(categoria);
        return coincideNombre && coincideCategoria;
    });

    mostrarProductos();
}

function mostrarProductos() {
    let contenedor = document.getElementById("contenedor-productos");

    if (productosActuales.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No se encontraron productos.</p>';
        return;
    }

    let html = "";
    for (let i = 0; i < productosActuales.length; i++) {
        html += productosActuales[i].renderCard();
    }
    contenedor.innerHTML = html;

    // Volvemos a enganchar los botones cada vez que se dibuja la lista.
    // querySelectorAll() busca TODOS los elementos que tengan esa clase CSS.
    let botonesAgregar = document.querySelectorAll(".btn-agregar");
    for (let i = 0; i < botonesAgregar.length; i++) {
        botonesAgregar[i].addEventListener("click", function () {
            // this.dataset.id lee el atributo data-id="..." que pusimos en el HTML del boton
            agregarAlCarrito(this.dataset.id);
        });
    }

    let botonesEditar = document.querySelectorAll(".btn-editar");
    for (let i = 0; i < botonesEditar.length; i++) {
        botonesEditar[i].addEventListener("click", function () {
            editarProducto(this.dataset.id);
        });
    }

    let botonesEliminar = document.querySelectorAll(".btn-eliminar");
    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", function () {
            eliminarProducto(this.dataset.id);
        });
    }
}

function agregarAlCarrito(id) {
    // Number(id) convierte el string que viene de dataset.id (siempre es texto) a número,
    // para poder compararlo con p.id que si es número.
    let producto = productosActuales.find(p => p.id === Number(id));
    if (producto) {
        carrito.agregar(producto);
        mostrarCarrito();
    }
}

async function crearProducto(evento) {
    evento.preventDefault();

    let nombre = document.getElementById("nuevo-nombre").value;
    let precio = parseFloat(document.getElementById("nuevo-precio").value);
    let stock = parseInt(document.getElementById("nuevo-stock").value);
    let categoria = document.getElementById("nuevo-categoria").value;

    let respuesta = await fetch(API_URL + "/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // JSON.stringify() convierte el objeto de JS en texto JSON para poder enviarlo por HTTP
        body: JSON.stringify({ nombre: nombre, precio: precio, stock: stock, categoria: categoria }),
    });

    // respuesta.ok es true si el servidor contesto con un código 200-299 (éxito)
    if (!respuesta.ok) {
        alert("Error al crear el producto.");
        return;
    }

    document.getElementById("form-nuevo-producto").reset();
    // getInstance() recupera el modal de Bootstrap ya abierto para poder cerrarlo por código
    bootstrap.Modal.getInstance(document.getElementById("modal-nuevo-producto")).hide();
    cargarProductos();
}

async function editarProducto(id) {
    // find(): tomamos el estado ANTERIOR del producto antes de tocarlo
    let producto = productosActuales.find(p => p.id === Number(id));
    if (!producto) return;

    let precioAnterior = producto.precio;
    // prompt() abre una cajita para que el usuario escriba un valor.
    // Devuelve null si el usuario le da "Cancelar".
    let entrada = prompt("Nuevo precio para " + producto.nombre + " (actual: $" + precioAnterior + ")", precioAnterior);
    if (entrada === null) return;

    let precioNuevo = parseFloat(entrada);
    // isNaN() ("is Not a Number") detecta si la conversión fallo, ej. si el usuario escribio texto
    if (isNaN(precioNuevo) || precioNuevo < 0) {
        alert("Precio inválido.");
        return;
    }

    // Mensaje de confirmacion mostrando el valor anterior y el nuevo
    let confirmacion = confirm(
        "Vas a cambiar el precio de " + producto.nombre + "\n" +
        "Precio anterior: $" + precioAnterior + "\n" +
        "Precio nuevo: $" + precioNuevo + "\n\n" +
        "¿Confirmar el cambio?"
    );
    if (!confirmacion) return;

    let respuesta = await fetch(API_URL + "/productos/actualizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: producto.id, precio: precioNuevo }),
    });

    if (!respuesta.ok) {
        alert("Error al actualizar el producto.");
        return;
    }

    cargarProductos();
}

async function eliminarProducto(id) {
    let confirmacion = confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmacion) return;

    let respuesta = await fetch(API_URL + "/productos/" + id, { method: "DELETE" });
    // Nota: en DELETE no mandamos "body" ni headers de JSON porque el id ya va en la URL
    if (!respuesta.ok) {
        alert("Error al eliminar el producto.");
        return;
    }

    cargarProductos();
}

// CLIENTES 

async function cargarClientes() {
    let respuesta = await fetch(API_URL + "/clientes");
    let datos = await respuesta.json();

    let clientes = [];
    for (let i = 0; i < datos.length; i++) {
        clientes.push(Cliente.crearDesdeObjeto(datos[i]));
    }

    let cuerpoTabla = document.getElementById("tabla-clientes-body");

    if (clientes.length === 0) {
        cuerpoTabla.innerHTML = '<tr><td colspan="5" class="text-muted text-center">Sin clientes registrados.</td></tr>';
        return;
    }

    let html = "";
    for (let i = 0; i < clientes.length; i++) {
        html += clientes[i].renderFila();
    }
    cuerpoTabla.innerHTML = html;

    let botonesEditar = document.querySelectorAll(".btn-editar-cliente");
    for (let i = 0; i < botonesEditar.length; i++) {
        botonesEditar[i].addEventListener("click", function () {
            editarEdadCliente(this.dataset.id, clientes);
        });
    }

    let botonesEliminar = document.querySelectorAll(".btn-eliminar-cliente");
    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", function () {
            eliminarCliente(this.dataset.id);
        });
    }
}

async function editarEdadCliente(id, clientes) {
    let cliente = clientes.find(c => c.id === Number(id));
    if (!cliente) return;

    let edadAnterior = cliente.edad;
    let entrada = prompt("Nueva edad para " + cliente.nombre + " (actual: " + edadAnterior + ")", edadAnterior);
    if (entrada === null) return;

    let edadNueva = parseInt(entrada);
    if (isNaN(edadNueva) || edadNueva < 0 || edadNueva > 99) {
        alert("La edad debe ser un entero entre 0 y 99.");
        return;
    }

    // Ejemplo del enunciado: mostrar edad anterior y edad nueva antes de aplicar el cambio
    let confirmacion = confirm(
        "Vas a cambiar la edad de " + cliente.nombre + "\n" +
        "Edad anterior: " + edadAnterior + "\n" +
        "Edad nueva: " + edadNueva + "\n\n" +
        "¿Confirmar el cambio?"
    );
    if (!confirmacion) return;

    let respuesta = await fetch(API_URL + "/clientes/actualizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cliente.id, edad: edadNueva }),
    });

    if (!respuesta.ok) {
        alert("Error al actualizar el cliente.");
        return;
    }

    cargarClientes();
}

async function eliminarCliente(id) {
    let confirmacion = confirm("¿Seguro que deseas eliminar este cliente?");
    if (!confirmacion) return;

    let respuesta = await fetch(API_URL + "/clientes/" + id, { method: "DELETE" });
    if (!respuesta.ok) {
        alert("Error al eliminar el cliente.");
        return;
    }

    cargarClientes();
}

// CARRITO 

function mostrarCarrito() {
    document.getElementById("contenedor-carrito").innerHTML = carrito.renderResumen();
    document.getElementById("contador-carrito").textContent = carrito.items.length;
}

// INICIO 

// Este bloque completo se ejecuta apenas el HTML termina de cargar
document.addEventListener("DOMContentLoaded", function () {
    // Proteccion simple: si no hay sesion iniciada, regresa al login
    if (sessionStorage.getItem("sesionActiva") !== "true") {
        window.location.href = "login.html";
        return;
    }

    cargarProductos();
    cargarClientes();

    document.getElementById("form-nuevo-producto").addEventListener("submit", crearProducto);

    // "input" se usa con cada tecla que el usuario presiona
    document.getElementById("buscar-nombre").addEventListener("input", filtrarProductos);
    document.getElementById("buscar-categoria").addEventListener("input", filtrarProductos);

    document.getElementById("btn-logout").addEventListener("click", function () {
        sessionStorage.removeItem("sesionActiva");
        window.location.href = "login.html";
    });
});
