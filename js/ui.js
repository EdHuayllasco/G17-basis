/* ui.js — arma el HTML de cada pieza visible. No decide nada:
   recibe datos y devuelve elementos listos para poner en la página. */

import formatearPrecio from "./formato.js";

const CLASES_TARJETA =
  "tarjeta group flex flex-col text-center " +
  "transition-[transform,box-shadow] duration-200 " +
  "hover:-translate-y-1 hover:shadow-lg dark:hover:ring-1 dark:hover:ring-marca " +
  "animate-aparecer motion-reduce:transition-none motion-reduce:animate-none";

const CLASES_DESTACADA =
  "justify-center bg-resalte border-marca border-2 md:col-span-2 md:row-span-2 " +
  "before:content-['Destacado'] before:inline-block before:self-center " +
  "before:text-marca before:text-xs before:font-bold before:uppercase before:tracking-wider " +
  "before:border before:border-marca before:rounded-full before:px-2.5 before:py-0.5 before:mb-2 " +
  "before:animate-latido motion-reduce:before:animate-none";

export const tarjetaProducto = ({ id, nombre, marca, precio, stock, destacado, imagen, alt }) => `
  <article class="${CLASES_TARJETA} ${destacado ? CLASES_DESTACADA : ""}" data-id="${id}">
    <figure class="mb-3">
      ${imagen
        ? `<img class="${destacado ? "w-full max-w-75 " : ""}aspect-square object-contain dark:brightness-90"
                src="${imagen}" alt="${alt}" width="200" />`
        : `<div class="w-full aspect-square grid place-items-center text-5xl bg-fondo rounded-lg"
                aria-hidden="true">📦</div>`}
      <figcaption class="text-xs font-semibold text-texto-suave uppercase tracking-wide">${marca}</figcaption>
    </figure>
    <h3 class="text-lg leading-tight my-1 group-hover:text-marca">${nombre}</h3>
    <p class="mb-3"><strong class="text-exito">${formatearPrecio(precio)}</strong></p>
    <button class="boton self-center ${destacado ? "mt-4" : "mt-auto"}" type="button"
            data-accion="agregar" data-id="${id}"
            aria-label="Agregar ${nombre} al carrito" ${stock === 0 ? "disabled" : ""}>
      ${stock > 0 ? "Agregar al carrito" : "Agotado"}
    </button>
  </article>
`;

/* Un botón del filtro. Recibe el VALOR (el que usa el código), la ETIQUETA (la que lee
   la persona) y cuántos productos hay detrás.

   Es un <button> y no un enlace, y la diferencia no es de gusto: un enlace existe para
   llevarte a otro sitio, y esto no lleva a ningún sitio, cambia lo que se ve en este.
   Con un <a href="#"> habría que escribir `preventDefault` para que el navegador no
   salte al tope de la página; con un <button type="button"> no hay nada que cancelar, y
   además se alcanza con el tabulador de fábrica.

   `aria-pressed` es lo que convierte la negrita en información: dice si este botón está
   apretado o no, y un lector de pantalla lo anuncia. Lo visual y lo anunciado salen del
   MISMO dato, así que no pueden contradecirse. */
export const botonCategoria = (valor, etiqueta, cuantos, activa) => `
  <button class="boton text-sm ${activa ? "" : "bg-tarjeta text-texto border border-borde"}"
          type="button" data-categoria="${valor}" aria-pressed="${activa}">
    ${etiqueta} <span class="opacity-70">${cuantos}</span>
  </button>
`;

export const filaCarrito = ({ id, nombre, precio, cantidad }) => `
  <li class="flex flex-wrap items-center justify-between gap-2 border-b border-borde py-2">
    <span>${nombre}</span>
    <span class="flex items-center gap-2">
      <button class="boton text-sm px-3 py-1" type="button"
              data-accion="menos" data-id="${id}"
              aria-label="Quitar una unidad de ${nombre}"><span aria-hidden="true">−</span></button>
      <strong class="min-w-8 text-center">${cantidad}</strong>
      <button class="boton text-sm px-3 py-1" type="button"
              data-accion="mas" data-id="${id}"
              aria-label="Agregar una unidad de ${nombre}"><span aria-hidden="true">+</span></button>
      <strong class="text-exito min-w-24 text-right">${formatearPrecio(precio * cantidad)}</strong>
      <button class="boton text-sm" type="button"
              data-accion="quitar" data-id="${id}"
              aria-label="Quitar ${nombre} del carrito">Quitar</button>
    </span>
  </li>
`;

