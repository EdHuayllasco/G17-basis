/* main.js — el punto de entrada: conecta los datos con la página,
   dibuja y escucha los eventos. Es el único que importa a los demás. */

import { categorias, contarPorCategoria, etiquetaCategoria } from "./datos.js";
import formatearPrecio, { formatearFecha } from "./formato.js";
import { ENVIO_GRATIS_DESDE, TODAS, filtrarPorCategoria, buscar } from "./tienda.js";
import {
  agregarAlCarrito,
  cambiarCantidad,
  quitarDelCarrito,
  resumenCarrito,
  faltaParaEnvioGratis,
  guardarCarrito,
  leerCarrito,
  olvidarCarrito,
} from "./carrito.js";
import {
  tarjetaProducto,
  filaCarrito,
  esqueletoTarjeta,
  avisoCatalogo,
  avisoError,
  botonCategoria,
  mensajeSinResultados,
  resumenPedido,
} from "./ui.js";
import { obtenerProductos } from "./api.js";

const grillaCatalogo = document.querySelector("#catalogo-grid");
const estadoCatalogo = document.querySelector("#estado-catalogo");
const avisoRespaldo = document.querySelector("#aviso-respaldo");
const filtrosCategoria = document.querySelector("#filtros-categoria");
const campoBuscar = document.querySelector("#buscador");
const resumenCabecera = document.querySelector("#resumen-carrito");
const listaCarrito = document.querySelector("#lista-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const barraEnvio = document.querySelector("#barra-envio");
const mensajeEnvio = document.querySelector("#mensaje-envio");
const botonVaciar = document.querySelector("#vaciar");
const formularioCompra = document.querySelector("#form-compra");
const estadoPedido = document.querySelector("#estado-pedido");

/* ============================================================
   2. LOS DATOS DEL CATÁLOGO, Y LO QUE SE CALCULA CON ELLOS

   Tres datos, y son las únicas verdades de esta pantalla:

     catalogo          todo lo que llegó. Después de la carga no se toca nunca más.
     categoriaActiva   qué botón está apretado.
     termino           qué hay escrito en el buscador en este instante.

   Y una función, `productosVisibles`, que los combina en ese orden: primero recorta por
   categoría y después busca dentro de lo que quedó. Es una FUNCIÓN y no una variable a
   propósito, y ahí está la decisión del día. Con una variable habría dos listas que
   tienen que coincidir, y cada vez que cambiara algo —el filtro, el texto, o mañana un
   orden— habría que acordarse de recalcularla en todos los sitios. El día que uno se
   olvida en uno, la grilla muestra tres productos y la línea de arriba dice treinta y
   ocho. Calculándola, ese error no se puede ni escribir.

   Y los dos filtros se combinan solos: no hay ni una línea que diga "si hay categoría y
   además hay búsqueda". Son dos funciones, una después de la otra.
   ============================================================ */
let catalogo = [];
let categoriaActiva = TODAS;
let termino = "";

const productosVisibles = () => buscar(filtrarPorCategoria(catalogo, categoriaActiva), termino);

/* ============================================================
   3. PINTAR EL CATÁLOGO

   Una sola función decide qué se ve, y la llaman los tres sitios que pueden cambiarlo:
   la carga, el botón de categoría y cada tecla del buscador. No hay tres maneras de
   actualizar la grilla: hay una.
   ============================================================ */

/* La línea de estado cuando los productos ya están. Si no hay ningún filtro puesto dice
   cuántos hay y de qué categorías; si hay filtro, dice cuántos se ven de cuántos. El
   desglose usa las etiquetas en castellano, no los nombres del servidor. */
const mostrarRecuento = (visibles) => {
  const cuenta = contarPorCategoria(catalogo);
  const detalle = categorias
    .map((categoria) => `${etiquetaCategoria[categoria]} ${cuenta[categoria] ?? 0}`)
    .join(" · ");

  estadoCatalogo.innerHTML = avisoCatalogo(
    visibles === catalogo.length
      ? `${catalogo.length} productos · ${detalle}`
      : `${visibles} de ${catalogo.length} productos`,
  );
};

const pintarCatalogo = () => {
  const visibles = productosVisibles();
  grillaCatalogo.innerHTML = "";

  if (visibles.length === 0) {
    // Un elemento, no una plantilla: adentro va lo que tecleó la persona.
    grillaCatalogo.append(mensajeSinResultados(termino));
  } else {
    grillaCatalogo.insertAdjacentHTML("beforeend", visibles.map(tarjetaProducto).join(""));
  }

  // La grilla dice cuántos productos tiene, y eso cambia con cada filtro.
  grillaCatalogo.setAttribute("aria-label", `Catálogo con ${visibles.length} productos`);
  mostrarRecuento(visibles.length);
};

/* Los botones del filtro. No están escritos a mano en el HTML: salen de `categorias`,
   que es el mismo dato con el que `api.js` arma las direcciones. Así no hay forma de
   que la tienda ofrezca un botón de una categoría que no pide, ni al revés.

   "Todas" va primero y es el único que no sale de la lista: no es una categoría, es la
   ausencia de filtro. */
const pintarFiltros = () => {
  const cuenta = contarPorCategoria(catalogo);

  const botones = [
    botonCategoria(TODAS, "Todas", catalogo.length, categoriaActiva === TODAS),
    ...categorias.map((categoria) =>
      botonCategoria(
        categoria,
        etiquetaCategoria[categoria],
        cuenta[categoria] ?? 0,
        categoria === categoriaActiva,
      ),
    ),
  ];

  filtrosCategoria.innerHTML = botones.join("");
};

/* CARGANDO. Ocho esqueletos en la grilla y el aviso en la zona de estado. También apaga
   el cartel del respaldo: si esta carga sale bien, lo que se vea será fresco, y si sale
   mal el cartel se vuelve a encender abajo. */
const mostrarCargando = () => {
  avisoRespaldo.hidden = true;
  grillaCatalogo.innerHTML = esqueletoTarjeta().repeat(8);
  estadoCatalogo.innerHTML = avisoCatalogo("Cargando productos…");
};

/* DE DÓNDE SALIÓ LO QUE SE VE. Una línea cubre los dos casos, y eso es a propósito: no
   hay un `if` que enciende el cartel y otro que lo apaga en otro sitio. Hay un dato y la
   pantalla lo refleja.

   La fecha es la mitad del mensaje. Decir "estás viendo datos guardados" sin decir de
   cuándo no sirve de nada: lo que la persona necesita saber es si el precio que está
   leyendo es de hace diez minutos o de hace tres meses. */
const mostrarOrigen = (origen, fecha) => {
  const esRespaldo = origen === "respaldo";
  avisoRespaldo.hidden = !esRespaldo;

  if (esRespaldo) {
    avisoRespaldo.textContent =
      `No pudimos conectarnos con la tienda. Estás viendo el catálogo guardado ` +
      `el ${formatearFecha(fecha)}, así que los precios y el stock pueden haber cambiado.`;
  }
};

/* VACÍO. El servidor contestó bien, con un 200, y adentro no vino nada. No es un error
   y por eso necesita su propio mensaje: si se tratara como error, diríamos que algo
   falló cuando no falló nada. */
const mostrarVacio = () => {
  grillaCatalogo.innerHTML = "";
  filtrosCategoria.innerHTML = "";
  estadoCatalogo.innerHTML = avisoCatalogo("No hay productos para mostrar.");
};

/* ERROR. Se llega aquí solo cuando la red falló Y no había copia guardada. Tres fallos
   distintos merecen tres frases distintas, porque lo que la persona puede hacer al
   respecto es distinto en cada caso.

   `error.name` dice de qué tipo es. Un `TypeError` en un fetch significa que no se pudo
   hablar con el servidor. Un `TimeoutError` es nuestra propia cancelación por tiempo. Y
   cualquier otro llega con el mensaje que escribimos nosotros en los `throw` de
   `api.js`. */
const mensajeDeError = (error) => {
  if (error.name === "TypeError") {
    return "No pudimos conectarnos con la tienda y todavía no tenemos un catálogo guardado. Revisa tu conexión y vuelve a intentarlo.";
  }
  if (error.name === "TimeoutError") {
    return "El servidor tardó demasiado en responder. Vuelve a intentarlo en un momento.";
  }
  return error.message;
};

const mostrarError = (error) => {
  grillaCatalogo.innerHTML = "";
  filtrosCategoria.innerHTML = "";
  estadoCatalogo.innerHTML = avisoError(mensajeDeError(error));
};

/* ============================================================
   5. LA CARGA

   Se lee de arriba abajo como una receta: muestro que estoy cargando, pido, y según lo
   que llegue dejo la pantalla en uno de los otros estados. `async` porque adentro hay
   `await`; los dos van juntos siempre.

   La novedad de hoy es chica de escribir y grande de entender: `obtenerProductos` ya no
   devuelve una lista, devuelve un objeto con la lista y con de dónde salió. Se recibe
   desestructurando, en la misma línea.

   Y el `catch` sigue existiendo aunque ahora haya respaldo, porque el respaldo puede no
   existir: la primera visita de alguien sin red no tiene ninguna copia que servir.
   ============================================================ */
const cargarCatalogo = async () => {
  mostrarCargando();

  try {
    const { productos, origen, fecha } = await obtenerProductos();
    catalogo = productos;

    if (catalogo.length === 0) {
      mostrarVacio();
      return;
    }

    mostrarOrigen(origen, fecha);
    pintarFiltros();
    pintarCatalogo();
  } catch (error) {
    // console.warn y no console.error: la página sigue en pie y la persona ya tiene su
    // mensaje. Esto es para quien mantiene el código, que necesita el detalle técnico.
    console.warn("No se pudo cargar el catálogo:", error.name, "·", error.message);
    mostrarError(error);
  } finally {
    console.log("La carga terminó, bien o mal. Esta línea corre siempre.");
  }
};

let carrito = leerCarrito();

const pintarCarrito = () => {
  const { unidades, subtotal, igv, envio, total } = resumenCarrito(carrito);

  // textContent, no innerHTML: aquí no hace falta ninguna etiqueta.
  resumenCabecera.textContent =
    unidades === 0 ? "Carrito vacío" : `${unidades} unidad(es) · ${formatearPrecio(total)}`;

  // La lista sí lleva etiquetas, y las arma ui.js con datos que ya pasaron por el
  // adaptador. Nada de lo que hay aquí lo escribió una persona.
  listaCarrito.innerHTML = carrito.map(filaCarrito).join("");

  totalCarrito.textContent =
    unidades === 0
      ? "Todavía no agregaste nada."
      : `Subtotal ${formatearPrecio(subtotal)} · IGV ${formatearPrecio(igv)} · ` +
        `Envío ${formatearPrecio(envio)} · Total ${formatearPrecio(total)}`;

  // classList.toggle con un segundo argumento pone o quita la clase según la condición.
  botonVaciar.classList.toggle("hidden", unidades === 0);

  // Y este es el caso en que `style` sí corresponde: un ancho calculado, distinto en
  // cada visita, que ninguna clase puede tener escrita de antemano.
  const avance = Math.min((subtotal / ENVIO_GRATIS_DESDE) * 100, 100);
  barraEnvio.style.width = `${avance}%`;

  const falta = faltaParaEnvioGratis(subtotal);
  mensajeEnvio.textContent =
    falta === 0
      ? "Tu pedido ya tiene envío gratis."
      : `Te faltan ${formatearPrecio(falta)} para el envío gratis.`;
};

/* ============================================================
   7. LOS EVENTOS

   Seis, y los seis con la misma forma: averiguar qué pasó, cambiar un dato, mandar a
   pintar. Ninguno escribe en la pantalla directamente.
   ============================================================ */

grillaCatalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion='agregar']");
  if (!boton) return; // el clic cayó en otro lado: no hay nada que hacer

  // dataset lee los atributos data-*, y SIEMPRE devuelve cadena: data-id="4" da "4".
  // Por eso el Number(): sin él, "4" === 4 es falso y el find no encontraría nada.
  const id = Number(boton.dataset.id);
  // Se busca en el catálogo COMPLETO y no en lo que se está viendo: el id es único en
  // toda la tienda, así que acierta con filtro puesto o sin él.
  const producto = catalogo.find((p) => p.id === id);
  if (!producto) return;

  carrito = agregarAlCarrito(carrito, producto);
  guardarCarrito(carrito);
  pintarCarrito();
});

