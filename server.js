const http = require("http");
const https = require("https");

// 🔗 SOURCES
const SITE_URL = "https://gnews-radio.listen2myshow.com/";
const SHOUTCAST = "http://212.84.160.3:9923/7.html";

// ===== FETCH HTTPS =====
function fetchHTTPS(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(null));
  });
}

// ===== FETCH HTTP =====
function fetchHTTP(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(null));
  });
}

// ===== EXTRACTION AUDITEURS (ULTRA FIABLE) =====
function extractListeners(text) {
  if (!text) return 0;

  text = text.replace(/<[^>]*>/g, "");

  // 🎯 cas listen2myradio
  let match = text.match(/(\d+)\s*listener/i);
  if (match) return parseInt(match[1]);

  // 🎯 fallback shoutcast
  let numbers = text.match(/\d+/g);
  if (numbers && numbers.length > 1) {
    return parseInt(numbers[1]);
  }

  return 0;
}

// ===== EXTRACTION TITRE =====
function extractTitle(text) {
  if (!text) return null;

  text = text.replace(/<[^>]*>/g, "");

  let match =
    text.match(/Stream Title[^:]*:\s*(.*)/i) ||
    text.match(/Current Song[^:]*:\s*(.*)/i);

  return match ? match[1].trim() : null;
}

// ===== API =====
const server = http.createServer(async (req, res) => {

  if (req.url === "/api") {

    // 🔥 priorité : page officielle
    const siteHTML = await fetchHTTPS(SITE_URL);

    // 🔁 fallback : shoutcast
    const shoutHTML = await fetchHTTP(`${SHOUTCAST}/7.html`);
    const stats = await fetchHTTP(`${SHOUTCAST}/stats?sid=1`);

    // 🔴 OFFLINE TOTAL
    if (!siteHTML && !shoutHTML) {
      return send(res, {
        status: "OFFLINE",
        listeners: 0,
        title: "Aucun flux"
      });
    }

    // 👥 AUDITEURS (priorité site)
    let listeners = extractListeners(siteHTML);

    if (!listeners && shoutHTML) {
      listeners = extractListeners(shoutHTML);
    }

    // 🎵 TITRE
    const title = extractTitle(stats);

    // 🎯 STATUS
    let status = "IDLE";

    if (listeners > 0) status = "LIVE";

    send(res, {
      status,
      listeners,
      title: title || (status === "LIVE" ? "En direct" : "En attente")
    });
  }

  else {
    res.end("API Radio OK");
  }
});

// ===== RESPONSE JSON =====
function send(res, data) {
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

if (req.url === "/api/listeners") {

  let raw = await fetch(`${SHOUTCAST}/7.html?sid=1`);

  let data = parse7(raw);

  // 🔥 FORCE RESPONSE EVEN IF NULL
  if (!data) {
    return send(res, {
      status: "OFFLINE",
      listeners: 0
    });
  }

  return send(res, {
    status: "LIVE",
    listeners: data.listeners || 0
  });
}

// ===== LANCEMENT =====
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🚀 API PRO prête");
});






