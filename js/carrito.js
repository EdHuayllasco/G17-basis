import {IGV, ENVIO_GRATIS_DESDE, costoDeEnvio, sumar} from "./tienda.js";
export const agregarAlCarrito = (carrito, producto) => [...carrito, producto];
export const quitarDelCarrito = (Carrito, posicion) => carrito.filter((producto, i) => i !== posicion);
