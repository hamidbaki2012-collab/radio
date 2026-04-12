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

// 🔥 SAFE PARSER (IMPORTANT)
function parse7(text) {
  if (!text) return null;

  text = text.replace(/<[^>]*>/g, "").trim();

  const parts = text.split(",");

  if (parts.length < 2) return null;

  return {
    listeners: parseInt(parts[0]) || 0,
    rawStatus: parts[1]
  };
}

const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    const raw = await fetch(`${SHOUTCAST}/7.html?sid=1`);

    const data = parse7(raw);

    // 🔥 IMPORTANT FIX
    let status = "OFFLINE";

    if (data) {
      // ⚠️ ne plus dépendre strictement de "1"
      status = "LIVE";
    }

    const listeners = data ? data.listeners : 0;

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
  console.log("API READY");
});







