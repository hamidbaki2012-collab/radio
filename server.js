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

// 🔥 parse SHOUTCAST 7.html
function parse7html(text) {
  if (!text) return null;

  const parts = text.split(",");

  return {
    listeners: parseInt(parts[0]) || 0,
    status: parseInt(parts[1]) || 0
  };
}

const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    const raw = await fetch(`${SHOUTCAST}/7.html?sid=1`);

    const data = parse7html(raw);

    // ❌ si aucune réponse = OFFLINE réel
    if (!data) {
      return send(res, {
        status: "OFFLINE",
        listeners: 0
      });
    }

    // 🔥 logique correcte
    let status = "OFFLINE";

    if (data.status === 1) {
      status = data.listeners > 0 ? "LIVE" : "IDLE";
    }

    return send(res, {
      status,
      listeners: data.listeners
    });
  }

  res.end("OK");
});

function send(res, data) {
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(data));
}

server.listen(3000, () => {
  console.log("🚀 API OK : /api/listeners");
});







