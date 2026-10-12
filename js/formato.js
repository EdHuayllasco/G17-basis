/* formato.js — deja un precio o una fecha listos para mostrarlos. */

export const MONEDA = "$";

const formatearPrecio = (precio) => `${MONEDA}${precio.toFixed(2)}`;

/* Una fecha guardada (texto ISO) convertida a algo que se lee en voz alta.
   `new Date(texto)` vuelve a armar la fecha, y `toLocaleString` la escribe en el
   idioma y el formato que se le pidan: "9 de octubre de 2026, 14:30". Es de la misma
   familia de herramientas del navegador que usan las tiendas para los precios y los
   números, y existe justamente para no armar estos textos a mano. */
export const formatearFecha = (iso) =>
  new Date(iso).toLocaleString("es-PE", { dateStyle: "long", timeStyle: "short" });

export default formatearPrecio;
