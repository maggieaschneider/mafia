const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>rhianna sucks</h1>');
  res.setText('Content-Type', 'text/html');
  res.end('<h2>yes</h2>');
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
}); 
