import { WebSocket, WebSocketServer } from 'ws';



interface UserWebSocket {
    senderSocket: Socket
    receiverSocket: Socket
}
interface Socket extends WebSocket {
 RoomId:string
}

const wss = new WebSocketServer({ port: 8080 });

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
    ws.on("close",(event)=>{
console.log(event);

    })
});
