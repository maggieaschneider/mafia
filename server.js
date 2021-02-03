var document;
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
//const killPick = document.getElementById('users');
const users = [];
const rooms = {};
var roles = ['townsperson', 'mafia', 'townsperson', 
'townsperson', 'townsperson', 'townsperson', 'townsperson', 
'townsperson', 'townsperson', 'townsperson'];

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
      
      if (rooms[room].length == 2)
    {
      socket.emit('message', formatMessage('In the game, local townspeople and the mafia are placed in a imaginary village for an all-out battle for survival.'));
      socket.emit('message', formatMessage('There are 10 different roles (plus the computer which will act as the moderator) within the game: 6 townspeople, 1 sheriff, 1 doctor, 1 sniper, and 1 mafia'));
      socket.emit('message', formatMessage('At night, the moderator will ask the mafia for one person they would like to kill from the group.'));
      // socket.broadcast.to(user.room).emit('However, that is not all: the moderator will also ask the sheriff to pick someone they are suspicious of, and they will be confirmed on whether the person they choose is or not the mafia')
      // socket.broadcast.to(user.room).emit('The modertor will ask the doctor to choose a random person to save from being killed. The sniper is given 1 bullet, to try to kill the mafia. They will be asked every night if they would like to snipe someone, but they do not have to take this chance until they are ready to.')
      socket.emit('message', formatMessage('In the morning, the person killed by the mafia will be revealed, and the townspeople may accuse each other in order to figure out the mafia'));
      
      assignRoles(room);
      
      socket.emit('message', formatMessage("The game will begin now."));
      murder(room);

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
    const mesg = msg;
  

    io.to(user.room).emit('message', formatMessage(user.username, msg));
});




  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    users.splice(users.indexOf(user), 1);
    /*console.log(rooms[user.room]);
    rooms[user.room].splice(rooms[user.room].indexOf(user), 1);
    console.log(rooms[user.room]);*/

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

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
            io.to(u[i].id).emit('message', formatMessage(u[i].username, 'You have been assigned the role of ' + roles[i]));

        }
  }

  function murder(room){
    var user = rooms[room].username;
    // io.to(user.room).emit('message', formatMessage("The mafia will now have 1 minute to decide who to kill"));
    
    for (var i = 0; i < rooms[room].length; i++) {
      if (roles[i] == ('mafia')){
        io.to(u[i].id).emit('message', formatMessage(u[i].username, "Choose the name of the person you would like to kill. If you do not choose a name within 60 seconds, one random person will be killed"));
        socket.on('killUser', id => {
          const user = getCurrentUser(socket.id);
          const chosen = msg;
          socket.emit('message', formatMessage("The mafia has chosen to kill", chosen));
          kickUser(room, chosen);
          vote(room, chosen);
        });
      }
    }
    
  
  };
  function vote(room)
    {
  socket.on('voteMafia', id => {
        const user = getCurrentUser(socket.id);
        const chosen = msg;
        const votes = [rooms[room].length];

        for (var i = 0; i < rooms[room].length; i++)
        {
          if (chosen === rooms[room[i]]){
            votes[i]++;
          }
        }
      });

        // find pos of highest
        // chosen = pos of highest
        
          var pos = 0;
        
          for(var i = 1; i < rooms[room].length; i++){
            if (rooms[room[i]] > rooms[room[pos]]){
              pos = i;
            }
          }
         
        socket.emit('message', formatMessage("You have voted out ", rooms[room[pos]]));
        voteOut(room, rooms[room[pos]]);

      };
      // get info of chosen name by votes
    

    function voteOut(room, chosen)
    { 
      console.log(chosen);
      if (chosen.id === (mafia.id))
      {
        socket.emit('message', formatMessage("The town has chosen to execute", chosen));
        socket.emit('message', formatMessage("The mafia has been voted out. Nice job!"));
        kickUser(chosen);
      }
      else {
      kickUser(chosen);
      murder(room);
      }
    }

    function kickUser(socket){           

      socket.leave(clientInfo[socket.id].room);
      delete clientInfo[socket.id];
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