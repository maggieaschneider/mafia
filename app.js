const http = require('http');
const port = process.env.PORT || 3000
var io = require('socket.io')(http);



const server = http.createServer((req, res) => {
    
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<h1 style="color: #731768;"> we love you rhianna </h1>');
  res.end('<p style = "color: blue"> hello </p>');
  
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