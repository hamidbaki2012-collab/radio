const http = require("http");

const server = http.createServer((req, res) => {

  if (req.url === "/api/listeners") {

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });

    return res.end(JSON.stringify({
      listeners: 0 // ou estimation si tu veux
    }));
  }

  res.end("OK");
});

server.listen(3000);






