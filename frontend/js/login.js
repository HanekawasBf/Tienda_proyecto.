/*
Modulo exclusivo para la pantalla de login. Separado del resto de la logica
*/

class Usuario {
    constructor(usuario, password) {
        this.usuario = usuario;
        this.password = password;
    }
}

const USUARIO_VALIDO = new Usuario("admin", "1234");

function manejarLogin(evento) {
    // evita que el formulario recargue la pagina al enviarse
    evento.preventDefault();

    const usuarioInput = document.getElementById("usuario").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const alerta = document.getElementById("login-alerta");

    const intento = new Usuario(usuarioInput, passwordInput);

    if (intento.usuario === USUARIO_VALIDO.usuario && intento.password === USUARIO_VALIDO.password) {
        // sessionStorage guarda datos en el navegador mientras la pestaña este abierta
        // (se borra al cerrarla). Lo usamos como "bandera" de que ya inicio sesion.
        sessionStorage.setItem("sesionActiva", "true");
        window.location.href = "index.html";
    } else {
        alerta.textContent = "Usuario o contraseña incorrectos.";
        alerta.classList.remove("d-none"); // le quita la clase que lo tenía oculto, así se muestra
    }
}

// DOMContentLoaded se dispara cuando el HTML ya esta completamente cargado.
// Sin esto, el script podria ejecutarse antes de que exista "form-login" en la pagina.
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-login");
    formulario.addEventListener("submit", manejarLogin);
});
