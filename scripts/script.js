const carousel = document.querySelector('.carousel');
const items = carousel.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-nav.prev');
const nextBtn = document.querySelector('.carousel-nav.next');
let currentIndex = 2; // Start with middle item active
const totalItems = items.length;

function updateCarousel() {
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function moveToNext() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

function moveToPrev() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
}

nextBtn.addEventListener('click', moveToNext);
prevBtn.addEventListener('click', moveToPrev);

// Automatic sliding
setInterval(moveToNext, 5000);

// Initial setup
updateCarousel();

//Scroll Effect
Observer.create({
    target: window, // can be any element (selector text is fine)
    type: "wheel,touch", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
    onUp: () => previous(),
    onDown: () => next(),
  });
