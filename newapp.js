//const http = require('http');
const port = process.env.PORT || 900
const app = require('express')();
const http = require('http').Server(app);
//const server = http.createServer(app);
const io = require('socket.io')(http);

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, room });
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }



 
  


  


// const server = http.createServer((req, res) => {
    
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/html');
//   res.write('<h1>we love you rhianna</h1>');
//   res.end('hello');
  
// });
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
 }); 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/newindex.html');
 });
http.listen(port,() => {
  console.log('Server running at port' +port);
}); 
