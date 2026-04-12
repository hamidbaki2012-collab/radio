const http = require("http");

// 🔗 SHOUTCAST JSON DIRECT
const SHOUTCAST_JSON = "http://212.84.160.3:9923/stats?json=1";

// ===== FETCH JSON =====
function fetchJSON(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(null);
        }
      });
    }).on("error", () => resolve(null));
  });
}

// ===== API =====
const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    const data = await fetchJSON(SHOUTCAST_JSON);

    // 🔴 OFFLINE
    if (!data) {
      return send(res, {
        status: "OFFLINE",
        listeners: 0,
        title: "Aucun flux"
      });
    }

    const listeners = data.listeners || 0;
    const title = data.songtitle || "En direct";

    let status = "IDLE";
    if (listeners > 0) status = "LIVE";

    send(res, {
      status,
      listeners,
      title
    });
  }

  else {
    res.end("API Radio OK");
  }
});

// ===== RESPONSE =====
function send(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*"); // 🔥 important pour ton site GitHub
  res.end(JSON.stringify(data));
}

// ===== START =====
server.listen(3000, () => {
  console.log("🚀 API prête : http://localhost:3000/api/listeners");
});

