const productoModel =require('./producto')


class PersistenciaProducto {
    
        
    static async insertar(producto) {
        
        const productoNuevo= new productoModel(producto)
        return await productoNuevo.save()
    }

    static async buscar(id) {
           return await productoModel.findById(id).exec()
    }

    static async listar() {
        return await productoModel.find({});
    }

    static async actualizar(producto) {
        return await productoModel.updateOne({_id:producto._id},producto)
    }

    static async eliminar(id) {
        return await  productoModel.deleteOne({_id:id})
    }
}

module.exports = PersistenciaProducto;