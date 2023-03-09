const http = require("http");
const host = 'localhost';
const port = 8000;

const requestListener = (req, res) => {
  if (req.url === '/get') {
    res.writeHead(200);
    res.end('success');
  } else {
    res.writeHead(405);
    res.end('HTTP method not allowed');
  }

  res.writeHead(405);
  res.end('HTTP method not allowed');
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});