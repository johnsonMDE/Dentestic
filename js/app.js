function citas() {
    document.getElementById("actividad").innerHTML = "Cita agendada exitosamente";
}

function muestraMensaje1() {
    alert('Sistema de PQR proximamente disponible');
}

function muestraMensaje2() {
    alert('Este teléfono NO existe');
}

function muestraMensaje3() {
    alert("Pronto disponible");
}

function muestraMensaje4() {
    alert("Lo sentimos, esta sección estará muy pronto disponible");
}

function Reacciona(campo) {
    alert("¡Introduzca un valor!")
    campo.focus()
}

function guardarDatos() {
    localStorage.nombre = document.getElementById("nombre").value;
    localStorage.password = document.getElementById("password").value;
}

function recuperarDatos() {
    if ((localStorage.nombre != undefined) && (localStorage.password != undefined)) {
        document.getElementById("datos").innerHTML = "Nombre: " + localStorage.nombre +
            " Password: " + localStorage.password;
    } else {
        document.getElementById("datos").innerHTML = "No has introducido tu nombre y tu password";
    }
}