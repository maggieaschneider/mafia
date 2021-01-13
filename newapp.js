//const http = require('http');
const port = process.env.PORT || 80
const app = require('express')();
const http = require('http').Server(app);
//const server = http.createServer(app);
const io = require('socket.io')(http);

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
  res.sendFile(__dirname + '/index.html');
 });
http.listen(port,() => {
  console.log('Server running at port' +port);
}); 