listaCarrito.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "mas") carrito = cambiarCantidad(carrito, id, 1);
  if (accion === "menos") carrito = cambiarCantidad(carrito, id, -1);
  if (accion === "quitar") carrito = quitarDelCarrito(carrito, id);

  guardarCarrito(carrito);
  pintarCarrito();
});

botonVaciar.addEventListener("click", () => {
  carrito = [];
  olvidarCarrito();
  pintarCarrito();
});

/* El filtro por categoría. Delegado en el contenedor, porque los botones se vuelven a
   dibujar cada vez que cambia el activo y un elemento recién creado nace sin listeners.
   Dos líneas de trabajo: cambiar el dato y mandar a pintar. */
filtrosCategoria.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-categoria]");
  if (!boton) return;

  categoriaActiva = boton.dataset.categoria;
  pintarFiltros();
  pintarCatalogo();
});

/* El buscador. `input` se dispara con cada tecla, y también cuando se pega texto o se
   dicta por voz, cosas que `keydown` no cubre. `evento.target.value` es lo que hay
   escrito en ese instante.

   Filtra los productos que ya están en memoria, así que no le pide nada al servidor y
   puede reaccionar en cada tecla sin costo. El día que la búsqueda le pregunte a la API
   hace falta esperar a que la persona deje de escribir antes de pedir —eso se llama
   rebote, o debounce— y cancelar la petición anterior; hoy no, y conviene saber por
   qué no. */
