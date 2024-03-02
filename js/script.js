let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const getSongs = async () => {
  let songsData = await fetch("./songs/");
  let response = await songsData.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let songLinks = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < songLinks.length; index++) {
    const element = songLinks[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  return songs;
};

const playMusic = (songUrl, songName) => {
  currentSong.src = songUrl;
  currentSong.play();
  play.src = "./assets/img/pause.svg";

  document.querySelector(".song-info").innerHTML = songName;
};

async function main() {
  // Get the list of all songs
  let songs = await getSongs();

  // to set the deafult currentSong
  currentSong.src = songs[3];

  // Show all the songs in playlist
  let songsUl = document.querySelector(".song-list ul");

  for (const song of songs) {
    let songName = song
      .split("/songs/")[1]
      .split(".mp3")[0]
      .replaceAll("_", " ")
      .replaceAll("%20", " ");

    songsUl.innerHTML += `<li class="flex items-center pointer">
      <img src="./assets/img/music.svg" alt="music icon" class="invert-1" width="32"/>
      <div class="info">
        <div class="song-name" data-link = ${song}>${songName}</div>
        <div class="song-artitst light-gray">CoderrShyam</div>
      </div>
      <div class="playnow flex items-center">
        <span>Play now</span>
        <img src="./assets/img/playrounded.svg" alt="play btn" class="invert-1" width="28"/>
      </div>
    </li>`;

    // Attach an Event listener to each song

    Array.from(document.querySelectorAll(".song-list li")).forEach(
      (element) => {
        element.addEventListener("click", () => {
          let infoDiv = element.querySelector(".info div");
          playMusic(infoDiv.getAttribute("data-link"), infoDiv.innerHTML);
        });
      }
    );
  }
  // Attach an Event listener to play next and previous song

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./assets/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./assets/img/playrounded.svg";
    }
  });

  // Listen fot time update event

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    document.querySelector(".circle").style.left = `${eval(
      (currentSong.currentTime / currentSong.duration) * 100
    )}%`;
  });

  // Add an event listener to seekbar

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let manyLeft = eval(
      (e.offsetX / e.target.getBoundingClientRect().width) * 100
    );

    document.querySelector(".circle").style.left = `${manyLeft}%`;

    currentSong.currentTime = (currentSong.duration * manyLeft) / 100;
  });

  // Add event listener to open & close sidebar

  hamburger.addEventListener("click", () => {
    left.style.left = "0";
  });

  document.querySelector("#close").addEventListener("click", () => {
    left.style.left = "-200%";
  });
}

main();
