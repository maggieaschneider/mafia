var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
 
app.get('/', (req, res) => {
 res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', (socket) => {
 console.log('a user connected');
 socket.on('disconnect', () => {
   console.log('user disconnected');
 });
 socket.on('chat message', (msg) => {
   io.emit('chat message', msg);
 });
}); 
 
server.listen(port,() => {
  console.log(`Server running at port `+port);
});
 

