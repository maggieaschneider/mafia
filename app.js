const port = process.env.PORT || 3000
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

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
  console.log(`Server running at port `+port);
}); 
