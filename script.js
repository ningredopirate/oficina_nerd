const player = document.getElementById('meu-player');

// 1. Quando a página carregar, recupera o tempo salvo
window.addEventListener('load', () => {
    const tempoSalvo = sessionStorage.getItem('tempoMusica');
    const estavaTocando = sessionStorage.getItem('tocandoMusica');

    if (tempoSalvo) {
        player.currentTime = parseFloat(tempoSalvo);
    }

    if (estavaTocando === 'true') {
        player.play().catch(() => {
            // Navegadores bloqueiam autoplay se não houver interação recente
            console.log('Clique no play para continuar.');
        });
    }
});

// 2. Antes de sair da página, salva o segundo atual e se estava tocando
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('tempoMusica', player.currentTime);
    sessionStorage.setItem('tocandoMusica', !player.paused);
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
