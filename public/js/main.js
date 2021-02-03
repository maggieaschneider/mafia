var document;
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const select = document.createElement('select');


// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });


// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  console.log('roomUsers', users);
  outputRoomName(room);
  outputUsers(users);
});

// Kill person (mafia kills user) ?
// socket.emit('mafiakillingUser', {username});

// Get person that mafia kills
socket.on('mafiaKillingUser', ({users}) => {
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('send', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


chatForm.addEventListener('kill', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  socket.disconnect(msg.id);
  if (!msg){
    return false;
  }


  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  div.appendChild(p);
  window.scrollBy(0, 100);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function killUser(users) {
   select.id = "users";
   select.name = "users";
   select.class = "fas fa-users";


   for (const val of rooms[room].username) {
     var option = document.createElement("option");
     option.value = val;
     select.appendChild(option);
     document.addChild(select);
   }

     var button = document.getElementById("users");
     button.onClick=function(){
     console.log(select.options[select.selectedIndex].value);
     socket.emit('killUser', select.options[select.selectedIndex].value);
   }
 }

function voteMafia(users) {
  select.id = "users";
  select.name = "users";
  select.class = "fas fa-users";


  for (const val of rooms[room].username) {
    var option = document.createElement("option");
    option.value = val;
    select.appendChild(option);
    document.addChild(select);
  }

  var button = document.getElementById("users");
  button.onClick=function(){
    console.log(select.options[select.selectedIndex].value);
    socket.emit('killUser', select.options[select.selectedIndex].value);
  }
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }
