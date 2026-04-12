const player = document.getElementById("player");
const statusText = document.getElementById("radioStatus");
const statusDot = document.getElementById("statusDot");
const listenersBox = document.getElementById("listenersBox");

let isPlaying = false;

// 🎧 PLAY / PAUSE
function togglePlay() {
  if (isPlaying) {
    player.pause();
  } else {
    player.play().catch(() => {
      setOffline();
    });
  }
}

// 🔴 OFFLINE
function setOffline() {
  statusText.textContent = "🔴 Hors ligne";
  statusDot.style.background = "red";
}

// 🟡 LOADING
function setLoading() {
  statusText.textContent = "🟡 Chargement...";
  statusDot.style.background = "orange";
}

// 🟢 LIVE
function setLive() {
  statusText.textContent = "🟢 En direct";
  statusDot.style.background = "#00ff88";
}

// 🎧 AUDIO EVENTS (TRÈS IMPORTANT)
player.addEventListener("playing", () => {
  isPlaying = true;
  setLive();
});

player.addEventListener("pause", () => {
  isPlaying = false;
  setOffline();
});

player.addEventListener("waiting", () => {
  setLoading();
});

player.addEventListener("error", () => {
  setOffline();
});

// 📡 API FETCH
async function updateStats() {
  try {
    const res = await fetch("https://radio-42po.onrender.com/api/listeners");

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    // 👥 AUDITEURS
    listenersBox.textContent =
      data.listeners > 0 ? `${data.listeners} auditeurs` : "Live";

    // 🔥 STATUS (IMPORTANT)
    if (data.status === "LIVE") {
      setLive();
    } else {
      setOffline();
    }

  } catch (e) {
    setOffline();
    listenersBox.textContent = "En direct";
  }
}

// 🔁 LOOP
setInterval(updateStats, 8000);
updateStats();
