const http = require("http");

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

    // 🔴 SERVEUR INJOIGNABLE
    if (!data) {
      return send(res, {
        status: "OFFLINE",
        listeners: 0,
        title: "Serveur hors ligne"
      });
    }

    const listeners = data.listeners || 0;
    const streamStatus = data.streamstatus; // 🔥 clé importante
    const title = data.songtitle || "";

    let status = "OFFLINE";

    if (streamStatus === 1) {
      status = listeners > 0 ? "LIVE" : "IDLE";
    } else {
      status = "OFFLINE";
    }

    send(res, {
      status,
      listeners,
      title: title || (status === "LIVE" ? "En direct" : "Aucun flux")
    });
  }

  else {
    res.end("API Radio OK");
  }
});

// ===== RESPONSE =====
function send(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(data));
}

// ===== START =====
server.listen(3000, () => {
  console.log("🚀 API prête : /api/listeners");
});


