import http from "http";
// import WebSocket from "ws";
import express, { application } from "express";
import { SocketAddress } from "net";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');
// const handleListen = () => console.log('Listening on ws://localhost:3000');
// app.listen(3000, handleListen); express 는 웹소캣을 지원하지 않기 때문에 아래와 같이 변경해서 같이 쓸수 있게 만든다.

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

function publicRooms(){
    const {
        sockets: {
            adapter :{ sids, rooms } 
        }
    } = wsServer;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key)===undefined){
            publicRooms.push(key);
        }
    });
    return publicRooms;
    // const sids = wsServer.sockets.adapter.sids;
    // const rooms = wsServer.sockets.adapter.rooms;
}
wsServer.on("connection", socket => {
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event:${event}`)
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => socket.to(room).emit("bye"));
        // wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done();
    });
})


 
// const wss = new WebSocket.Server({server});
// const sockets = [];
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser ✅");
//     socket.on("close",() => console.log("Disconnected from Browser ❌"));
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString('ascii'));
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => 
//                     aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//         // console.log(message.toString('ascii'));
//         // sockets.forEach(aSocket => aSocket.send(message.toString('ascii')));
//     });
//     // socket.send("hello!!!!!!!");
// })

httpServer.listen(3000, handleListen);
