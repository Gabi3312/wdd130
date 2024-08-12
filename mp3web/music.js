const playlistData = [
    { id: 1, title: "Basket Case", artist: "Green Day", album: "Dookie", dateAdded: "Green Day", duration: "2:55", audioSrc: "Basket case by Chester.mp3", albumCover: "dookie.jpg" },
    { id: 2, title: "While My Guitar Gently Weeps", artist: "The Beatles", album: "The Beatles", dateAdded: "The Beatles", duration: "3:35", audioSrc: "While my guitar gently weeps by Chester.mp3", albumCover: "beatles.jpg" },
    { id: 3, title: "Misunderstood", artist: "Bon Jovi", album: "Bounce", dateAdded: "Bon Jovi", duration: "3:58", audioSrc: "Misunderstood by Chester.mp3", albumCover: "bounce.jpg" },
    { id: 4, title: "Bohemian Rhapsody", artist: "Freddie Mercury", album: "Bohemian Rhapsody", dateAdded: "Freddie Mercury", duration: "5:32", audioSrc: "Chester and Freddie Bohemian.mp3", albumCover: "bohemian.jpg" },
    { id: 5, title: "Can You Feel ", artist: "Elton John", album: "The Lion King", dateAdded: "Elton John", duration: "4:02", audioSrc: "Can you feel by Chester.mp3", albumCover: "king.jpg" },
    { id: 6, title: "Wow! That´s Loud", artist: "Green Day", album: "¡Dos!", dateAdded: "Green Day", duration: "3:17", audioSrc: "Wow! That´s Loud.mp3", albumCover: "dos.jpg" },
];

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let audio = new Audio();
let currentPlayingButton = null;

function renderPlaylist() {
    const tbody = document.querySelector('#playlist tbody');
    tbody.innerHTML = '';
    playlistData.forEach((song, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${song.id}</td>
            <td>
                <button class="play-button" data-index="${index}">
                    <img src="play.png" alt="Play" class="play-icon">
                </button>
                ${song.title}
            </td>
            <td>${song.album}</td>
            <td>${song.dateAdded}</td>
            <td>${song.duration}</td>
            <td>
                <a href="${song.audioSrc}" download="${song.title}.mp3" class="download-button">
                    <img src="down_circle_arrow_icon_263573.png" alt="Descargar">
                </a>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            if (currentPlayingButton === button && isPlaying) {
                pauseSong();
            } else {
                playSong(index);
            }
        });
    });
}

function playSong(index) {
    if (currentPlayingButton) {
        currentPlayingButton.querySelector('img').src = 'play.png';
        currentPlayingButton.classList.remove('playing');
    }

    currentPlayingButton = document.querySelector(`.play-button[data-index="${index}"]`);
    currentPlayingButton.querySelector('img').src = 'pause.png';
    currentPlayingButton.classList.add('playing');

    currentSongIndex = index;
    const song = playlistData[index];
    document.getElementById('songTitle').textContent = song.title;
    document.getElementById('artistName').textContent = song.artist;
    document.getElementById('albumCover').src = song.albumCover;

    if (audio.src !== song.audioSrc) {
        audio.src = song.audioSrc;
        audio.currentTime = 0;
    }

    audio.play();
    isPlaying = true;
    updatePlayPauseButton();
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayPauseButton();
    if (currentPlayingButton) {
        currentPlayingButton.querySelector('img').src = 'play.png';
        currentPlayingButton.classList.remove('playing');
    }
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        if (currentPlayingButton) {
            const index = parseInt(currentPlayingButton.getAttribute('data-index'));
            playSong(index);
        } else {
            playSong(0);
        }
    }
}

function updatePlayPauseButton() {
    const playPauseIcon = document.getElementById('playPauseIcon');
    playPauseIcon.src = isPlaying ? 'pause2.png' : 'play2.png';
}

function nextSong() {
    const nextIndex = isShuffle ? Math.floor(Math.random() * playlistData.length) : (currentSongIndex + 1) % playlistData.length;
    playSong(nextIndex);
}

function prevSong() {
    const prevIndex = isShuffle ? Math.floor(Math.random() * playlistData.length) : (currentSongIndex - 1 + playlistData.length) % playlistData.length;
    playSong(prevIndex);
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTime.textContent = formatTime(audio.currentTime);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
    renderPlaylist();

    document.getElementById('playPauseButton').addEventListener('click', togglePlayPause);
    document.getElementById('nextButton').addEventListener('click', nextSong);
    document.getElementById('prevButton').addEventListener('click', prevSong);

    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleButton.classList.toggle('button-active', isShuffle);
    });

    const repeatButton = document.getElementById('repeatButton');
    repeatButton.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle('button-active', isRepeat);
    });

    const progressBar = document.getElementById('progressBar');
    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            playSong(currentSongIndex);
        } else {
            nextSong();
        }
    });

    const volumeBar = document.getElementById('volumeBar');
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
    });
    volumeBar.value = audio.volume * 100;

    const themeToggleBtn = document.getElementById('themeToggle');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggleBtn.textContent = document.body.classList.contains('dark-theme') ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro';
    });
});