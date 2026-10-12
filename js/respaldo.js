/* respaldo.js — guarda y lee una copia del catálogo, para que la tienda
   siga funcionando si la API no responde. */

/* Clave propia, distinta de la del carrito. Son dos cosas distintas: el carrito es de
   la persona y el catálogo es de la tienda. Juntarlas haría que vaciar una borrara la
   otra. */
export const CLAVE_RESPALDO = "techcart_catalogo";

/* Guardar la instantánea. Se llama solo cuando la carga salió bien, así que lo que entra
   aquí ya pasó por el adaptador y tiene la forma que la tienda espera. */
export const guardarRespaldo = (productos) => {
  try {
    const copia = { fecha: new Date().toISOString(), productos };
    localStorage.setItem(CLAVE_RESPALDO, JSON.stringify(copia));
  } catch (error) {
    console.warn("No se pudo guardar la copia del catálogo:", error.message);
  }
};

/* Leer la instantánea. Devuelve `{ fecha, productos }` si hay algo que sirva, y `null`
   si no hay copia, si quedó vacía o si no se pudo leer.

   Las tres comprobaciones del medio no son manía: quien llama a esta función tiene que
   poder distinguir "hay copia" de "no hay copia", y una copia vacía o sin fecha es lo
   mismo que no tenerla. Devolver `null` en vez de un objeto a medias es lo que permite
   que `api.js` decida con un solo `if`. */
export const leerRespaldo = () => {
  try {
    const crudo = localStorage.getItem(CLAVE_RESPALDO);
    if (!crudo) return null;

    const { fecha, productos } = JSON.parse(crudo);
    if (!fecha) return null;
    if (!Array.isArray(productos) || productos.length === 0) return null;

    return { fecha, productos };
  } catch (error) {
    console.warn("La copia guardada del catálogo no se pudo leer:", error.message);
    return null;
  }
};
