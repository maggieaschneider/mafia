const http = require('http');
const port = process.env.PORT || 3000
// var io = require('socket.io')(http);


const server = http.createServer((req, res) => {
    
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('<h1>we love you rhianna</h1>', <style>'color: red'</style>);
  res.end('hello');
  
});


server.listen(port,() => {
  console.log(`Server running at port `+port);
}); 