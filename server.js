const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const users = [];
const rooms = {};
var roles = ["townsperson", "townsperson", "townsperson", 
"townsperson", "townsperson", "sheriff", "doctor", 
"sniper", "mafia", "mafia"];

/*const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  assignRoles,
  rooms
} = require('./utils/users');*/

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'mafia bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    //users.assignRoles()
    

    socket.join(user.room);
    

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Mafia!'));
    

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );
      
      if(rooms[room].length == 10)
    {
      assignRoles(room);
    }
      

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
    

  });
  
  
  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    console.log(user);
    users.splice(users.indexOf(user), 1);
    /*console.log(rooms[user.room]);
    rooms[user.room].splice(rooms[user.room].indexOf(user), 1);
    console.log(rooms[user.room]);*/

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      
    }
    
  });
  

  function userJoin(id, username, room) {
    const user = { id, username, room };
  
    users.push(user);
    if(!(room in rooms))
    {
      rooms[room] = [];
    }
  
    rooms[room].push(user);
  
    return user;
  }
  
  // Get current user
  function getCurrentUser(id) {
    return users.find(user => user.id === id);
  }
  
  // User leaves chat
  function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
  
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
  }
  
  // Get room users
  function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }
  
  
  

  function assignRoles (room) {
    
      u = shuffle(rooms[room]);
      
        for (var i = 0; i < u.length; i++) {
            
            
            u[i].game_role = roles[i];
            console.log(u[i]);
            io.to(u[i].id).emit('message', formatMessage(u[i].username, 'You have been assigned the role of ' + roles[i]));
          }
    
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
});

const PORT = process.env.PORT || 900;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
