const player = document.getElementById("player");
const btn = document.getElementById("playBtn");

function setPlay() {
  btn.classList.add("not-playing");
  btn.classList.remove("playing");
}

function setPause() {
  btn.classList.add("playing");
  btn.classList.remove("not-playing");
}

function togglePlay() {
  if (player.paused) {
    player.play();
    setPause();
  } else {
    player.pause();
    setPlay();
  }
}

// sync sécurité
player.addEventListener("play", setPause);
player.addEventListener("pause", setPlay);

// état initial
setPlay();