campoBuscar.addEventListener("input", (evento) => {
  termino = evento.target.value;
  pintarCatalogo();
});

/* El botón de reintentar. Va delegado en la zona de estado y no pegado al botón, por el
   mismo motivo de siempre: ese botón nace y muere con cada error. */
estadoCatalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion='reintentar']");
  if (!boton) return;

  cargarCatalogo();
});

/* Un ayudante para que el número de pedido quede parejo: 9 pasa a "09". */
const dosDigitos = (numero) => String(numero).padStart(2, "0");

/* El número de pedido, armado con la fecha y la hora: TC-20261009-1430.
   Ojo con `getMonth()`, que cuenta desde cero: enero es 0 y octubre es 9, por eso el +1.
   En una tienda de verdad el número lo da el SERVIDOR, nunca el navegador: si lo
   decidiera cada máquina, dos personas comprando a la vez se llevarían el mismo. */
const numeroDePedido = (fecha) =>
  `TC-${fecha.getFullYear()}${dosDigitos(fecha.getMonth() + 1)}${dosDigitos(fecha.getDate())}-` +
  `${dosDigitos(fecha.getHours())}${dosDigitos(fecha.getMinutes())}`;

/* El aviso corto, para los dos casos en que el pedido no se puede confirmar.
   `replaceChildren` deja la zona con exactamente lo que se le pasa: borra lo que había y
   pone lo nuevo, en una línea. */
