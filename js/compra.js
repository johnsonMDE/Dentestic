const compra = new Carrito();
const listaCompra = document.querySelector("#lista-compra tbody");
const carrito = document.getElementById('carrito');
const procesarCompraBtn = document.getElementById('procesar-compra');
const cliente = document.getElementById('cliente');
const correo = document.getElementById('correo');


cargarEventos();

function cargarEventos() {
    document.addEventListener('DOMContentLoaded', compra.leerLocalStorageCompra());


    carrito.addEventListener('click', (e) => { compra.eliminarProducto(e) });

    compra.calcularTotal();


    procesarCompraBtn.addEventListener('click', procesarCompra);

    carrito.addEventListener('change', (e) => { compra.obtenerEvento(e) });
    carrito.addEventListener('keyup', (e) => { compra.obtenerEvento(e) });

}

function procesarCompra() {
    // e.preventDefault();
    if (compra.obtenerProductosLocalStorage().length === 0) {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'No hay productos, selecciona alguno',
            showConfirmButton: false,
            timer: 2000
        }).then(function() {
            window.location = "index.html";
        })
    } else if (cliente.value === '' || correo.value === '') {
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Ingrese todos los campos requeridos',
            showConfirmButton: false,
            timer: 2000
        })
    } else {



        // EMAIL JS

        (function() {
            emailjs.init("service_do3fcfe");
        })();

        let cadena = "";
        productosLS = compra.obtenerProductosLocalStorage();
        productosLS.forEach(function(producto) {
            cadena += `
                 Producto : ${producto.titulo}
                 Precio : ${producto.precio}
                 Cantidad: ${producto.cantidad}
                 
                `;
        });
        document.getElementById('detalleCompra').innerHTML = cadena;
        /* ------------------------- */

        var myform = $("form#procesar-pago");

        myform.submit((event) => {
            event.preventDefault();

            var service_id = "default_service";
            var template_id = "template_3SA9LsqQ";

            const cargandoGif = document.querySelector('#cargando');
            cargandoGif.style.display = 'block';

            const enviado = document.createElement('img');
            enviado.src = 'img/mail.gif';
            enviado.style.display = 'block';
            enviado.width = '150';

            emailjs.sendForm(service_id, template_id, myform[0])
                .then(() => {
                    cargandoGif.style.display = 'none';
                    document.querySelector('#loaders').appendChild(enviado);

                    setTimeout(() => {
                        compra.vaciarLocalStorage();
                        enviado.remove();
                        window.location = "index.html";
                    }, 2000);


                }, (err) => {
                    alert("Error al enviar el email\r\n Response:\n " + JSON.stringify(err));
                    myform.find("button").text("Send");
                });

            return false;

        });

    }
}