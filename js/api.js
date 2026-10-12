/* api.js — habla con la API, traduce lo que llega al formato de la tienda
   y, si la API falla, sirve la copia guardada. */

import { categorias } from "./datos.js";
import { guardarRespaldo, leerRespaldo } from "./respaldo.js";

/* La dirección base, en una constante. Si mañana la tienda cambia de servidor, se
   cambia esta línea y nada más. */
const BASE = "https://dummyjson.com";

/* Cuánto estamos dispuestos a esperar. Pasado ese tiempo la petición se cancela sola
   y el `await` lanza un error, que el catch convierte en el camino del respaldo. Sin
   esto, una red que se queda a medias deja el "Cargando…" puesto para siempre. */
const ESPERA_MAXIMA = 8000;

const mapearProducto = (p) => ({
  id: p.id,
  nombre: p.title,
  marca: p.brand ?? "Sin marca",
  precio: p.price ?? 0,
  categoria: p.category,
  stock: p.stock ?? 0,
  destacado: (p.rating ?? 0) >= 4.9,
  imagen: p.thumbnail,
  alt: p.title,
});

/* ============================================================
   UNA PETICIÓN, CON SUS TRES FALLOS CUBIERTOS

   Los tres se ven distintos y hay que tratarlos distinto:

     1) No se pudo hablar con el servidor (sin internet, dominio caído, petición
        cancelada por el tiempo). Ese es el ÚNICO caso en que `fetch` rechaza solo:
        el `await` lanza y la función termina aquí.
     2) Se habló, pero la respuesta no es correcta: un 404, un 500. `fetch` lo da por
        bueno, así que el `if (!respuesta.ok)` y el `throw` son nuestros.
     3) Se habló, la respuesta es correcta… y adentro no viene lo que esperábamos.
        También es nuestro trabajo mirarlo, porque `datos.products` en `undefined`
        revienta dos líneas después, lejos de la causa.
   ============================================================ */
const pedirCategoria = async (categoria) => {
  const respuesta = await fetch(`${BASE}/products/category/${categoria}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(ESPERA_MAXIMA),
  });

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status} al pedir ${categoria}.`);
  }

  // .json() lee el cuerpo de la respuesta y lo convierte en objetos. También tarda,
  // también devuelve una promesa, y por eso también lleva await.
  const datos = await respuesta.json();

  if (!Array.isArray(datos.products)) {
    throw new Error(`La respuesta de ${categoria} no trae la lista de productos.`);
  }

  return datos.products.map(mapearProducto);
};

export const obtenerProductos = async () => {
  try {
    const listas = await Promise.all(categorias.map(pedirCategoria));
    const productos = listas.flat();

    guardarRespaldo(productos);
    return { productos, origen: "api", fecha: null };
  } catch (error) {
    const copia = leerRespaldo();
    if (!copia) throw error;

    // console.warn y no console.error: no se cayó nada. La tienda está de pie y
    // mostrando datos buenos, solo que no son de este minuto.
    console.warn("La tienda no respondió, muestro el catálogo guardado:", error.name, "·", error.message);
    return { productos: copia.productos, origen: "respaldo", fecha: copia.fecha };
  }
};
