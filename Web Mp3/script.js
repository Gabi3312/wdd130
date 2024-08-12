const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const seekSlider = document.getElementById('seek-slider');
const currentTimeElem = document.getElementById('current-time');
const durationElem = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const albumArtImg = document.getElementById('album-art-img');
const fileInput = document.getElementById('file-input');
const openFileBtn = document.getElementById('open-file');

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
        playPauseBtn.classList.remove('pause');
        playPauseBtn.classList.add('play');
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = Math.floor(audioPlayer.currentTime);
    const duration = Math.floor(audioPlayer.duration);
    seekSlider.value = (currentTime / duration) * 100;
    currentTimeElem.textContent = formatTime(currentTime);
    durationElem.textContent = formatTime(duration);
});

seekSlider.addEventListener('input', () => {
    const seekTo = audioPlayer.duration * (seekSlider.value / 100);
    audioPlayer.currentTime = seekTo;
});

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value / 100;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

openFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audioPlayer.src = fileURL;
        trackTitle.textContent = file.name;
        trackArtist.textContent = 'Unknown Artist';
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
    }
});
