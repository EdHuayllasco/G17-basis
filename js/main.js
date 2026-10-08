import { agregarAlCarrito, faltaParaEnvioGratis, guardarCarrito, leerCarrito, olvidarCarrito, quitarDelCarrito, resumenCarrito } from "./carrito.js";
import {productos } from "./datos.js";
import formatearPrecio from "./formato.js";
import { ENVIO_GRATIS_DESDE } from "./tienda.js";
import { filaCarrito, tarjetaProducto } from "./ui.js";

const resumenCabecera = document.querySelector('#resumen-carrito');
const listaCarrito = document.querySelector('#lista-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const barraEnvio = document.querySelector('#barra-envio');
const mensajeEnvio = document.querySelector('#mensaje-envio');
const botonVaciar = document.querySelector('#vaciar');
const grillaCatalogo = document.querySelector("#catalogo-grid");

const pintarCatalogo = (lista = productos) => {
    const html = lista.map(tarjetaProducto).join("");
    grillaCatalogo.innerHTML="";
    grillaCatalogo.insertAdjacentHTML("beforeEnd", html);

    grillaCatalogo.setAttribute("aria-label", `Catalogo con ${lista.length} productos`);
}
let carrito = leerCarrito();

const pintarCarrito = () => {
    const {unidades, subTotal, igv, envio, total}= resumenCarrito(carrito);
    resumenCabecera.textContent = unidades === 0 ? "Carrito vacio" : `${unidades} producto(s) - ${formatearPrecio(total)}`;
    listaCarrito.innerHTML = carrito.map(filaCarrito).join("");
    totalCarrito.textContent = unidades === 0 ? "Todavia no agregaste nada." : 
        `Subtotal ${formatearPrecio(subTotal)} - IGV ${formatearPrecio(igv)} - ` +
        `Envio ${formatearPrecio(envio)} - Total ${formatearPrecio(total)}`;
    botonVaciar.classList.toggle("hidden", unidades === 0);
    const avance = Math.min((subTotal/ ENVIO_GRATIS_DESDE) * 100, 100);
    barraEnvio.style.width = `${avance}%`

    const falta = faltaParaEnvioGratis(subTotal);
    mensajeEnvio.textContent = falta === 0 ? "Tu pedido ya tiene envio gratis." : `Te faltan ${formatearPrecio(falta)} para el envio gratis.`;
}

grillaCatalogo.addEventListener('click', (evento) => {
    const boton = evento.target.closest("button[data-accion='agregar']");
    if(!boton) return;

    const id = Number(boton.dataset.id);
    const producto = productos.find( p => p.id === id);
    if(!producto) return;

    carrito = agregarAlCarrito(carrito , producto);
    guardarCarrito(carrito);
    pintarCarrito();
});

listaCarrito.addEventListener('click', (evento) => {
    const boton = evento.target.closest("button[data-accion='quitar']");
    if(!boton) return;

    carrito = quitarDelCarrito(carrito, Number(boton.dataset.posicion));
    guardarCarrito(carrito);
    pintarCarrito();
});

botonVaciar.addEventListener('click', () => {
    carrito = [];
    olvidarCarrito();
    pintarCarrito();
})

const formularioCompra = document.querySelector('#form-compra');
const estadoPedido = document.querySelector('#estado-pedido');

const mostrarAviso = (mensaje, esError) => {
    estadoPedido.querySelector("p")?.remove();
    const aviso = document.createElement("p");
    aviso.textContent = mensaje;
    aviso.classList.add("font-semibold", esError ? "text-error" : "text-exito");
    estadoPedido.append(aviso);
}

formularioCompra.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if(!formularioCompra.checkValidity()){
        formularioCompra.reportValidity();
        mostrarAviso("Faltan datos por completar. Revisa los campos marcados", true);
        return;
    }

    if(carrito.length === 0 ) {
        mostrarAviso("Tu carrito esta vacio: Agrega al menos un producto antes de confirmar.", true);
        return;
    }

    const datos = new FormData(formularioCompra);
    const nombre = datos.get("nombre");
    const unidades = Number(formularioCompra.elements.cantidad.value);
    const {total} = resumenCarrito(carrito);

    mostrarAviso(
        `
        Gracias, ${nombre}. Tu pedido de ${carrito.length} producto(s) y ${unidades} unidad(es) 
        ` + 
        `por ${formatearPrecio(total)} quedo registrado.`, false
    );
    formularioCompra.reset();

})
pintarCatalogo();
pintarCarrito();