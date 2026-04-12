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
    const res = await fetch("https://radio-42po.onrender.com/api/listeners");
    const data = await res.json();

    console.log("API:", data);

    document.getElementById("listeners").textContent = data.listeners;

    const status = document.getElementById("radioStatus");
    const dot = document.getElementById("statusDot");

    if (data.status === "LIVE") {
      status.textContent = "🟢 En direct";
      dot.style.background = "#00ff88";
    }

    else if (data.status === "IDLE") {
      status.textContent = "🟡 En attente";
      dot.style.background = "#ffcc00";
    }

    else {
      status.textContent = "🔴 Hors ligne";
      dot.style.background = "#ff4b4b";
    }

  } catch (e) {
    console.error(e);
    document.getElementById("listeners").textContent = "0";
    document.getElementById("radioStatus").textContent = "🔴 Hors ligne";
  }
}

setInterval(getRadioData, 8000);
getRadioData();




