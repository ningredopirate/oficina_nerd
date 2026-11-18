const audio = document.getElementById('audio-element');

// 1. Ao carregar a página, verifica se há um tempo salvo
window.addEventListener('DOMContentLoaded', () => {
    const tempoSalvo = sessionStorage.getItem('musicaTempo');
    const estavaTocando = sessionStorage.getItem('musicaTocando');

    if (tempoSalvo) {
        audio.currentTime = parseFloat(tempoSalvo);
    }

    if (estavaTocando === 'true') {
        audio.play().catch(() => {
            // Navegadores podem bloquear autoplay se não houver interação prévia
        });
    }
});

// 2. Antes de sair da página, salva o segundo atual e o status
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('musicaTempo', audio.currentTime);
    sessionStorage.setItem('musicaTocando', !audio.paused);
});

document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio-element");
    const btnPlayPause = document.getElementById("btn-play-pause");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const volumeSlider = document.getElementById("volume-slider");
    const trackTitle = document.getElementById("track-title");
    const statusDot = document.getElementById("status-dot");
    const iframe = document.getElementById("site-frame");

    // Lista de músicas (substitua pelos caminhos reais dos seus arquivos)
    const playlist = [
        { title: "AGGRESSIVE DARK PHONK & HEAVY DUBSTEP", src: "audiofundo.mp3" },
        { title: "AGGRESSIVE DARK PHONK & HEAVY DUBSTEP", src: "audiofundo.mp3" }
    ];

    let currentTrackIndex = 0;
    let isPlaying = false;

    // Carrega a faixa atual
    function loadTrack(index) {
        audio.src = playlist[index].src;
        trackTitle.textContent = playlist[index].title;
        audio.volume = volumeSlider.value;
    }

    // Atualiza ícones visuais
    function updateUI(playing) {
        isPlaying = playing;
        btnPlayPause.textContent = playing ? "⏸" : "▶";
        statusDot.className = playing ? "dot playing" : "dot paused";
    }

    // Tenta dar play
    function playAudio() {
        audio.play().then(() => {
            updateUI(true);
        }).catch(() => {
            // Navegador bloqueou o autoplay inicial; aguardando clique do usuário
            updateUI(false);
        });
    }

    function pauseAudio() {
        audio.pause();
        updateUI(false);
    }

    // Controles dos botões
    btnPlayPause.addEventListener("click", () => {
        if (isPlaying) pauseAudio();
        else playAudio();
    });

    btnNext.addEventListener("click", () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playAudio();
    });

    btnPrev.addEventListener("click", () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        playAudio();
    });

    volumeSlider.addEventListener("input", (e) => {
        audio.volume = e.target.value;
    });

    // Passa para a próxima música automaticamente ao terminar
    audio.addEventListener("ended", () => {
        btnNext.click();
    });

    // Inicialização
    loadTrack(currentTrackIndex);
    playAudio();

    // SOLUÇÃO PARA BLOQUEIO DE AUTOPLAY:
    // Se o navegador bloqueou o som ao abrir, inicia no primeiro clique do usuário
    function unlockAudioOnInteraction() {
        if (!isPlaying) {
            playAudio();
        }
        document.removeEventListener("click", unlockAudioOnInteraction);
    }
    document.addEventListener("click", unlockAudioOnInteraction);

    // Também detecta clique dentro das páginas internas (iframe)
    iframe.addEventListener("load", () => {
        try {
            iframe.contentWindow.document.addEventListener("click", unlockAudioOnInteraction);
        } catch (e) {
            // Ignora erro caso o iframe carregue um domínio externo
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DO CARROSSEL ---
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsContainer = document.getElementById('carouselDots');

    let currentIndex = 0;
    let autoPlayInterval;

    // Cria os indicadores (dots) dinamicamente conforme a quantidade de slides
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateDots(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots(currentIndex);
    }

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoPlay();
    });

    // Autoplay a cada 5 segundos
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Pausa o autoplay quando o mouse passa por cima do carrossel
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    carouselContainer.addEventListener('mouseleave', startAutoPlay);

    // Suporte a navegação pelo teclado (setas esquerda/direita)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        } else if (e.key === 'ArrowLeft') {
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        }
    });

    startAutoPlay();

    // --- MENU MOBILE ---
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // --- NEWSLETTER NO RODAPÉ ---
    const newsletterForm = document.getElementById('newsletterForm');
    const formFeedback = document.getElementById('formFeedback');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        formFeedback.textContent = `[CONEXÃO ESTABELECIDA] E-mail ${input.value} registrado no sistema.`;
        input.value = '';
    });
});
