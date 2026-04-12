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

    if (!res.ok) throw new Error("API error");

    const data = await res.json();

    const status = document.getElementById("radioStatus");
    const dot = document.getElementById("statusDot");

    // 🔥 FORCE UI UPDATE ALWAYS
    if (data.status === "LIVE") {
      status.textContent = "🟢 En direct";
      dot.style.background = "#00ff88";
    } 
    else {
      status.textContent = "🔴 Hors ligne";
      dot.style.background = "#ff4b4b";
    }

    document.getElementById("listeners").textContent =
      data.listeners > 0 ? data.listeners : "0";

  } catch (e) {
    // 🔥 CRITICAL FIX
    document.getElementById("radioStatus").textContent = "🔴 Hors ligne";
    document.getElementById("listeners").textContent = "0";
    document.getElementById("statusDot").style.background = "#ff4b4b";
  }
}

setInterval(getRadioData, 8000);
getRadioData();






