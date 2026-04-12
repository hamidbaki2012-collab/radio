const player = document.getElementById("player");
const volume = document.getElementById("volume");

let isPlaying = false;

// 🎧 PLAY
function togglePlay() {
  if (isPlaying) {
    player.pause();
    isPlaying = false;
  } else {
    player.play().catch(console.error);
    isPlaying = true;
  }
}

// 🔊 VOLUME
volume.addEventListener("input", () => {
  player.volume = volume.value / 100;
});

console.log("RAW DATA:");
console.log(text);

// 👥 RADIO DATA
async function getRadioData() {
  try {
    const url = "http://212.84.160.3:9923/7.html";

    const res = await fetch(
      "https://api.allorigins.win/raw?url=" + encodeURIComponent(url)
    );

    const text = await res.text();

    const parts = text.split(",");

    const listeners = parseInt(parts[0]) || 0;
    const streamStatus = parseInt(parts[1]) || 0;

    document.getElementById("listeners").textContent = listeners;

    const status = document.getElementById("radioStatus");
    const dot = document.getElementById("statusDot");

    if (!status || !dot) return;

    if (streamStatus === 1) {
      if (listeners > 0) {
        status.textContent = "🟢 En direct";
        dot.style.background = "#00ff88";
      } else {
        status.textContent = "🟡 En attente";
        dot.style.background = "#ffcc00";
      }
    } else {
      status.textContent = "🔴 Hors ligne";
      dot.style.background = "#ff4b4b";
    }

  } catch (e) {
    console.error(e);
    document.getElementById("listeners").textContent = "0";
    document.getElementById("radioStatus").textContent = "🔴 hors ligne";
  }
}

// 🔁 refresh
setInterval(getRadioData, 8000);
getRadioData();

