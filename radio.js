const player = document.getElementById("player");
const btn = document.getElementById("playBtn");

const statusText = document.getElementById("radioStatus");
const statusDot = document.getElementById("statusDot");
const listenersBox = document.getElementById("listenersBox");

// 🔵 INIT
statusText.textContent = "Chargement...";
statusDot.style.background = "orange";

// ▶ PLAY / PAUSE
function togglePlay() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

// 🟢 LIVE (audio réellement en lecture)
player.addEventListener("playing", () => {
  statusText.textContent = "🟢 En direct";
  statusDot.style.background = "#00ff88";

  btn.classList.add("active");
  btn.textContent = "⏸ Pause";
});

// 🟡 BUFFERING
player.addEventListener("waiting", () => {
  statusText.textContent = "🟡 Chargement...";
  statusDot.style.background = "orange";
});

// 🔴 OFFLINE
player.addEventListener("error", () => {
  statusText.textContent = "🔴 Hors ligne";
  statusDot.style.background = "red";
});

// 🟣 PAUSE MANUELLE
player.addEventListener("pause", () => {
  statusText.textContent = "🔴 Hors ligne";
  statusDot.style.background = "red";

  btn.classList.remove("active");
  btn.textContent = "▶ Play";
});

const wave = document.getElementById("radioWave");

// quand PLAY
player.addEventListener("playing", () => {
  wave.style.display = "flex";
});

// quand PAUSE
player.addEventListener("pause", () => {
  wave.style.display = "none";
});

// si erreur
player.addEventListener("error", () => {
  wave.style.display = "none";
});


// 📡 AUDITEURS (API)
async function loadStats() {
  try {
    const res = await fetch("https://radio-42po.onrender.com/api/listeners");
    const data = await res.json();

    listenersBox.textContent =
      data.listeners > 0
        ? `${data.listeners} auditeurs`
        : "";

  } catch (e) {
    listenersBox.textContent = "";
  }
}

setInterval(loadStats, 8000);
loadStats();
