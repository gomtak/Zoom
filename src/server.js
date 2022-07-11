import http from "http";
import WebSocket from "ws";
import express, { application } from "express";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');
// const handleListen = () => console.log('Listening on ws://localhost:3000');
// app.listen(3000, handleListen); express 는 웹소캣을 지원하지 않기 때문에 아래와 같이 변경해서 같이 쓸수 있게 만든다.

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

server.listen(3000, handleListen);