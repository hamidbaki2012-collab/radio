const player = document.getElementById("player");
const volume = document.getElementById("volume");

let isPlaying = false;

// 🎧 PLAY / PAUSE (FIX)
function togglePlay() {
  if (!player) return;

  if (isPlaying) {
    player.pause();
    isPlaying = false;
    return;
  }

  // ⚠️ IMPORTANT: NE PAS FAIRE player.load()
  player.play()
    .then(() => {
      isPlaying = true;
    })
    .catch(err => {
      console.error("PLAY ERROR:", err);
    });
}

// 🔊 VOLUME
if (volume) {
  player.volume = volume.value / 100;

  volume.addEventListener("input", () => {
    player.volume = volume.value / 100;
  });
}

// 👥 LECTURE SHOUTCAST
async function getRadioData() {
  try {
    const url = "https://api.allorigins.win/raw?url=" +
      encodeURIComponent("http://212.84.160.3:9923/7.html?sid=1");

    const res = await fetch(url);
    const text = await res.text();

    console.log("RAW:", text); // DEBUG

    // 🧠 sécurité
    if (!text || text.includes("<html")) {
      setOffline();
      return;
    }

    const parts = text.split(",");

    const listeners = parseInt(parts[0]) || 0;
    const streamStatus = parseInt(parts[1]) || 0;

    document.getElementById("listeners").textContent = listeners;

    const status = document.getElementById("radioStatus");
    const dot = document.getElementById("statusDot");

    if (streamStatus === 1) {
      status.textContent = listeners > 0 ? "🟢 En direct" : "🟡 En attente";
      dot.style.background = listeners > 0 ? "#00ff88" : "#ffcc00";
    } else {
      setOffline();
    }

  } catch (e) {
    console.error(e);
    setOffline();
  }
}

// 🔴 OFFLINE SAFE
function setOffline() {
  document.getElementById("listeners").textContent = "0";
  document.getElementById("radioStatus").textContent = "🔴 Hors ligne";
  document.getElementById("statusDot").style.background = "#ff4b4b";
}

// 🔁 LOOP
setInterval(getRadioData, 8000);
getRadioData();