const mostrarAviso = (mensaje, esError) => {
  const aviso = document.createElement("p");
  aviso.textContent = mensaje;
  aviso.classList.add("font-semibold", esError ? "text-error" : "text-exito");
  estadoPedido.replaceChildren(aviso);
};

formularioCompra.addEventListener("submit", (evento) => {
  // Sin esta línea el navegador hace lo de siempre: manda el formulario y RECARGA la
  // página, con lo cual todo lo que hicimos en memoria se pierde de vista.
  evento.preventDefault();

  if (!formularioCompra.checkValidity()) {
    formularioCompra.reportValidity(); // los mismos globos del navegador, cuando queremos
    mostrarAviso("Faltan datos por completar. Revisa los campos marcados.", true);
    return;
  }

  if (carrito.length === 0) {
    mostrarAviso("Tu carrito está vacío: agrega al menos un producto antes de confirmar.", true);
    return;
  }

  // FormData junta todo el formulario por el atributo `name` de cada campo, y
  // Object.fromEntries convierte esos pares en un objeto normal. Dos funciones, una
  // línea, y el formulario entero es un dato. Con los radios hace lo correcto solo:
  // trae el que está marcado. Todos los valores son TEXTO, siempre.
  const datos = Object.fromEntries(new FormData(formularioCompra));
  const { unidades, subtotal, igv, envio, total } = resumenCarrito(carrito);
  const ahora = new Date();

  // El pedido: quién compra, qué compra y cuánto sale. Las líneas entran tal como están
  // en el carrito, con sus cantidades. Es el único sitio donde el carrito y el
  // formulario se juntan, y por eso las cuentas salen de `resumenCarrito` y no se
  // vuelven a hacer aquí: dos sitios calculando lo mismo es el error de siempre.
  const pedido = {
    numero: numeroDePedido(ahora),
    fecha: formatearFecha(ahora.toISOString()),
    cliente: datos,
    lineas: carrito,
    unidades,
    subtotal,
    igv,
    envio,
    total,
  };

  // Primero se arma y se muestra el comprobante, y recién después se vacía el carrito.
  // Si fuera al revés, un fallo en el medio dejaría a la persona sin carrito y sin
  // pedido: cuando hay dos pasos y uno depende del otro, el que no se puede perder va
  // primero.
  estadoPedido.replaceChildren(resumenPedido(pedido));

  carrito = [];
  olvidarCarrito();
  pintarCarrito();
  formularioCompra.reset();
});

/* ============================================================
   9. EL ARRANQUE

   El orden importa y es una decisión. El carrito se pinta PRIMERO y sin esperar a nadie,
   porque sus datos están en el navegador y ya los tenemos. El catálogo se pide después,
   y mientras viaja la página ya está de pie y se puede usar.

   `cargarCatalogo()` se llama sin `await`: no devuelve nada que necesitemos, lo que hace
   es dejar la pantalla en su estado. Por dentro sigue siendo una promesa, y por eso su
   `try/catch` está adentro de la función y no aquí.
   ============================================================ */
pintarCarrito();
cargarCatalogo();
