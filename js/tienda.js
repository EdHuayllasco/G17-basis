export const IGV = 0.18;
export const ENVIO_GRATIS_DESDE = 5000;

export const precioConIgv = (precio) => precio * (1 + IGV);

export const buscar = (items, texto) => items.filter(({nombre}) => nombre.toLowerCase().includes(texto.toLowerCase()));
export const masCaro = (items) => items.reduce((mayor, p) => (p.precio > mayor.precio ? p : mayor), items[0]);
export const agregarProducto = (items, nuevoProducto) => [...items, nuevoProducto];
export const sumar = (...precios) => precios.reduce((suma, n) => suma + n, 0);
export const actualizarPrecio = (producto, precio) => ({...producto, precio});

export const conDescuento = (precio, porcentaje = 10) => precio - precio * (porcentaje / 100);

// Tarea 8 - DIFÍCIL 2: rebaja una categoría sin mutar nada.
export const aplicarDescuentoA = (items, categoria, porcentaje = 10) =>
    items.map((p) => p.categoria === categoria ? { ...p, precio: conDescuento(p.precio, porcentaje) } : p);

export const resumenTienda = (items) => {
    const disponibles = items.filter(({stock}) => stock > 0);
    const agotados = items.length - disponibles.length;
    const valorCatalogo = sumar(...items.map(({precio}) => precio));
    const valorInventario = items.reduce((suma, {precio, stock}) => suma + precio * stock, 0);
    const { nombre : masCaroDe } = masCaro(items);
    return {
        productos : items.length,
        disponibles : disponibles.length, 
        agotados,
        valorCatalogo,
        valorInventario,
        masCaroDe,
    };
};