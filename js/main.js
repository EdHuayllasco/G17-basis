import {categorias, contarPorCategoria, productos} from "./datos.js";
import formatearPrecio, {MONEDA} from "./formato.js";
import {IGV, ENVIO_GRATIS_DESDE, precioConIgv, tarifaPorZona, agregarProducto, sumar, actualizarPrecio, conDescuento, costoDeEnvio, resumenTienda} from "./tienda.js";

console.log("TechCart: Modulos cargados");
const macbook = productos[0];
console.log(`${macbook.nombre} cuesta ${formatearPrecio(macbook.precio)}`);

const ficha = `
    Producto : ${macbook.nombre}
    Categoria : ${macbook.categoria}
    Precio : ${formatearPrecio(macbook.precio)}
    Con IGV : ${formatearPrecio(precioConIgv(macbook.precio))}
    Stock : ${macbook.stock} unidades
`
console.log(ficha);

for(let i = 0; i < categorias.length; i++) {
    console.log(`${i} : ${categorias[i]}`);
}

for(const producto of productos) {
    console.log(`${producto.nombre} - ${formatearPrecio(producto.precio)}`)
}
const { nombre : titulo, categoria : rubro} = macbook;
console.log(`${titulo} esta en la categoria ${rubro}`);

const {descuento = 0, destacado = false} = macbook;
console.log(descuento, destacado);

const { envio : {zona, dias}} = macbook;
console.log(`Despacho a ${zona} en ${dias} dia(s)`);

const { envio : { zona : zonaIpad, dias : diasIpad, transportista = "por asignar" }} = productos[2];
console.log(`${zonaIpad} - ${diasIpad} - ${transportista}`);

const {id, ...mackbookSinId} = macbook;
console.log(id, Object.keys(mackbookSinId));

const [primera, segunda] = categorias;
console.log(primera, segunda);

const [, , tercera] = categorias;
console.log(tercera);

const [principal, ...demasCategorias] = categorias;
console.log(demasCategorias);

const [, , , , quinto = "sin categoria"] = categorias;
console.log(quinto);

let primero = "Macbook Pro 14";
let segundo = "Iphone 15";
[primero, segundo] = [segundo, primero];
console.log(primero, segundo);

const etiqueta = ({nombre, precio, stock}) => `${nombre} - ${formatearPrecio(precio)} - ${stock > 0 ? `${stock} en stock` : "agotado"}`;
console.log(etiqueta(macbook));
console.log(productos.map(etiqueta));

const conBadge = ({nombre, badge = "Nuevo"}) => `${badge}: ${nombre}`;
console.log(conBadge(macbook))
console.log(conBadge({nombre : "Airpods Pro 2", badge: "Oferta"}));

const copiaCategorias = [...categorias];
console.log(copiaCategorias.length, copiaCategorias === categorias);

console.log([...categorias, "accesorios"]);
console.log(["ofertas", ...categorias]);
console.log([...categorias, ...["gaming","smartwatch"]]);

const conAirpodsPro = agregarProducto(productos, {
    id: 7,
    nombre: "Airpods Pro 2",
    precio: 249.99,
    categoria : "audio",
    stock : 12,
    destacado: false,
    envio: {
        zona : "Lima",
        dias : 1
    }
});
console.log(conAirpodsPro.length, productos.length);

const porPrecio = [...productos].sort((a,b) => a.precio - b.precio);
console.log(porPrecio.map(({nombre}) => nombre));
console.log(productos[0].nombre);

const precios = productos.map(({precio}) => precio);
console.log(sumar(...precios).toFixed(2));
console.log(Math.max(...precios));

console.log(sumar(1999.99, 1099.99));
console.log(sumar());
console.log(sumar(...precios).toFixed(2));

const recibo = (cliente, ...items) => 
    `${cliente} lleva ${items.length} producto(s): ${items.join(", ")}`;
console.log(recibo("Ana Perez", "Macbook Pro 14", "Airpods Max"));

const macbookEnOfertas = actualizarPrecio(macbook, 1799.99);
console.log(macbookEnOfertas.precio, macbook.precio);

const preferencias = {moneda: MONEDA, zona : "Lima"};
const preferenciasDelVisitante = {...preferencias, zona : "Internacional"};
console.log(preferenciasDelVisitante);

const original = {
    nombre : "iPad Mini 2021", envio : {zona : "Resto del Peru", dias : 4}
}
const copia = {...original};
copia.nombre = "IPad Mini Copia";
copia.envio.dias = 90;
console.log(original.nombre);
console.log(copia.nombre);
console.log(original.envio.dias);
console.log(copia.envio.dias);

const copiaCompleta = {...original, envio : {...original.envio}};
copiaCompleta.envio.dias = 1;
console.log(original.envio.dias);
console.log(copiaCompleta.envio.dias);

//structuredClone

const zonaDelPedido = "Lima";
const unidades = 2;
const pedido = {cliente : "Ana Perez", unidades, zona: zonaDelPedido};
console.log(pedido);

const campo = "total";
const lineaDelPedido = { [campo] : sumar(1999.99, 549.99)};
console.log(lineaDelPedido);

console.log(contarPorCategoria(productos));

console.log(conDescuento(1000));
console.log(conDescuento(1000,25));
console.log(conDescuento(1000,0));

const cupon = { codigo : "TECH10", porcentaje : 10};
const cuponDelVisitante = null;
console.log(cupon?.porcentaje);
console.log(cuponDelVisitante?.porcentaje);
console.log(cuponDelVisitante?.porcentaje ?? 0);
console.log(macbook.envio?.zona ?? "sin definir");

console.log(costoDeEnvio(39.9));
console.log(costoDeEnvio(39.9,"Lima"));
console.log(costoDeEnvio(1999.99,"Internacional"));
console.log(tarifaPorZona("Internacional"));

const {
    productos : cuantos,
    disponibles,
    agotados,
    valorCatalogo,
    valorInventario,
    masCaroDe
} = resumenTienda(productos);

console.log(`TechCart: ${cuantos} productos, ${disponibles} disponibles y ${agotados} agotados.`);
console.log(`Valor del catalogo: ${formatearPrecio(valorCatalogo)}`);
console.log(`Valor del inventario: ${formatearPrecio(valorInventario)}`);
console.log(`El producto mas caro sigue siendo ${masCaroDe}. Envio gratis desde ${formatearPrecio(ENVIO_GRATIS_DESDE)}`);

for(const {nombre, stock} of productos) {
    if(stock === 0) {
        console.warn(`Sin stock : ${nombre}`);
    }
}