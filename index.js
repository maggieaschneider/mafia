var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('sendMessage', function (data) {
  socket.broadcast.emit('message', data);
  socket.emit('message', { text: data.text });   
  });   
});

http.listen(2000, () => {
  console.log('listening on *:2000');
});
  
