export const categorias = ["laptops", "smartphones", "tablets", "audio"];
export const productos = [
    {id: 1, nombre: "Macbook Pro 14", precio: 1999.99, categoria: "laptops", stock: 5, destacado: true, 
        envio : {zona: "Lima", dias : 1}},
    {id: 2, nombre: "Iphone 13 Pro", precio: 1099.99, categoria:"smartphones", stock: 8, destacado: false,
        envio: {zona : "Lima", dias : 1}
    },
    {id: 3, nombre: "Ipad Mini 2021", precio: 499.99, categoria: "tablets", stock: 0, destacado:false,
        envio: {zona: "Resto del Peru", dias: 4 }
    },
    {id: 4, nombre: "Airpods Max", precio: 549.99, categoria: "audio", stock: 3, destacado: false,
        envio: {zona: "Lima", dias: 1}
    },
    {id: 5, nombre: "Macbook Air 13", precio: 1299.99, categoria: "laptops", stock: 4, destacado: false, 
        envio: {zona: "Resto del Peru", dias: 4}
    },
    {id: 6, nombre: "Iphone 15", precio: 999.99, categoria: "smartphones", stock: 0, destacado: false,
        envio : { zona : "Internacional", dias : 10}
    }
];

export const contarPorCategoria = (items) => 
    items.reduce((cuenta, {categoria}) => ({...cuenta, [categoria] : (cuenta[categoria] ?? 0) + 1}),{});

