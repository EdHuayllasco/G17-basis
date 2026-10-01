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