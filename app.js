<<<<<<< HEAD
=======
const http = require('http');
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<h1>rhianna sucks</h1>');
});

server.listen(port,() => {
  console.log(`Server running at port `+port);
}); 
>>>>>>> 2d896c4654b5cd3abf6b1c8223e2c681a2719658
