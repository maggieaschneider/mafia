const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.write('hello');
  res.end('<h1>we love you rhianna</h1>');
  
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
}); 
