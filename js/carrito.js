/* carrito.js — las reglas del carrito: agregar, cambiar cantidades, quitar
   y calcular totales. Ninguna línea de aquí toca la página. */

import { IGV, ENVIO_GRATIS_DESDE, costoDeEnvio } from "./tienda.js";

/* La clave con la que el carrito vive en el navegador. En una constante y no escrita a
   mano en cada llamada: si en un lugar se escribe distinto, el carrito "se pierde" sin
   que aparezca ningún error. */
export const CLAVE_CARRITO = "techcart_carrito";

const sumarLinea = (lineas, producto, cuantas) => {
  const existente = lineas.find(({ id }) => id === producto.id);

  if (!existente) {
    return [...lineas, { ...producto, cantidad: cuantas }];
  }

  return lineas.map((linea) =>
    linea.id === producto.id ? { ...linea, cantidad: linea.cantidad + cuantas } : linea,
  );
};

/* Agregar desde el catálogo: siempre una unidad. */
export const agregarAlCarrito = (carrito, producto) => sumarLinea(carrito, producto, 1);

/* Subir o bajar la cantidad de UNA línea. `paso` vale 1 o -1 y es un parámetro para no
   escribir dos funciones casi iguales.

   El `filter` del final es lo que hace que el botón de menos no necesite ningún `if`:
   si la cantidad quedó en cero, la línea sale. Bajar hasta cero es quitar, y esa regla
   está escrita una sola vez. */
export const cambiarCantidad = (carrito, id, paso) =>
  carrito
    .map((linea) => (linea.id === id ? { ...linea, cantidad: linea.cantidad + paso } : linea))
    .filter(({ cantidad }) => cantidad > 0);

export const quitarDelCarrito = (carrito, id) => carrito.filter((linea) => linea.id !== id);

export const resumenCarrito = (carrito) => {
  const unidades = carrito.reduce((suma, { cantidad }) => suma + cantidad, 0);
  const subtotal = carrito.reduce((suma, { precio, cantidad }) => suma + precio * cantidad, 0);
  const igv = subtotal * IGV;
  // Un carrito vacío no paga envío: sin pedido no hay despacho que cobrar.
  const envio = unidades === 0 ? 0 : costoDeEnvio(subtotal);
  return { unidades, subtotal, igv, envio, total: subtotal + igv + envio };
};

/* Cuánto falta para que el envío salga gratis. Nunca menos de cero. */
export const faltaParaEnvioGratis = (subtotal) => Math.max(ENVIO_GRATIS_DESDE - subtotal, 0);

/* ============================================================
   EL CARRITO GUARDADO EN EL NAVEGADOR

   localStorage guarda solo CADENAS. Un arreglo de objetos hay que convertirlo a texto
   con JSON.stringify al guardar, y volverlo a objeto con JSON.parse al leer.

   Las tres funciones van envueltas en try/catch, y no por prolijidad: `setItem` lanza
   excepción cuando el almacenamiento está lleno y en algunos navegadores en modo
   privado, y `JSON.parse` lanza excepción cuando lo guardado quedó a medias o lo
   escribió una versión anterior de la tienda. Sin el try/catch, eso deja la página en
   blanco para esa persona y en ninguna otra máquina se puede reproducir.
   ============================================================ */

export const guardarCarrito = (carrito) => {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    console.warn("No se pudo guardar el carrito:", error.message);
  }
};

const agruparLineas = (guardado) =>
  guardado.reduce((lineas, linea) => sumarLinea(lineas, linea, linea.cantidad ?? 1), []);

export const leerCarrito = () => {
  try {
    const crudo = localStorage.getItem(CLAVE_CARRITO);
    return crudo ? agruparLineas(JSON.parse(crudo)) : [];
  } catch (error) {
    console.warn("El carrito guardado no se pudo leer, empiezo vacío:", error.message);
    return [];
  }
};

export const olvidarCarrito = () => {
  try {
    localStorage.removeItem(CLAVE_CARRITO);
  } catch (error) {
    console.warn("No se pudo borrar el carrito guardado:", error.message);
  }
};
