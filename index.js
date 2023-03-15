const http = require("http");
const host = 'localhost';
const port = 8000;
const { fs, promises, unlink } = require('fs');
const path = require('path');

// console.log(unlink);

const user = {
	id: 123,
	username: 'testuser',
	password: 'qwerty'
};

const log = {
  "username": "testuser",
  "password": "qwerty"
}

const content = {
  "filename": "testuser",
  "content": "\nLorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus, ullam ea nesciunt placeat dolore optio voluptatum nisi perspiciatis quibusdam a quam assumenda cum maiores alias sed quo temporibus debitis minima!"
}


function parseCookies(request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(`;`).forEach(function (cookie) {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}


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
      const cookie = parseCookies(req)
      if (cookie?.authorized == 'true' && cookie?.userId === '123') {
        let data = "";
        req.on('data', (chunk) => {
          data += chunk.toString();
        })
        req.on('end', () => {
          try {
            data = JSON.parse(data);
            // console.log(data);
          } catch (error) {
            res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
            res.writeHead(200);
            res.end('Неверный JSON формат');
            return
          }
          if (data?.filename && data?.content !== "") {
            promises.writeFile(`./files/${data.filename}.txt`, data.content, { flag: 'a' })
              .then(() => {
                console.log('File create success')
                res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
                res.writeHead(200);
                res.end('File create success');
              })
              .catch( (err) => {
                res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
                res.writeHead(500);
                res.end('Error write file');
                console.error('Error write file')
              })
          } else {
            res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
            res.writeHead(200);
            res.end('Необходимые данные для записи файла не переданы.');
            console.error('Необходимые данные для записи файла не переданы.')
          }
        })
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end('success');
      }

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
            if (data.username === user.username && data.password === user.password) {
              let date = new Date();
              date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));
              let expires = "; expires=" + date.toUTCString();

              const cookieString1 = `authorized=true; Path=/ ${expires}`;
              const cookieString2 = `userId=123; Path=/ ${expires}`;

              res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
              res.setHeader('Set-Cookie', [cookieString1, cookieString2]);
              res.writeHead(200);
              res.end('auth success');
            } else {
              res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
              res.writeHead(400);
              res.end('Неверный логин или пароль');
            }
					} catch (error) {
						res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
						res.writeHead(200);
						res.end('Неверный JSON формат');
						return
					}
					
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
		if (req.method === "POST") {
      const cookie = parseCookies(req)
      if (cookie?.authorized == 'true' && cookie?.userId === '123') {
        let data = "";
        req.on('data', (chunk) => {
          data += chunk.toString();
        })
        req.on('end', () => {
          try {
            data = JSON.parse(data);
            if (data['filename'] !== undefined) {
              unlink(`./files/${data.filename}.txt`, (err) => {
                if (err) {
                  res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
                  res.writeHead(500);
                  res.end(`Файл не найден или ошибка удаления файла ${data.filename}.txt !`);
                } else {
                  console.log('File was deleted');
                  res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
                  res.writeHead(200);
                  res.end(`Файл ${data.filename}.txt был удален!`);
                }
              });
            } else {
              res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
              res.writeHead(200);
              res.end(`Необходимые данные для удаления файла не переданы.`);
            }
          } catch (error) {
            res.setHeader('Content-Type', 'text/html', "charset=UTF-8");
            res.writeHead(200);
            res.end('Неверный JSON формат');
            return
          }
        })
        





      } else {
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end('success');
      }
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
