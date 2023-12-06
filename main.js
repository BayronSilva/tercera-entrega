document.addEventListener("DOMContentLoaded", function () {
    // Para recuperar carrito almacenado en el localStorage o iniciar un carrito vacío
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Elementos del DOM
    const carritoContainer = document.querySelector(".carrito-items");
    const carritoPrecioTotal = document.querySelector(".carrito-precio-total");
    const botonLimpiarCarrito = document.querySelector(".btn-limpiar-carrito");
    const botonPagar = document.querySelector(".btn-pagar");

    // Función para buscar los servicios en la barra de busqueda
    function buscarServicio() {
        const inputBusqueda = document.getElementById("inputBusqueda");

        inputBusqueda.addEventListener("input", function () {
            const textoBusqueda = inputBusqueda.value.toLowerCase();
            const servicios = document.querySelectorAll(".contenedor-servicios > div");

            servicios.forEach(function (servicio) {
                const nombreServicio = servicio.querySelector("h3").innerText.toLowerCase();

                // Operador ternario para establecer la propiedad display
                servicio.style.display = nombreServicio.includes(textoBusqueda) ? "block" : "none";
            });
        });
    }

    // Función para agregar un servicio al carrito
    function agregarAlCarrito(id, nombre, precio) {
        const servicioEnCarrito = carrito.find(function (item) {
            return item.id === id;
        });

        if (servicioEnCarrito) {
            servicioEnCarrito.cantidad++;
        } else {
            carrito.push({
                id: id,
                nombre: nombre,
                precio: precio,
                cantidad: 1,
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Configurar botones de agregar servicio
    function configurarBotonesAgregar() {
        const botonesAgregar = document.querySelectorAll(".btn-agregar");

        botonesAgregar.forEach(function (boton) {
            boton.onclick = () => {
                const id = boton.id;
                const nombre = boton.parentElement.querySelector("h3").innerText;
                const precio = parseFloat(boton.parentElement.querySelector("span").innerText.replace("$", ""));

                agregarAlCarrito(id, nombre, precio);
            
            }
        });
    }

    // Función para actualizar la interfaz del carrito
    function actualizarCarrito() {
        carritoContainer.innerHTML = "";

        let total = 0;

        carrito.forEach(function (item) {
            const divItem = document.createElement("div");
            divItem.classList.add("carrito-item");

            const header = document.createElement("div");
            header.classList.add("carrito-item-header");

            // Crear nombre del servicio en el carrito
            const nombre = document.createElement("p");
            nombre.classList.add("carrito-item-nombre");
            nombre.innerText = item.nombre;
            header.appendChild(nombre);

            divItem.appendChild(header);

            // Para crear selector de cantidad
            const cantidad = document.createElement("div");
            cantidad.classList.add("selector-cantidad");

            // Para crear botón para restar cantidad
            const botonRestar = document.createElement("button");
            botonRestar.classList.add("btn-restar");
            botonRestar.innerText = "-";
            botonRestar.onclick = () => {
                restarDelCarrito(item.id)
            }
            cantidad.appendChild(botonRestar);

            // Para crear span para mostrar cantidad
            const cantidadTexto = document.createElement("span");
            cantidadTexto.classList.add("carrito-item-cantidad");
            cantidadTexto.innerText = item.cantidad;
            cantidad.appendChild(cantidadTexto);

            // Para crear botón para sumar cantidad
            const botonSumar = document.createElement("button");
            botonSumar.classList.add("btn-sumar");
            botonSumar.innerText = "+";
            botonSumar.onclick = () => {
                sumarAlCarrito(item.id)
            }
            cantidad.appendChild(botonSumar);

            divItem.appendChild(cantidad);

            // Para crear precio del servicio en el carrito, en pesos chilenos
            const precioItem = document.createElement("p");
            precioItem.classList.add("carrito-item-precio");
            precioItem.innerText = "$" + (item.precio * item.cantidad).toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            divItem.appendChild(precioItem);

            // Para crear botón de eliminar servicio del carrito
            const botonEliminar = document.createElement("button");
            botonEliminar.classList.add("btn-eliminar");
            botonEliminar.innerHTML = '<img src="./img/eliminar_icono.png" alt="Eliminar">';
            botonEliminar.onclick = () => {
                eliminarDelCarrito(item.id);
            }
            divItem.appendChild(botonEliminar);

            carritoContainer.appendChild(divItem);

            total += item.precio * item.cantidad;
        });

        // Actualizar el precio total del carrito, pesos chilenos
        carritoPrecioTotal.innerText = "$" + total.toLocaleString("es-CL", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    // Función para restar cantidad de un servicio en el carrito
    function restarDelCarrito(id) {
        const servicioEnCarrito = carrito.find(function (item) {
            return item.id === id;
        });

        if (servicioEnCarrito) {
            servicioEnCarrito.cantidad--;

            if (servicioEnCarrito.cantidad === 0) {
                eliminarDelCarrito(id);
            }
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Función para sumar cantidad de un servicio en el carrito
    function sumarAlCarrito(id) {
        const servicioEnCarrito = carrito.find(function (item) {
            return item.id === id;
        });

        if (servicioEnCarrito) {
            servicioEnCarrito.cantidad++;
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Función para eliminar un servicio del carrito
    function eliminarDelCarrito(id) {
        const index = carrito.findIndex(function (item) {
            return item.id === id;
        });

        if (index !== -1) {
            carrito.splice(index, 1);
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    // Función para limpiar todo el carrito
    function limpiarCarrito() {
        carrito.length = 0;
        localStorage.removeItem("carrito");
        actualizarCarrito();
    }

    // Función para mostrar el mensaje final al pagar
    function mostrarMensajeGracias() {
        if (carrito.length > 0) {
            abrirModal();
            limpiarCarrito();
        } else {
            // Mostrar mensaje de que no hay servicios en el carrito
            alert("No tienes servicios en el carrito.");
        }
    }

    // Evento click para limpiar el carrito
    botonLimpiarCarrito.addEventListener("click", limpiarCarrito);

    // Evento click para mostrar mensaje de agradecimiento y formulario de contacto
    botonPagar.addEventListener("click", mostrarMensajeGracias);

    // Lamado de funciones
    buscarServicio();
    configurarBotonesAgregar();
    actualizarCarrito();
});

function abrirModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "block";
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}