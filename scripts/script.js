const activeCarousels = [];

document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
    initThemeToggle();
    initNavigation();
    initProjectCards();

    // Initialize carousels if the works module is active on load
    if (document.getElementById('works')?.classList.contains('active')) {
        toggleCarousels(true);
    }
});

async function runBootSequence() {
    const bootText = document.getElementById('boot-text');
    const bootOverlay = document.getElementById('boot-overlay');
    const appContainer = document.getElementById('app-container');

    const bootMessages = [
        'INITIALIZING_CORE...',
        'LOADING_ASSETS...',
        'VERIFYING_SECURITY...',
        'SYSTEM_READY'
    ];

    for (const message of bootMessages) {
        bootText.textContent = message;
        await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Fade out boot overlay
    anime({
        targets: bootOverlay,
        opacity: 0,
        duration: 800,
        easing: 'easeInOutQuad',
        complete: () => {
            bootOverlay.style.display = 'none';
        }
    });

    // Elastic scale-in of app container
    anime({
        targets: appContainer,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1200,
        easing: 'spring(1, 80, 10, 0)',
        delay: 200
    });
}

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Create circular wipe overlay
    const overlay = document.createElement('div');
    overlay.id = 'theme-transition-overlay';
    document.body.appendChild(overlay);

    toggle.addEventListener('click', (e) => {
        const rect = toggle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const currentTheme = html.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Setup overlay position and initial size
        overlay.style.left = `${centerX}px`;
        overlay.style.top = `${centerY}px`;

        // Calculate the target theme's background color before animation
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        const targetBgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();

        // Temporarily apply the target theme to the root to get the target color if needed,
        // but the CSS variables are defined in [data-theme="light"] and :root.
        // A better way is to create a dummy element or use a specific selector.
        const dummy = document.createElement('div');
        dummy.setAttribute('data-theme', targetTheme);
        dummy.style.cssText = 'position: absolute; visibility: hidden;';
        document.body.appendChild(dummy);
        const computedTargetColor = getComputedStyle(dummy).getPropertyValue('--bg-color').trim();
        document.body.removeChild(dummy);

        overlay.style.backgroundColor = computedTargetColor;

        // Get screen diagonal for full coverage
        const maxRadius = Math.sqrt(window.innerWidth**2 + window.innerHeight**2);
        const scaleValue = (maxRadius * 2) / 10; // Since initial size is 10px

        anime({
            targets: overlay,
            scale: [0, scaleValue],
            duration: 600,
            easing: 'easeInOutQuad',
            complete: () => {
                html.setAttribute('data-theme', newTheme);

                // Reset overlay after theme switch
                anime({
                    targets: overlay,
                    scale: 0,
                    duration: 400,
                    easing: 'easeInOutQuad'
                });
            }
        });
    });
}

function initNavigation() {
    const navButtons = document.querySelectorAll('#main-dock button[data-target]');
    const modules = document.querySelectorAll('.module');
    let currentAnimation = null;

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetModule = document.getElementById(targetId);
            const activeModule = document.querySelector('.module.active');

            if (!targetModule || targetModule === activeModule) return;

            // Handle rapid clicking by cancelling current animation
            if (currentAnimation) {
                currentAnimation.pause();
            }

            // Update dock button active state
            navButtons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');

            // Reset target module state to baseline before triggering animation
            anime.set(targetModule, {
                opacity: 0,
                translateX: 50,
                pointerEvents: 'none'
            });

            // Slide-out current module, slide-in target module
            currentAnimation = anime.timeline({
                easing: 'easeOutQuad',
                duration: 400
            });

            currentAnimation
                .add({
                    targets: activeModule,
                    opacity: 0,
                    translateX: -50,
                    duration: 300,
                    complete: () => {
                        activeModule.classList.remove('active');
                    }
                })
                .add({
                    targets: targetModule,
                    opacity: [0, 1],
                    translateX: [50, 0],
                    duration: 300,
                    begin: () => {
                        targetModule.classList.add('active');
                    }
                }, '-=200'); // Overlap animations for smoothness

            // Handle carousel performance based on active module
            if (targetId === 'works') {
                toggleCarousels(true);
            } else {
                toggleCarousels(false);
            }
        });
    });
}

function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        // 3D Tilt Effect
        let rafId = null;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let currentRotateX = 0;
        let currentRotateY = 0;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            targetRotateX = ((y - centerY) / centerY) * -10;
            targetRotateY = ((x - centerX) / centerX) * 10;

            if (!rafId) {
                rafId = requestAnimationFrame(updateTilt);
            }
        });

        function updateTilt() {
            // Smooth interpolation (lerp) for buttery smooth motion
            currentRotateX += (targetRotateX - currentRotateX) * 0.1;
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;

            card.style.transform = `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            if (Math.abs(targetRotateX - currentRotateX) < 0.01 && Math.abs(targetRotateY - currentRotateY) < 0.01) {
                rafId = null;
                return;
            }
            rafId = requestAnimationFrame(updateTilt);
        }

        card.addEventListener('mouseleave', () => {
            targetRotateX = 0;
            targetRotateY = 0;
            if (!rafId) {
                rafId = requestAnimationFrame(updateTilt);
            }
        });

        // Staggered Slide-up for details

        card.addEventListener('mouseenter', () => {
            anime({
                targets: card.querySelector('.card-details'),
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 400,
                easing: 'easeOutBack'
            });
        });

        // Initialize carousel if applicable
        if (card.dataset.carousel === 'true') {
            startCarousel(card);
        }
    });
}

function startCarousel(card) {
    const imgs = card.querySelectorAll('.carousel-img');
    if (imgs.length === 0) return null;

    let currentIndex = 0;
    const intervalId = setInterval(() => {
        imgs[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % imgs.length;
        imgs[currentIndex].classList.add('active');
    }, 3000);

    activeCarousels.push(intervalId);
    return intervalId;
}

function toggleCarousels(active) {
    if (!active) {
        activeCarousels.forEach(id => clearInterval(id));
        activeCarousels.length = 0;
    } else {
        const carousels = document.querySelectorAll('.project-card[data-carousel="true"]');
        carousels.forEach(card => startCarousel(card));
    }
}
