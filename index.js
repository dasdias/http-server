const http = require("http");
const host = 'localhost';
const port = 8000;
const fs = require('fs');
const path = require('node:path');

const user = {
	id: 123,
	username: 'testuser',
	password: 'qwerty'
};


const root = process.cwd()
const curPath = path.join(__dirname, 'files')

const requestListener = (req, res) => {
	if (req.url === '/get') {
		if (req.method === "GET") {
			try {
				const curPath = path.join(__dirname, 'files')
				const data = fs.readdirSync(curPath, 'utf8')
				res.setHeader('Content-Type', 'text/html');
				res.writeHead(200);
				res.end(data.toString());
			} catch (error) {
				res.setHeader('Content-Type', 'text/html');
				res.writeHead(500);
				res.end('Internal server error');
			}
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(405);
			res.end('HTTP method not allowed');
		}
	} else if (req.url === '/post') {
		if (req.method === "POST") {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end('success');
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(405);
			res.end('HTTP method not allowed');
		}
	} else if (req.url === '/auth') {
		if (req.method === "POST") {
			let data = "";
			req.on('data', (chunk) => {
				data += chunk.toString();
			})
			req.on('end', () => {
				if (data) {
					try {
						data = JSON.parse(data);
					} catch (error) {
						res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
						res.writeHead(200);
						res.end('Неверный JSON формат');
						return
					}
					if (data.username === user.username && data.password === user.password) {

						res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
						// console.log(res);
						res.setHeader('Cookie', ['authorized=true', 'userId=123']);
						// res.cookie('authorized', true, { maxAge: 900000, httpOnly: true });
						res.writeHead(200);
						res.end('auth success');
					} else {
						res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
						res.writeHead(400);
						res.end('Неверный логин или пароль');
					}
					// console.log(JSON.parse(data));

				} else {
					res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
					res.writeHead(200);
					res.end('Необходимо авторизоваться');
				}
			})

		} else {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(405);
			res.end('HTTP method not allowed');
		}
	}
	else if (req.url === '/delete') {
		if (req.method === "DELETE") {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end('success');
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(405);
			res.end('HTTP method not allowed');
		}
	} else if (req.url === '/redirect') {
		if (req.method === "GET") {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end('<a href="/redirected">resource constantly available at /redirected</a>');
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(405);
			res.end('HTTP method not allowed');
		}
	} else if (req.url === '/redirected') {
		if (req.method === "GET") {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(200);
			res.end('<p>redirected page</p>');
		} else {
			res.setHeader('Content-Type', 'text/html');
			res.writeHead(405);
			res.end('HTTP method not allowed');
		}
	} else {
		res.setHeader('Content-Type', 'text/html');
		res.writeHead(404);
		res.end('not found');
	}
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
	console.log(`Server is running on http://${host}:${port}`);
});
