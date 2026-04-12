const http = require("http");
const https = require("https");

const STREAM_URL = "http://212.84.160.3:9923/;";

function fetch(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https") ? https : http;

    lib.get(url, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(null));
  });
}

const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    // 🔥 test simple : stream accessible ?
    const test = await fetch(STREAM_URL);

    const isOnline = test !== null;

    let status = "OFFLINE";

    if (isOnline) status = "LIVE";

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });

    return res.end(JSON.stringify({
      status,
      listeners: 0, // ⚠️ Listen2MyRadio bloque souvent cette info
      title: isOnline ? "En direct" : "Serveur hors ligne"
    }));
  }

  res.end("OK");
});

server.listen(3000, () => {
  console.log("API OK");
});






