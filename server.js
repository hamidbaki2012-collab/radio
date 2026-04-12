const http = require("http");
const https = require("https");

const STREAM = "http://212.84.160.3:9923/7.html?sid=1";

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

// 🔥 lecture 7.html Listen2MyRadio
function parse7html(text) {
  if (!text) return null;

  text = text.replace(/<[^>]*>/g, "").trim();
  const parts = text.split(",");

  if (parts.length < 2) return null;

  return {
    listeners: parseInt(parts[0]) || 0,
    status: parseInt(parts[1]) || 0
  };
}

const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    const raw = await fetch(`${STREAM}/7.html?sid=1`);

    const data = parse7html(raw);

    let status = "OFFLINE";
    let listeners = 0;

    if (data) {
      status = "LIVE";
      listeners = data.listeners;
    }

    res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });

    return res.end(JSON.stringify({
      status,
      listeners
    }));
  }

  res.end("OK");
});

server.listen(3000, () => {
  console.log("🚀 API OK : https://radio-42po.onrender.com/listeners");
});







