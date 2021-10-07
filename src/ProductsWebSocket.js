
let estaInicializado = false;
const conexiones = [];
const { normalize } = require("normalizr");
const PersistenciaChat = require("./persistencia/PersistenciaChat");
const messageListSchema = require("./persistencia/chatNormalizer");

class ProductsWebSocket {
    // Este método inicializa el servidor de WebSocket
    static inicializar() {
        if(estaInicializado) {
            throw new Error("Ya estaba inicializado, no lo puedo inicializar dos veces.");
        }

        // Pongo esto en true para acordarme si ya lo inicialicé asi no lo hago varias veces.
        estaInicializado = true;

        // Lo siguiente es codigo normal de inicializar un websocket.
        const http = require("http");
        const WebSocketServer = require("websocket").server;

        const server = http.createServer();
        server.listen(9898);

        const wsServer = new WebSocketServer({
            httpServer: server
        });

        // Cada vez que reciba una conexión de un cliente tengo que decidir que quiero hacer 

        wsServer.on("request", async (request) => {
            // connection se refiere a la conexión del cliente, acá acepto que se conecte

            const connection = request.accept(null, request.origin);
            console.log(`Connection from ${request.origin} accepted`);

            // Agrego la conexión con el cliente a un array para usarlo más tarde 
            // Lo necesito para poder enviar mensajes al cliente en un momento posterior
            conexiones.push(connection);
            
            // mando el array de mensajes
            const mensajes =  await PersistenciaChat.obtenerMensajes().lean() || [];
            const mensajesNormalizados = normalize(mensajes, messageListSchema);
            let compresion = 100 - JSON.stringify(mensajesNormalizados).length / JSON.stringify(mensajes).length * 100;  
            compresion = Math.round(compresion * 100) / 100;
            const result = { 
                type: "chatsArray",
                mensajes: mensajesNormalizados,
                compresion: compresion
            }
            connection.sendUTF(JSON.stringify(result));

            // Cuando el cliente me envíe un mensaje voy a hacer lo siguiente
            connection.on("message", async message => {
                console.log("Received Message: ", message.utf8Data);
                // le agrego la fecha y lo vuelvo a mandar
                const objetoMensaje = JSON.parse(message.utf8Data);
                objetoMensaje.date = `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
                await PersistenciaChat.insertarMensaje({
                    author: objetoMensaje.author,
                    date: objetoMensaje.date,
                    text: objetoMensaje.text
                });
                this.enviarDatos(objetoMensaje);

                // Guardo los mensajes en un archivo
            });

            // Acá pongo que hago cuando se cierra la conexión o sea cuando el cliente se desconecta
            connection.on("close", (reasonCode, description) => {
                console.log("Client has disconnected");

                // El codigo siguiente es para eliminar una conexión de la lista, porque se desconectó el cliente, ya no necesito tenerlo
                const index = conexiones.indexOf(connection);
                conexiones.splice(index, 1);
            });

        });
    }

    // Este metodo es para enviar datos a los clientes conectados al websocket (en el ejemplo la lista de productos mas actualizada)
    static enviarDatos(datos) {
        // Como las conexiones de los conectados la guarde en conexiones, recorro el array y le mando a esos
        conexiones.forEach(connection => {
            const datosEnString = JSON.stringify(datos);
            connection.sendUTF(datosEnString);
        });
    }
}

console.log("WebSocket server iniciado en puerto 9898");

module.exports = ProductsWebSocket;