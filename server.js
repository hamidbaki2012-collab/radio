const http = require("http");
const https = require("https");

const SHOUTCAST = "http://212.84.160.3:9923";

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

function parse7html(text) {
  if (!text) return { listeners: 0, status: 0 };

  const parts = text.split(",");

  return {
    listeners: parseInt(parts[0]) || 0,
    status: parseInt(parts[1]) || 0
  };
}

const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    const data = await fetch(`${SHOUTCAST}/7.html?sid=1`);

    const parsed = parse7html(data);

    let state = "OFFLINE";

    if (parsed.status === 1) {
      state = parsed.listeners > 0 ? "LIVE" : "IDLE";
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });

    return res.end(JSON.stringify({
      status: state,
      listeners: parsed.listeners
    }));
  }

  res.end("OK");
});

server.listen(3000, () => {
  console.log("API RUN http://localhost:3000/api/listeners");
});





