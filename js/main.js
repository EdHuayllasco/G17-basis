<<<<<<< HEAD
const MONEDA = "$";
const IGV = 0.18;
const ENVIO_GRATIS_DESDE = 50;
let visitasDeHoy = 0;

visitasDeHoy = visitasDeHoy + 1;
console.log("Visitas", visitasDeHoy);

{
    const soloAquiAdentro = "vivo dentro de estas llaves";
    console.log(soloAquiAdentro);
}
console.log(typeof "Mackbook Pro 14");
console.log(typeof 1999.99);
console.log(typeof true);
console.log(typeof undefined);
console.log(typeof null);

const precioMacbook = 1999.99;
console.log(precioMacbook * (1 + IGV));
console.log(7 % 2 );

console.log("5"===5);
console.log("5"==5);
console.log(5==5);

console.log(precioMacbook > 1000 && precioMacbook<3000);
console.log(!(precioMacbook<3000));

const etiqueta = precioMacbook > 1000 ? "premium" : "accesible";
console.log(etiqueta)


const descuentoAplicado = 0;
console.log(descuentoAplicado ?? "sin descuento");
console.log(descuentoAplicado || "sin descuento");

const cupon = {
    codigo : "TECH10",
    porcentaje : 10
}
const cuponDelVisitante = null;

console.log(cupon?.porcentaje);
console.log(cuponDelVisitante?.porcentaje);

const compraDelVisitante = 39.9;
let costoEnvio;
if(compraDelVisitante > ENVIO_GRATIS_DESDE) {
    costoEnvio = 0;
} else {
    costoEnvio = 9.99;
}
console.log("costo de envio:", costoEnvio);

function tarifaPorZona (zona) {
    switch (zona) {
        case "Lima" :
            return 0;
        case "Resto del Peru":
            return 9.99;
        case "Internacional":
            return 29.99;
        default:
            return 9.99;
    }
}
console.log(tarifaPorZona("Internacional"));


const categorias = ["laptops", "smartphones", "tablets", "audio"];
for(let i = 0; i < categorias.length; i++) {
    console.log(i + ": " + categorias[i])
}

for(const categoria of categorias) {
    console.log(categoria);
}

let unidadesPorDespachar = 3;
while(unidadesPorDespachar > 0) {
    console.log("Despachando unidad " + unidadesPorDespachar);
    unidadesPorDespachar = unidadesPorDespachar - 1;
}


function precioConIGV(precio) {
    return precio * (1+IGV);
}

const precioConIGVExpresion = function (precio) {
    return precio * (1 + IGV);
}

const conDescuento = (precio, porcentaje = 10) => {
    const rebaja = precio * (porcentaje / 100);
    return precio - rebaja;
}

const conIGVFlecha = (precio) => precio * (1 +IGV);

const formatearPrecio = precio => MONEDA + precio.toFixed(2);


console.log(precioConIGV(1000));
console.log(precioConIGVExpresion(1000));
console.log(conIGVFlecha(1000));
console.log(conDescuento(1000));
console.log("pasando porcentaje", conDescuento(1000,25));
console.log(formatearPrecio(1999.99999));

function aplicar(precio, transformacion){
    return transformacion(precio);
}
console.log(aplicar(1000, conDescuento));
console.log(aplicar(1000,conIGVFlecha));

const productos = [
    {id: 1, nombre: "Macbook Pro 14", precio: 1999.99, categoria: "laptops", stock: 5, destacada: true},
    {id: 2, nombre: "Iphone 13 Pro", precio: 1099.99, categoria:"smartphones", stock: 8, destacado: false},
    {id: 3, nombre: "Ipad Mini 2021", precio: 499.99, categoria: "tablets", stock: 0, destacado:false},
    {id: 4, nombre: "Airpods Max", precio: 549.99, categoria: "audio", stock: 3, destacado: false},
];

productos.push(
  {id: 5, nombre: "Macbook Air 13", precio: 1299.99, categoria: "laptops", stock: 4, destacado: false},
  {id: 6, nombre: "Iphone 15", precio: 999.99, categoria: "smartphones", stock: 0, destacado: false},
// Tarea 7 - FACIL
  {id: 7, nombre: "AirTag", precio: 29.00, categoria: "accesorios", stock: 10, destacado: false}
);

console.log(productos.length);
console.log(productos[0].nombre);
console.log(productos[productos.length-1].nombre);

const macbook = productos[0];
console.log(macbook.precio);
console.log(macbook["precio"]);
const propiedad = "categoria";
console.log(macbook[propiedad]);

for(const producto of productos){
    console.log(producto.nombre + " - " + formatearPrecio(producto.precio));
}

console.table(productos);
// Tarea 7 - FACIL 
const valorDelCatalogo = productos.reduce((suma, p) => suma + p.precio, 0);
console.log(valorDelCatalogo.toFixed(2));

// Tarea 7 - INTERMEDIA 1
const catalogoPresentable = productos.map(producto => ({
    nombre: producto.nombre,
    categoria: producto.categoria,
    precio: formatearPrecio(producto.precio)
}));

console.table(catalogoPresentable);

const productosConStock = productos
    .filter(producto => producto.stock > 0)
    .map(producto => ({
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: formatearPrecio(producto.precio)
    }));

