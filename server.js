const http = require("http");

const SHOUTCAST_URL = "http://212.84.160.3:9923/7.html";

// ===== FETCH ROBUSTE =====
function fetchData(url) {
  return new Promise((resolve) => {

    const req = http.get(url, { timeout: 5000 }, (res) => {
      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => resolve(data));
    });

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });

  });
}

// ===== API =====
const server = http.createServer(async (req, res) => {

  if (req.url === "/api/listeners") {

    const data = await fetchData(SHOUTCAST_URL);

    // 🔴 DEBUG
    if (!data) {
      return send(res, {
        status: "OFFLINE",
        listeners: 0,
        title: "Inaccessible depuis Render"
      });
    }

    const parts = data.split(",");

    const listeners = parseInt(parts[0]) || 0;
    const streamStatus = parseInt(parts[1]) || 0;
    const title = parts[6] || "";

    let status = "OFFLINE";

    if (streamStatus === 1) {
      status = listeners > 0 ? "LIVE" : "IDLE";
    }

    send(res, {
      status,
      listeners,
      title
    });

  } else {
    res.end("API OK");
  }
});

// ===== RESPONSE =====
function send(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(data));
}

server.listen(3000, () => {
  console.log("🚀 API running");
});




