const chatModel=require('./chat')

class PersistenciaChat {
    

    static obtenerMensajes() {
      return chatModel.find();
    }

    static async insertarMensaje(mensaje) {
        const chatNuevo = new chatModel(mensaje)

        
      return  await chatNuevo.save()


    }
}

module.exports = PersistenciaChat;