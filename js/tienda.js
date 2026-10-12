/* tienda.js — las cuentas y los filtros: impuesto, envío, descuento,
   filtrar por categoría y buscar por texto. No sabe de dónde salen los productos. */

import { etiquetaCategoria } from "./datos.js";

export const IGV = 0.18;
export const ENVIO_GRATIS_DESDE = 50;

/* El valor que significa "no hay filtro puesto". En una constante y no escrito a mano
   en cada comparación: si en un sitio dice "todas" y en otro "Todas", el filtro deja
   de funcionar sin que aparezca ningún error. */
export const TODAS = "todas";

/* El precio con IGV. Escrita como flecha de una línea. */
export const precioConIgv = (precio) => precio * (1 + IGV);

export function tarifaPorZona(zona) {
  switch (zona) {
    case "Lima":
      return 0;
    case "Resto del Perú":
      return 9.9;
    case "Internacional":
      return 29.9;
    default:
      return 9.9;
  }
}

export const filtrarPorCategoria = (items, categoria) =>
  categoria === TODAS ? items : items.filter((producto) => producto.categoria === categoria);

export const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const buscar = (items, texto) => {
  const buscado = normalizar(texto.trim());
  if (buscado === "") return items;

  return items.filter(({ nombre, marca, categoria }) =>
    normalizar(`${nombre} ${marca} ${etiquetaCategoria[categoria] ?? categoria}`).includes(buscado),
  );
};

/* El más caro: un reduce cuyo acumulador no es un número, es un producto. */
export const masCaroDe = (items) =>
  items.reduce((mayor, p) => (p.precio > mayor.precio ? p : mayor), items[0]);

/* Agregar un producto SIN tocar el arreglo original: se devuelve uno nuevo con todo lo
   que había dentro más el nuevo al final. Es el reemplazo de push. */
export const agregarProducto = (items, nuevo) => [...items, nuevo];

/* Actualizar un objeto sin tocar el original: se copian todas sus propiedades y después
   se pisa la que cambia. Gana la última que se escribe, así que el spread va primero.
   Los paréntesis alrededor de las llaves son obligatorios: sin ellos JavaScript leería
   el `{` como el cuerpo de la función. */
export const actualizarPrecio = (producto, precio) => ({ ...producto, precio });

/* Parámetro rest: los mismos tres puntos, pero en la declaración. Junta todos los
   argumentos sueltos que lleguen en un arreglo. */
export const sumar = (...precios) => precios.reduce((suma, n) => suma + n, 0);

/* Parámetro con valor por defecto: si no me pasan el porcentaje, vale 10. El valor por
   defecto entra solo cuando el argumento falta o vale undefined; un 0 que llegue de
   verdad se respeta, y esa es la diferencia con el viejo `porcentaje || 10`. */
export const conDescuento = (precio, porcentaje = 10) => precio - precio * (porcentaje / 100);

export const costoDeEnvio = (total, zona = "Resto del Perú") =>
  total >= ENVIO_GRATIS_DESDE ? 0 : tarifaPorZona(zona);

/* El resumen del catálogo. Devuelve un objeto con propiedades abreviadas: cuando la
   propiedad se va a llamar igual que la variable, se escribe una sola vez. */
export const resumenTienda = (items) => {
  const disponibles = items.filter(({ stock }) => stock > 0);
  const agotados = items.length - disponibles.length;
  const valorCatalogo = sumar(...items.map(({ precio }) => precio));
  const valorInventario = items.reduce((suma, { precio, stock }) => suma + precio * stock, 0);
  const { nombre: masCaro } = masCaroDe(items);
  return {
    productos: items.length,
    disponibles: disponibles.length,
    agotados,
    valorCatalogo,
    valorInventario,
    masCaro,
  };
};
