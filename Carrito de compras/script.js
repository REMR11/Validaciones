const PRODUCT_INPUT = document.getElementById("productoInput");
const PRODUCT_FORM = document.getElementById("formularioProducto");
const PRODUCT_LIST_CONTAINER = document.getElementById("listaProductos");
const PRODUCT_COUNTER = document.getElementById("contador");
const PRODUCT_ITEM_TEMPLATE = document.getElementById("product-template");


let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

document.addEventListener('DOMContentLoaded', () => {
    cargarLista();
})

function renderItem(item) {
    const itemElement = PRODUCT_ITEM_TEMPLATE.content.cloneNode(true);
    const btnEliminar = itemElement.querySelector(".btn-delete");
    const itemTitle = itemElement.querySelector(".product-name");
    const itemCantidad = itemElement.querySelector(".product-quantity");

    console.log(item.id)
    itemElement.querySelector('.product').dataset.id = item.id; // Asignamos el id en data-id
    itemCantidad.innerText = item.cantidad;
    itemTitle.innerText = item.nombre;
    btnEliminar.title = `Eliminar ${item.nombre}`;
    btnEliminar.onclick = () => eliminarProducto(item.id);

    PRODUCT_LIST_CONTAINER.prepend(itemElement);
}

function updateCounter() {
    PRODUCT_COUNTER.textContent = `Total: ${carrito.length} producto${carrito.length !== 1 ? "s" : ""}`;
}

function cargarLista() {
    // console.log(carrito)
    carrito.forEach((producto) => {
        renderItem(producto)
    });
    updateCounter();
}

function actualizarCantidad(id, nuevaCantidad) {
    const itemElement = PRODUCT_LIST_CONTAINER.querySelector(`li[data-id="${id}"]`);
    if (itemElement) {
        const cantidadSpan = itemElement.querySelector(".product-quantity");
        cantidadSpan.innerText = nuevaCantidad;
        cantidadSpan.classList.add('animate');

        setTimeout(() => {
            cantidadSpan.classList.toggle('animate');
        }, 300)

    } else {
        console.log("no se encontro el elemento");
    }
}


function agregarProducto(event) {
    event.preventDefault();
    const formData = new FormData(PRODUCT_FORM);
    const data = Object.fromEntries(formData.entries());

    const producto = PRODUCT_INPUT.value.trim();
    const cantidad = Number(data["product-quantity"] ?? 1);

    if (!producto) {
        Toastify({
            text: "No se puede agregar un producto sin un nombre",
            duration: 3000,
            close: true,
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
        return;
    }

    if (isNaN(cantidad) || cantidad < 1) {
        Toastify({
            text: "La cantidad debe ser un número mayor a 0",
            duration: 3000,
            close: true,
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
        }).showToast();
        return;
    }
    const newProduct = { nombre: producto, id: crypto.randomUUID(), cantidad }

    const productoExistente = carrito.find((item) => item.nombre.toLowerCase() === producto.toLowerCase());


    if (productoExistente) {
        productoExistente.cantidad += cantidad;
        actualizarCantidad(productoExistente.id, productoExistente.cantidad);

    } else {
        carrito.push(newProduct);
        renderItem(newProduct);
    }
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    PRODUCT_INPUT.value = "";
    updateCounter();
}

function eliminarProducto(index) {
    const itemElement = document.querySelector(`li[data-id="${index}"]`);

    // Agregar clase de animación de salida
    itemElement.style.display = 'none';

    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
        carrito.splice(index, 1);
        sessionStorage.setItem("carrito", JSON.stringify(carrito));
        itemElement.remove();
        updateCounter();
    }, 300); // 300ms coincide con la duración de la animación CSS
}

function limpiarCarrito() {
    if (confirm("¿Deseas vaciar todo el carrito?")) {
        carrito = [];
        sessionStorage.removeItem("carrito");
        PRODUCT_LIST_CONTAINER.innerHTML = '';
        cargarLista();
    }
}

// window.onload = () => {
//     actualizarLista();
// };