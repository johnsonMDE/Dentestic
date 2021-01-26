class Carrito {

    //Se añaden productos
    comprarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            // si se presiona comprar, se almacenan los valores
            const producto = e.target.parentElement.parentElement;
            this.leerDatosProducto(producto);
        }
    }

    leerDatosProducto(producto) {
        const infoProducto = {
            producto: producto.querySelector('img').src,
            titulo: producto.querySelector('h4').textContent,
            precio: producto.querySelector('.precio span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(productoLS) {
            if (productoLS.id === infoProducto.id) {
                productosLS = productoLS.id;
            }
        });

        if (productosLS === infoProducto.id) {
            Swal.fire({
                type: 'info',
                title: 'Lo sentimos',
                text: 'El producto ya se encuentra agregado',
                showConfirmButton: false,
                timer: 1000
            })
        } else {
            this.insertarCarrito(infoProducto);
        }

    }

    //muestra producto seleccionado en carrito
    insertarCarrito(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.producto}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

    }

    //Para eliminar producto en el DOM
    eliminarProducto(e) {
        e.preventDefault();
        let producto, productoID;
        if (e.target.classList.contains('borrar-producto')) {
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();

    }


    vaciarCarrito(e) {
        e.preventDefault();
        while (listaProductos.firstChild) {
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();

        return false;
    }

    //Guardar en el LocalStorage
    guardarProductosLocalStorage(producto) {
        let productos;

        productos = this.obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
    }


    obtenerProductosLocalStorage() {
        let productoLS;

        if (localStorage.getItem('productos') === null) {
            productoLS = [];
        } else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    //productos guardados en el LocalStorage
    leerLocalStorage() {
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(producto) {

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.producto}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }


    leerLocalStorageCompra() {
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(producto) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.producto}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
                </td>
                <td id='subtotales'>${producto.precio * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:20px" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }


    eliminarProductoLocalStorage(productoID) {
        let productosLS;

        productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach(function(productoLS, index) {
            if (productoLS.id === productoID) {
                productosLS.splice(index, 1);
            }
        });


        //Para actualizar LS
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Eliminar todos los datos en LocalStorage
    vaciarLocalStorage() {
        localStorage.clear();
    }

    //Procesamiento de compras
    procesarPedido(e) {
        e.preventDefault();

        if (this.obtenerProductosLocalStorage().length === 0) {
            Swal.fire({
                type: 'error',
                title: 'Error',
                text: 'El carrito está vacío, agrega algún producto para comprar',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            location.href = "compra.html";
        }
    }

    //Calcular costes
    calcularTotal() {
        let productosLS;
        let total = 0,
            IVA = 0,
            subtotal = 0;
        productosLS = this.obtenerProductosLocalStorage();
        for (let i = 0; i < productosLS.length; i++) {
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = total + element;

        }

        IVA = parseFloat(total * 0.19).toFixed(2);
        subtotal = parseFloat(total - IVA).toFixed(2);

        document.getElementById('subtotal').innerHTML = "$ " + subtotal;
        document.getElementById('IVA').innerHTML = "$ " + IVA;
        document.getElementById('total').value = "$ " + total.toFixed(2);
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function(productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].precio);
                }
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));

        } else {
            console.log("click afuera");
        }
    }
}

//NO OLOVIDAR MAILJS