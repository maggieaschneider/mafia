const users = [];
const rooms = {};

// Join user to chat
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

var roles = ["townsperson", "townsperson", "townsperson", "townsperson", "townsperson", "sheriff", "doctor", "sniper", "mafia", "mafia"];

function assignRoles (room) {
	
    u = shuffle(rooms[room]);
    
      for (var i = 0; i < u.length; i++) {
          
          u[i].game_role = roles[i];
          u[i].emit('message', { message: 'You have been assigned the role of ' + roles[i]});
        }
  
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  assignRoles,
  rooms
};