console.table(productosConStock);

const carrito = [];
carrito.push("Macbook Pro 14");
carrito.push("Airpods Max");
console.log(carrito.length);
carrito.pop();
console.log(carrito.length);
carrito.unshift("iPad Mini 2021");
console.log(carrito[0]);
carrito.shift();
console.log(carrito);

// Tarea 7 - INTERMEDIA 2
const cuantosHayDe = categoria =>
    productos.filter(producto => producto.categoria === categoria).length;

console.log("Laptops:", cuantosHayDe("laptops"));
console.log("Televisores:", cuantosHayDe("televisores"));

// Tarea 7 - DIFICIL 1
function resumenCarrito(items) {
    const cantidad = items.length;
    const total = items.reduce((suma, item) => suma + item.precio, 0);
    const envio = total >= ENVIO_GRATIS_DESDE ? 0 : 9.99;

    return {
        cantidad,
        total,
        envio
    };
}

const carritoCompra = [
    productos[6]
];

console.log(resumenCarrito(carritoCompra));

//Prueba total >= $50 entonces envío = $0
const carritoCompraGratis = [
    productos[6],
    productos[6]
];

console.log(resumenCarrito(carritoCompraGratis));

// Tarea 7 - DIFICIL 2
const productosDisponibles = productos.filter(producto => producto.stock > 0);
const ordenadosPorPrecio = productosDisponibles
    .slice()
    .sort((a, b) => a.precio - b.precio);
const masBaratoConStockSort = ordenadosPorPrecio[0];

console.log("Más barato con stock (filter + sort):", masBaratoConStockSort);

// Tarea 7 - DIFICIL 2
const masBaratoConStockReduce = productos
    .filter(producto => producto.stock > 0)
    .reduce((masBarato, producto) => producto.precio < masBarato.precio ? producto : masBarato);

console.log("Más barato con stock (filter + reduce):", masBaratoConStockReduce);
import { agregarAlCarrito, faltaParaEnvioGratis, guardarCarrito, leerCarrito, olvidarCarrito, quitarDelCarrito, resumenCarrito } from "./carrito.js";
import {categorias, contarPorCategoria} from "./datos.js";
import formatearPrecio from "./formato.js";
import { ENVIO_GRATIS_DESDE } from "./tienda.js";
import { filaCarrito, tarjetaProducto, esqueletoTarjeta, avisoCatalogo, avisoError } from "./ui.js";
import { obtenerProductos } from "./api.js";
const resumenCabecera = document.querySelector('#resumen-carrito');
const listaCarrito = document.querySelector('#lista-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const barraEnvio = document.querySelector('#barra-envio');
const mensajeEnvio = document.querySelector('#mensaje-envio');
const botonVaciar = document.querySelector('#vaciar');
const grillaCatalogo = document.querySelector("#catalogo-grid");
const estadoCatalogo = document.querySelector("#estado-catalogo");

let catalogo = [];
const mensajeDeError = (error) => {
    if(error.name === "TypeError") {
        return ("No pudimos conectarnos con la tienda. Revisa tu conexion y vuelve a intentarlo.");
    }
    if(error.name === "TimeoutError") {
        return "El servidor tardo demasiado en responde. Vuelve a intentarlo en un momento";
    }
    return error.message;
}
const pintarCatalogo = (lista = catalogo) => {
    const html = lista.map(tarjetaProducto).join("");
    grillaCatalogo.innerHTML="";
    grillaCatalogo.insertAdjacentHTML("beforeEnd", html);

    grillaCatalogo.setAttribute("aria-label", `Catalogo con ${lista.length} productos`);
}
const mostrarCargando = () => {
    grillaCatalogo.innerHTML = esqueletoTarjeta().repeat(8);
    estadoCatalogo.innerHTML = avisoCatalogo("Cargando productos...");
}
const mostrarExito = (lista) => {
    const cuenta = contarPorCategoria(lista);
    const detalle = categorias.map((categoria) => `${categoria} ${cuenta[categoria] ?? 0}`).join(" - ");
    estadoCatalogo.innerHTML = avisoCatalogo(`${lista.length} productos - ${detalle}`);
}
const mostrarVacio = () => {
    grillaCatalogo.innerHTML = "";
    estadoCatalogo.innerHTML = avisoCatalogo("No hay productos para mostrar");
}
const mostrarError = (error) => {
    grillaCatalogo.innerHTML = "";
    estadoCatalogo.innerHTML = avisoError(mensajeDeError(error));
}

const cargarCatalogo = async () => {
    mostrarCargando();
    try {
        catalogo = await obtenerProductos();
        if (catalogo.length === 0){
            mostrarVacio();
            return;
        }
        pintarCatalogo();
        mostrarExito(catalogo);
    } catch (error) {
        console.warn("No se pudo cargar el catalogo");
        mostrarError(error);
    } finally {
        console.log("La carga termino, bien o mal. Esta linea corre siempre");
    }
}
estadoCatalogo.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion='reintentar']");
    if(!boton) return;
    cargarCatalogo();
})
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
    const producto = catalogo.find( p => p.id === id);
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
pintarCarrito();
cargarCatalogo();
