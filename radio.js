const player = document.getElementById("player");
const btn = document.getElementById("playBtn");

function togglePlay() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
}

// quand ça joue → rouge
player.addEventListener("play", () => {
  btn.classList.add("active");
  btn.textContent = "⏸ Pause";
});

// quand ça stop → bleu
player.addEventListener("pause", () => {
  btn.classList.remove("active");
  btn.textContent = "▶ Play";
});
