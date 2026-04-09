document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
    initThemeToggle();
    initNavigation();
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

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');

            modules.forEach(mod => {
                mod.classList.remove('active');
                if (mod.id === target) {
                    mod.classList.add('active');
                    anime({
                        targets: mod,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 400,
                        easing: 'easeOutQuad'
                    });
                }
            });
        });
    });
}