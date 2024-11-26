// import { WebSocket } from "ws"

// const UserQueue:string[] = []

// export const RoomData:RoomDataType[]=[]
// export const userSetup=(ws:WebSocket)=>{
//     const str = `${Date.now()}`
//     UserQueue.push(str)
//     UserMap.set(str, ws)
//     clearQueue(ws)
// }
// const clearQueue = (ws:WebSocket)=>{
//     if (UserQueue.length < 2){ 
//     return ws.send(JSON.stringify({ type: "waiting" }))

//     }
//     const user2=UserQueue.pop()
//     const user1=UserQueue.pop()
//     const senderSocket =UserMap.get(user1?user1:"")
//     const receiverSocket =UserMap.get(user2?user2:"")
//     if (senderSocket && receiverSocket) {
//         RoomData.push({senderSocket,receiverSocket})
       
        
//     }

// }


// export const UserClose=(ws:WebSocket)=>{
    
// }