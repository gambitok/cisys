const http = require('http');

http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end("Hello, World!n");
}).listen(process.env.PORT);

console.log('App is running...');