const http = require("http");
const host = 'localhost';
const port = 8000;

const requestListener = (req, res) => {
	console.log(res);
	if (req.method === "GET") {
		if (req.url === '/get') {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end('success');
			return
		}
		res.setHeader('Content-Type', 'text/html');
		res.writeHead(405);
		res.end('HTTP method not allowed Привет');
	}
	// else if (req.method === "POST") {
	// 	res.setHeader('Content-Type', 'text/html');
	// 	res.writeHead(200);
	// 	res.end('success');
	// }


	else {
		res.setHeader('Content-Type', 'text/html');
		res.writeHead(405);
		res.end('HTTP method not allowed');

	}

};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
