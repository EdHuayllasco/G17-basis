/* datos.js — lo que la tienda decide por su cuenta: las categorías y sus etiquetas. */

export const categorias = ["laptops", "smartphones", "tablets", "mobile-accessories"];

/* El nombre que se ve, por cada valor que se usa. Un objeto y no un switch porque
   esto es una tabla de equivalencias, no una decisión: se consulta por su clave. */
export const etiquetaCategoria = {
  laptops: "Laptops",
  smartphones: "Teléfonos",
  tablets: "Tablets",
  "mobile-accessories": "Accesorios",
};

/* Cuántos productos hay de cada categoría.
   Un reduce cuyo acumulador es un OBJETO, no un número: por eso el valor inicial
   es {}. En cada vuelta devuelve una copia del acumulador con una propiedad más,
   y el nombre de esa propiedad sale de un dato, así que va entre corchetes:
   eso es un nombre de propiedad calculado. El `?? 0` cubre la primera vez que
   aparece una categoría, cuando todavía no existe esa cuenta. */
export const contarPorCategoria = (items) =>
  items.reduce((cuenta, { categoria }) => ({ ...cuenta, [categoria]: (cuenta[categoria] ?? 0) + 1 }), {});
