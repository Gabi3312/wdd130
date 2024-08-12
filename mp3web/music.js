const playlistData = [
    { id: 1, title: "Basket Case", artist: "Green Day", album: "Dookie", dateAdded: "Hoy", duration: "2:55", audioSrc: "Basket case by Chester.mp3" },
    { id: 2, title: "While My Guitar Gently Weeps", artist: "The Beatles", album: "The Beatles", dateAdded: "Hoy", duration: "3:35", audioSrc: "While my guitar gently weeps by Chester.mp3" },
    { id: 3, title: "Misunderstood", artist: "Bon Jovi", album: "Bounce", dateAdded: "Hoy", duration: "3:58", audioSrc: "Misunderstood by Chester.mp3" },
    // Añade más canciones aquí
];

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let audio = new Audio();
let currentPlayingButton = null;

function renderPlaylist() {
    const tbody = document.querySelector('#playlist tbody');
    tbody.innerHTML = ''; // Limpiar el contenido existente
    playlistData.forEach((song, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${song.id}</td>
            <td>
                <button class="play-button" data-index="${index}">▶</button>
                ${song.title}
            </td>
            <td>${song.album}</td>
            <td>${song.dateAdded}</td>
            <td>${song.duration}</td>
            <td><a href="${song.audioSrc}" download="${song.title}.mp3" class="download-button">Descargar</a></td> <!-- Enlace de descarga -->
        `;
        tbody.appendChild(row);
    });

    // Añadir event listeners a los botones de reproducción
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
    // Actualizar el botón de reproducción anterior
    if (currentPlayingButton) {
        currentPlayingButton.textContent = '▶';
        currentPlayingButton.classList.remove('playing');
    }

    // Actualizar el nuevo botón de reproducción
    currentPlayingButton = document.querySelector(`.play-button[data-index="${index}"]`);
    currentPlayingButton.textContent = '▌▌';
    currentPlayingButton.classList.add('playing');

    currentSongIndex = index;
    const song = playlistData[index];
    document.getElementById('songTitle').textContent = song.title;
    document.getElementById('artistName').textContent = song.artist;
    document.getElementById('albumCover').src = `lpark.jpg`;

    // No cambiar la fuente si la canción es la misma
    if (audio.src !== song.audioSrc) {
        audio.src = song.audioSrc;
        audio.currentTime = 0; // Reiniciar la canción al inicio si es una canción nueva
    }

    if (!isPlaying) {
        audio.play();
        isPlaying = true;
    }

    updatePlayPauseButton();
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    updatePlayPauseButton();
    if (currentPlayingButton) {
        currentPlayingButton.textContent = '▶';
        currentPlayingButton.classList.remove('playing');
    }
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        if (currentPlayingButton) {
            const index = parseInt(currentPlayingButton.getAttribute('data-index'));
            playSong(index); // Reanudar la canción desde la posición donde se pausó
        } else {
            playSong(0); // Reproducir la primera canción si no hay ninguna seleccionada
        }
    }
}

function updatePlayPauseButton() {
    const playPauseIcon = document.getElementById('playPauseIcon');
    playPauseIcon.src = isPlaying ? 'pause_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png' : 'play_arrow_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png';
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
    document.getElementById('shuffleButton').addEventListener('click', () => {
        isShuffle = !isShuffle;
        document.getElementById('shuffleButton').classList.toggle('active', isShuffle);
    });
    document.getElementById('repeatButton').addEventListener('click', () => {
        isRepeat = !isRepeat;
        document.getElementById('repeatButton').classList.toggle('active', isRepeat);
    });

    const progressBar = document.getElementById('progressBar');
    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration; // Saltar a la posición seleccionada
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        updateProgress();
    });
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            playSong(currentSongIndex);
        } else {
            nextSong();
        }
    });

    const volumeBar = document.getElementById('volumeBar');
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100; // Ajusta el volumen
    });
    volumeBar.value = audio.volume * 100; // Inicializa el valor del control deslizante
});

document.addEventListener('DOMContentLoaded', () => {
    renderPlaylist();

    // Event listeners para los botones de reproducción
    document.getElementById('playPauseButton').addEventListener('click', togglePlayPause);
    document.getElementById('nextButton').addEventListener('click', nextSong);
    document.getElementById('prevButton').addEventListener('click', prevSong);
    document.getElementById('shuffleButton').addEventListener('click', () => {
        isShuffle = !isShuffle;
        document.getElementById('shuffleButton').classList.toggle('active', isShuffle);
    });
    document.getElementById('repeatButton').addEventListener('click', () => {
        isRepeat = !isRepeat;
        document.getElementById('repeatButton').classList.toggle('active', isRepeat);
    });

    // Control deslizante de progreso
    const progressBar = document.getElementById('progressBar');
    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    });

    // Actualizar progreso
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        updateProgress();
    });
    audio.addEventListener('ended', () => {
        if (isRepeat) {
            playSong(currentSongIndex);
        } else {
            nextSong();
        }
    });

    // Control de volumen
    const volumeBar = document.getElementById('volumeBar');
    volumeBar.addEventListener('input', () => {
        audio.volume = volumeBar.value / 100;
    });
    volumeBar.value = audio.volume * 100;

    // Cambiar tema
    const themeToggleBtn = document.getElementById('themeToggle');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');

        // Cambia el texto del botón según el tema
        if (document.body.classList.contains('dark-theme')) {
            themeToggleBtn.textContent = 'Cambiar a Modo Claro';
        } else {
            themeToggleBtn.textContent = 'Cambiar a Modo Oscuro';
        }
    });
});
