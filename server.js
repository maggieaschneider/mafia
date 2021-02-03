var document;
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
//const killPick = document.getElementById('users');
const users = [];
const rooms = {};
var roles = ['townsperson', 'mafia', 'representative', 
'townsperson', 'townsperson', 'townsperson', 'townsperson', 
'townsperson', 'townsperson', 'townsperson'];
var prompts = ['Every chat you send must start with the first letter of your first name', 
'Every chat you send must have full, proper punctuation',
'Every chat you send must have the same number of words as there are letters in your first name.',
'You must target only one person in every chat you send. You cannot ask any one else questions.',
'In every chat you send, you must include an emoticon.',
'In every chat you send, you must include a color in some way.',
'In every chat you send, you must include a number.',
'In every chat you send, you must include an emotion word.',
'Every chat you send must start with the last word of the last chat sent.'];


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
      
      if (rooms[room].length == 5)
    {
      io.emit('message', formatMessage(botName, 'In the game, local townspeople and the mafia are placed in a imaginary village for an all-out battle for survival.\n There are 10 different characters (plus the computer which will act as the moderator) within the game: 8 townspeople, 1 representative, and 1 mafia.\n At night, the moderator will ask the mafia for one person they would like to kill from the group.\n In the morning, the person killed by the mafia will be revealed, and the townspeople may accuse each other in order to figure out the mafia\n They will let the representative who they wish to excute and the rep will have them executed.'));

      
      assignRoles(room);
      
      
      for (var i = 0; i < rooms[room].length; i++) {
        if (roles[i] == ('representative')){
          io.emit('message', formatMessage(botName,"The game will begin now. " + u[i].username + " is the representative. They cannot be voted out and will act as your voice. When you come to a conclusion as to who you want to vote out, the representative will cast your vote. "));
        }
      }
      
      promptsTwo = shuffle(prompts);
      
      for (var i = 0; i < rooms[room].length; i++) {
        if (roles[i] == ('mafia')){
          io.to(u[i].id).emit('message', formatMessage(botName, "You have been given the following prompt. Act in accordance to this prompt in all discussions during the game: " + promptsTwo[i] ))
        }}
        
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
  socket.on('killMafia', id => {
      const user = getCurrentUser(socket.id);
      const chosen = id;
      console.log(user, chosen);
      io.emit('message', formatMessage(botName, "The town has chosen to execute " + chosen));
      kickUser(user.room, chosen);
      rooms[user.room].forEach(e=>{
        console.log(e);
        if (e.username == chosen){
          console.log("leaving");
          socket.leave(e.id);
          io.to(e.id).emit('message', formatMessage(botName, "The people have killed you. Please leave the game."));
          if (e.game_role == ('mafia')){
            io.emit('message', formatMessage(botName, "The townspeople have won the game!  "));
          }
          else{
            io.emit('message', formatMessage(botName, "The person the townspeople voted is not the mafia. The mafia will continue killing."));
          }
        }
      })
  });
      
   socket.on('killUser', id => {
    const user = getCurrentUser(socket.id);
    const choose = id;
    console.log(user, choose);
    io.emit('message', formatMessage(botName, "You have chosen to vote " + choose));
    kickUser(user.room, choose);
    rooms[user.room].forEach(e=>{
      console.log(e);
      if (e.username == choose){
        console.log("leaving");
        socket.leave(e.id);
        io.to(e.id).emit('message', formatMessage(botName, "The mafia has killed you. Please leave the game."));
       
      }
    })
    
    //vote(room);
 });


  // Runs when client disconnects
  socket.on('disconnect', () => {
  const user = userLeave(socket.id);
  users.splice(users.indexOf(user), 1);
  /*console.log(rooms[user.room]);
  rooms[user.room].splice(rooms[user.room].indexOf(user), 1);
  console.log(rooms[user.room]);*/

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
            io.to(u[i].id).emit('message', formatMessage(botName, 'You have been assigned the role of ' + roles[i]));

        }
  }


  function murder(room){
    var user = rooms[room].username;
    // io.to(user.room).emit('message', formatMessage("The mafia will now have 1 minute to decide who to kill"));
    
    for (var i = 0; i < rooms[room].length; i++) {
      if (roles[i] == ('mafia')){
        io.to(u[i].id).emit('message', formatMessage(botName, "Enter the name of the person you would like to kill."));
        // socket.on('killUser', id => {
        //   const user = getCurrentUser(socket.id);
        //   const chosen = msg;
        //   io.emit('message', formatMessage(botName, "The mafia has chosen to kill" + chosen));
        //   kickUser(room, chosen);
        //   vote(room);
        // });
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
         
        io.emit('message', formatMessage(botName, "You have voted out " + rooms[room[pos]]));
        voteOut(room, rooms[room[pos]]);

      };
      // get info of chosen name by votes
    

    function voteOut(chosen)
    { 
      console.log(chosen);
      if (chosen.id === (mafia.id))
      {
        
        io.to(chosen.id).emit('message', formatMessage(botName, "The town has killed you. Please leave the game."));
        io.emit('message', formatMessage(botName, "The town has chosen to execute" + chosen));
        io.emit('message', formatMessage(botName, "The mafia has been voted out. Nice job!"));
      }
      else {
      io.emit('message', formatMessage(botName, "The town has chosen to execute" + chosen));
      io.to(chosen.id).emit('message', formatMessage(botName, "The town has killed you. Please leave the game."));
      murder(room);
      }
    }

    function kickUser(socket){           

      // socket.leave(clientInfo[socket.id].room);
      // delete clientInfo[socket.id];
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