/* El esqueleto de una tarjeta: la misma caja, del mismo tamaño, con bloques grises en
   lugar de la foto, el nombre, el precio y el botón. Se pinta tantas veces como
   tarjetas se esperan, y así el catálogo no da el salto de estar vacío a estar lleno.

   Lleva `aria-hidden="true"` entero: un lector de pantalla no tiene nada que leer en
   ocho cajas grises. Lo que esa persona necesita saber, que el catálogo está cargando,
   lo dice el aviso de al lado, que sí está en una zona con role="status". */
export const esqueletoTarjeta = () => `
  <article class="tarjeta flex flex-col animate-pulse motion-reduce:animate-none" aria-hidden="true">
    <div class="w-full aspect-square bg-fondo-suave rounded-lg mb-3"></div>
    <div class="h-3 w-1/2 self-center bg-fondo-suave rounded-full mb-2"></div>
    <div class="h-4 w-3/4 self-center bg-fondo-suave rounded-full mb-2"></div>
    <div class="h-3 w-1/3 self-center bg-fondo-suave rounded-full mb-4"></div>
    <div class="h-9 w-2/3 self-center bg-fondo-suave rounded-full mt-auto"></div>
  </article>
`;

/* La línea de aviso del catálogo. El texto que recibe lo escribimos SIEMPRE nosotros:
   cuántos productos hay, cuántos se ven, que está cargando. Nunca lleva nada tecleado
   por una persona, y por eso puede entrar en una plantilla. */
export const avisoCatalogo = (texto) => `
  <p class="text-sm text-texto-suave my-3">${texto}</p>
`;

/* Algo falló y no hay copia guardada. Dos piezas, y las dos importan.

   El mensaje, en rojo, dice qué pasó en palabras que entiende quien está comprando. Y
   el botón de reintentar es lo que convierte un error en algo que tiene arreglo: sin
   él, la única salida es recargar la página, y mucha gente se va antes de hacerlo. */
export const avisoError = (mensaje) => `
  <p class="font-semibold text-error mb-3">${mensaje}</p>
  <button class="boton" type="button" data-accion="reintentar">Reintentar</button>
`;

/* Los filtros no dejaron ningún producto. Dos mensajes distintos para dos situaciones
   distintas: no hay nada en esta categoría, o no hay nada con lo que se escribió. */
export const mensajeSinResultados = (termino) => {
  const caja = document.createElement("p");
  caja.className = "col-span-full text-center text-texto-suave py-10";
  caja.textContent =
    termino.trim() === ""
      ? "No hay productos en esta categoría."
      : `No encontramos nada para “${termino.trim()}”. Prueba con otra palabra o quita el filtro de categoría.`;
  return caja;
};

/* El comprobante del pedido. Recibe el pedido ya armado y devuelve la caja entera.
   El nombre, la dirección y el correo los escribió la persona, así que todo va por
   `textContent`. */
export const resumenPedido = ({ numero, fecha, cliente, lineas, unidades, total }) => {
  const caja = document.createElement("div");
  caja.className = "border-2 border-exito rounded-tarjeta p-4";

  const titulo = document.createElement("p");
  titulo.className = "font-semibold text-exito";
  titulo.textContent = `Pedido ${numero} confirmado. Gracias, ${cliente.nombre}.`;
  caja.append(titulo);

  const detalle = document.createElement("ul");
  detalle.className = "list-none p-0 m-0 mt-3 text-sm";
  lineas.forEach(({ nombre, precio, cantidad }) => {
    const fila = document.createElement("li");
    fila.className = "flex justify-between gap-4 border-b border-borde py-1";
    const que = document.createElement("span");
    que.textContent = `${cantidad} × ${nombre}`;
    const cuanto = document.createElement("span");
    cuanto.textContent = formatearPrecio(precio * cantidad);
    fila.append(que, cuanto); // append acepta varios nodos de una vez; appendChild, uno
    detalle.append(fila);
  });
  caja.append(detalle);

  const cuentas = document.createElement("p");
  cuentas.className = "font-semibold mt-3";
  cuentas.textContent = `${unidades} unidad(es) · Total ${formatearPrecio(total)}`;
  caja.append(cuentas);

  const envio = document.createElement("p");
  envio.className = "text-sm text-texto-suave mt-1";
  envio.textContent =
    `Confirmado el ${fecha}, con envío a ${cliente.direccion}, ${cliente.ciudad}. ` +
    `Te escribimos a ${cliente.email}.`;
  caja.append(envio);

  return caja;
};
