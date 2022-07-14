const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}
let roomName;

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, ()=> {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom(){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;
    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
}
function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value =""
}
form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    console.log(newCount);
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    console.log(newCount);
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left ㅠㅠ`);
});
socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector('ul');
    if(rooms.length===0){
        roomList.innerHTML = "";
        return;    
    }
    console.log(rooms);
    
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
});