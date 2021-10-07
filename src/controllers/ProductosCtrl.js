const ProductsWebSocket = require("../ProductsWebSocket");
const PersistenciaProducto = require("../persistencia/PersistenciaProducto");

class ProductosCtrl {
    static async getProductos() {
        return await PersistenciaProducto.listar();
    }
    
    async listar(req, res) {
        const productos = await PersistenciaProducto.listar();
        if (productos.length === 0) {
            res.status(500).json({ error: "No hay productos cargados" });
        }
        else {
            res.json(productos);
        }
    }

    async listarPorId(req, res) {
        const producto = await PersistenciaProducto.buscar(req.params.id);
        if (producto != null) {
            res.json(producto);
        }
        else {
            res.status(404).json({ error: "No se encontró el producto" });
        }
    }

    async insertar(req, res) {
        const producto = req.body;
        const id = await PersistenciaProducto.insertar(producto);
        producto.id = id[0];
        const productos =await PersistenciaProducto.listar();
        const data = {};
        data.hayProductos = productos.length > 0;
        data.productos = productos;
        data.type = "products";
        // Ahora despues de insertar mando los datos al websocket usando la clase que creé
        ProductsWebSocket.enviarDatos(data);
        res.json(producto);
    }

    async actualizar(req, res) {
        const productoEnLista = (await PersistenciaProducto.buscar(req.params.id))[0]; // le pongo el 0 porque knex devuelve un array y yo necesito un solo objeto
        if(productoEnLista != null) 
        {
            await PersistenciaProducto.actualizar(req.body);
            res.json(req.body);
        }
        else {
            res.status(404).json({error: "No se encontró el producto"});
        }
    }

    async eliminar(req, res) {
        const productoAEliminar = (await PersistenciaProducto.buscar(req.params.id))[0]; // le pongo el 0 porque knex devuelve un array y yo necesito un solo objeto
        if(productoAEliminar != null) {
            await PersistenciaProducto.eliminar(req.params.id)
            res.json({mensaje: "Producto eliminado", producto: productoAEliminar});
        } else {
            res.status(404).json({error: "No se encontró el producto"});
        }
    }
}

module.exports = ProductosCtrl;