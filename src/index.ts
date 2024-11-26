import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';
import express from 'express';



interface UserWebSocket {
    senderSocket: Socket
    receiverSocket: Socket
}
interface Socket extends WebSocket {
    RoomId: string
}
const app=express()
const server=http.createServer(app)

const wss = new WebSocketServer({ server: server });

let senderSocket: null | Socket = null;
let receiverSocket: null | Socket = null;
const UserMap = new Map<string, UserWebSocket>()
wss.on('connection', function connection(ws: Socket) {
    ws.on('error', console.error);
    console.log("suer connect");

    ws.on('message', function message(data: any) {
        const message = JSON.parse(data);
        if (message.type == "user") {
            if (senderSocket) {
                receiverSocket = ws
                const Id = Date.now().toString()

                UserMap.set(Id, { receiverSocket, senderSocket })
                if (receiverSocket && senderSocket) {
                    senderSocket.send(JSON.stringify({ type: "user", who: "sender", Id: Id }))
                    receiverSocket.send(JSON.stringify({ type: "user", who: "receiver", Id: Id }))
                }

                senderSocket = null
                receiverSocket = null
            } else {
                senderSocket = ws
                senderSocket.send(JSON.stringify({ type: "waiting" }))
            }
        } else {

            const { RoomId } = message

            const socket = UserMap.get(RoomId)
            if (!socket) {
                return
            }

            if (message.type === 'createOffer') {

                if (ws !== socket?.senderSocket) {

                    return;

                }

                socket?.receiverSocket?.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));


            } else if (message.type === 'createAnswer') {


                if (ws !== socket?.receiverSocket) {
                    return;
                }

                socket?.senderSocket?.send(JSON.stringify({ type: 'createAnswer', sdp: message.sdp }));


            } else if (message.type === 'iceCandidate') {


                if (ws === socket?.senderSocket) {


                    socket?.receiverSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));


                } else if (ws === socket?.receiverSocket) {


                    socket?.senderSocket?.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));


                }
            }
        }
    });
    ws.on("close", () => {
        for (const [key, userWebSocket] of UserMap.entries()) {
               if (userWebSocket.senderSocket === ws || userWebSocket.receiverSocket === ws) {
            
                if (userWebSocket.receiverSocket == ws) {
                    userWebSocket.receiverSocket?.send(JSON.stringify({type:"userDisConnect"}))
                }else{
                    userWebSocket.senderSocket?.send(JSON.stringify({type:"userDisConnect"}))
                }
                UserMap.delete(key);
                
                console.log(`Removed key: ${key} from UserMap`);
                break; // Exit loop after deletion
            }
        }


    })
});

server.listen(3000,()=>{
    console.log("server listening on 3000");
    
});
