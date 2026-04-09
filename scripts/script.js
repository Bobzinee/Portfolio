document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initAnimations();
    initFilters();
    initVideoSequences();
    initImageSequences();
});

// Image Sequence Logic
function initImageSequences() {
    const containers = document.querySelectorAll('.image-sequence');
    
    containers.forEach(container => {
        const images = container.querySelectorAll('img');
        if (images.length <= 1) return;

        let currentIndex = 0;

        setInterval(() => {
            // Animate out
            anime({
                targets: images[currentIndex],
                opacity: 0,
                duration: 500,
                easing: 'easeInOutQuad',
                complete: () => {
                    images[currentIndex].style.display = 'none';
                    currentIndex = (currentIndex + 1) % images.length;
                    
                    // Setup next image
                    images[currentIndex].style.display = 'block';
                    images[currentIndex].style.opacity = 0;
                    
                    // Animate in
                    anime({
                        targets: images[currentIndex],
                        opacity: 1,
                        duration: 500,
                        easing: 'easeInOutQuad'
                    });
                }
            });
        }, 3000);
    });
}

// Video Sequence Logic
function initVideoSequences() {
    const containers = document.querySelectorAll('.video-sequence');
    
    containers.forEach(container => {
        const videos = container.querySelectorAll('video');
        if (videos.length <= 1) return;

        let currentIndex = 0;

        const playNext = () => {
            videos[currentIndex].style.display = 'none';
            videos[currentIndex].pause();
            videos[currentIndex].currentTime = 0;

            currentIndex = (currentIndex + 1) % videos.length;

            videos[currentIndex].style.display = 'block';
            videos[currentIndex].play();
        };

        videos.forEach((video, index) => {
            video.addEventListener('ended', playNext);
            // Ensure the first one plays
            if (index === 0) {
                video.play();
            }
        });
    });
}

// Theme Toggle Logic
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('portfolio-theme', currentTheme);

        // Animate the toggle icon
        anime({
            targets: themeToggle,
            rotate: '+=180',
            duration: 500,
            easing: 'easeInOutBack'
        });
    });
}

// Global Animations (Scroll Reveal)
function initAnimations() {
    // Initial hero animation
    anime.timeline({
        easing: 'easeOutExpo',
    })
    .add({
        targets: '#hero h1',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        delay: 200
    })
    .add({
        targets: '#hero p',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000
    }, '-=800')
    .add({
        targets: '#hero .cta-buttons',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800
    }, '-=600');

    // Scroll Reveal with IntersectionObserver
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Animate entry
                anime({
                    targets: target,
                    translateY: [30, 0],
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutQuart'
                });

                revealObserver.unobserve(target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        // We skip hero elements as they have their own timeline
        if (!el.closest('#hero')) {
            revealObserver.observe(el);
        }
    });
}

// Project Filtering Logic
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            const toHide = [];
            const toShow = [];

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    toShow.push(card);
                } else {
                    toHide.push(card);
                }
            });

            // Animate filter change
            anime.timeline({
                easing: 'easeInOutSine'
            })
            .add({
                targets: toHide,
                opacity: 0,
                scale: 0.8,
                duration: 300,
                complete: () => {
                    toHide.forEach(el => el.style.display = 'none');
                }
            })
            .add({
                targets: toShow,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 400,
                begin: () => {
                    toShow.forEach(el => el.style.display = 'flex');
                }
            }, '-=100');
        });
    });
}
