import {productos } from "./datos.js";
import { tarjetaProducto } from "./ui.js";

console.log("document es un", document.nodeName, ". su titulo es:", document.title);
console.log("El <h1> de la cabera dice", document.querySelector("h1").textContent);
console.log("Por id, la forma de siempre", document.getElementById("catalogo").tagName);

const tarjetasAlCargar = document.querySelectorAll(".tarjeta");
console.log("Tarjeta en la pagina recien cargada : " + tarjetasAlCargar.length);

console.log("Query selector all devuelve un arreglo? ", Array.isArray(tarjetasAlCargar));
console.log("Devuelve un", tarjetasAlCargar.constructor.name);

console.log("Convertida ya se puede recorrer con map",
    Array.from(tarjetasAlCargar).map(tarjeta => tarjeta.querySelector("h3").textContent));

document.querySelector("h1").textContent = "<b>TechCart</b>";
document.querySelector("h1").innerHTML = "<b>TechCart</b>";

const primerBeneficio = document.querySelector(".tarjeta h3");
console.log("TextContent del primer beneficio", primerBeneficio.textContent);
console.log("Su tarjeta lleva la clase text-center", primerBeneficio.closest(".tarjeta").classList.contains("text-center"));

const enlaceDummy = document.querySelector('a[target=_blank]');
console.log("getAttribute('href'):", enlaceDummy.getAttribute("href"));
console.log("la propiedad .href", enlaceDummy.href);

const grillaCatalogo = document.querySelector("#catalogo-grid");

const pintarCatalogo = (lista = productos) => {
    const html = lista.map(tarjetaProducto).join("");
    grillaCatalogo.innerHTML="";
    grillaCatalogo.insertAdjacentHTML("beforeEnd", html);

    grillaCatalogo.setAttribute("aria-label", `Catalogo con ${lista.length} productos`);
}
pintarCatalogo();