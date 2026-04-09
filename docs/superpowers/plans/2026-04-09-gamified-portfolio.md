# Gamified Command Center Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sleek, gamified portfolio website with a "Command Center" dashboard feel, featuring dark/light modes and advanced anime.js animations.

**Architecture:** Single-page application (SPA) structure using vanilla JS to swap content modules within a main viewport. Styling is handled via SCSS with a focus on glassmorphism and neon accents.

**Tech Stack:** HTML5, SCSS, JavaScript, anime.js.

---

### Task 1: Foundation and Theme System

**Files:**
- Modify: `index.html`
- Modify: `styles/style.scss`

- [ ] **Step 1: Set up HTML skeleton**
Update `index.html` to include the main viewport, the navigation dock, and the boot sequence overlay.

```html
<!-- Inside body -->
<div id="boot-overlay" class="overlay">
    <div id="boot-text"></div>
</div>

<div id="app-container">
    <nav id="main-dock">
        <button data-module="home" class="dock-item active"><img src="src/Icons/home_icon.svg" alt="Home"></button>
        <button data-module="works" class="dock-item"><img src="src/Icons/works_icon.svg" alt="Works"></button>
        <button data-module="skills" class="dock-item"><img src="src/Icons/blog_icon.svg" alt="Skills"></button>
        <button data-module="contact" class="dock-item"><img src="src/Icons/contact_icon.svg" alt="Contact"></button>
        <div id="theme-toggle"></div>
    </nav>

    <main id="viewport">
        <section id="home" class="module active">...</section>
        <section id="works" class="module">...</section>
        <section id="skills" class="module">...</section>
        <section id="contact" class="module">...</section>
    </main>
</div>
```

- [ ] **Step 2: Define Theme Variables in SCSS**
Implement the color palettes and typography in `styles/style.scss`.

```scss
$dark-bg: #0a0a0a;
$dark-accent: #00f3ff;
$light-bg: #f5f5f7;
$light-accent: #1a365d;

:root {
    --bg-color: #{$dark-bg};
    --accent-color: #{$dark-accent};
    --text-color: #ffffff;
    --glass-bg: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] {
    --bg-color: #{$light-bg};
    --accent-color: #{$light-accent};
    --text-color: #1a1a1a;
    --glass-bg: rgba(0, 0, 0, 0.05);
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Gilmoray', sans-serif;
    margin: 0;
    overflow: hidden;
}
```

- [ ] **Step 3: Commit**
```bash
git add index.html styles/style.scss
git commit -m "feat: establish basic layout and theme system"
```

---

### Task 2: The Boot Sequence & Theme Toggle

**Files:**
- Modify: `scripts/script.js`
- Modify: `styles/style.scss`

- [ ] **Step 1: Implement Boot Sequence Logic**
Create the "system check" text crawl using `anime.js`.

```javascript
const bootMessages = ["INITIALIZING_CORE...", "LOADING_ASSETS...", "VERIFYING_SECURITY...", "SYSTEM_READY"];
const bootTextElement = document.getElementById('boot-text');

async function runBootSequence() {
    for (const msg of bootMessages) {
        bootTextElement.innerText = msg;
        await new Promise(r => setTimeout(r, 400));
    }
    anime({
        targets: '#boot-overlay',
        opacity: 0,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => document.getElementById('boot-overlay').style.display = 'none'
    });
}
window.addEventListener('DOMContentLoaded', runBootSequence);
```

- [ ] **Step 2: Implement Theme Toggle with Circular Wipe**
Add the logic to switch `data-theme` and animate the transition.

```javascript
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Circular wipe animation logic using anime.js and a canvas or SVG mask
    document.documentElement.setAttribute('data-theme', nextTheme);
});
```

- [ ] **Step 3: Commit**
```bash
git add scripts/script.js styles/style.scss
git commit -m "feat: add boot sequence and theme toggle"
```

---

### Task 3: Module Navigation (SPA Logic)

**Files:**
- Modify: `scripts/script.js`
- Modify: `styles/style.scss`

- [ ] **Step 1: Implement Module Switching**
Add the "slide-and-fade" transition between sections.

```javascript
const dockItems = document.querySelectorAll('.dock-item');
const modules = document.querySelectorAll('.module');

dockItems.forEach(item => {
    item.addEventListener('click', () => {
        const target = item.getAttribute('data-module');
        
        anime({
            targets: '.module.active',
            translateX: -50,
            opacity: 0,
            duration: 400,
            easing: 'easeInQuad',
            complete: () => {
                modules.forEach(m => m.classList.remove('active'));
                const nextModule = document.getElementById(target);
                nextModule.classList.add('active');
                anime({
                    targets: `#${target}`,
                    translateX: [50, 0],
                    opacity: [0, 1],
                    duration: 400,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        dockItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});
```

- [ ] **Step 2: Commit**
```bash
git add scripts/script.js styles/style.scss
git commit -m "feat: implement module navigation with animations"
```

---

### Task 4: Project Grid & Data Cards

**Files:**
- Modify: `index.html`
- Modify: `styles/style.scss`
- Modify: `scripts/script.js`

- [ ] **Step 1: Build the Project Grid HTML**
Populate the `#works` section with the mapped projects.

```html
<div class="project-grid">
    <div class="project-card" data-category="WEB_APP">
        <div class="card-inner">
            <img src="src/AnimateEdge/pic.png" class="thumb">
            <div class="card-info">
                <h3>Animate Edge</h3>
                <span class="tag">WEB_APP</span>
                <div class="card-details">
                    <p>High-performance animation & pixel art editor (React, Rust/WASM).</p>
                    <div class="tech-stack"><span>React</span><span>Rust</span><span>WASM</span></div>
                    <a href="https://animateedge.com" class="launch-btn">LAUNCH</a>
                </div>
            </div>
        </div>
    </div>
    <!-- Repeat for other projects -->
</div>
```

- [ ] **Step 2: Implement Card Hover Effects (anime.js)**
Add the neon pulse and 3D tilt logic.

```javascript
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const { offsetX, offsetY, target } = e;
        const { clientWidth, clientHeight } = target;
        const rotateX = (offsetY / clientHeight - 0.5) * 20;
        const rotateY = (offsetX / clientWidth - 0.5) * -20;
        
        anime({
            targets: card,
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 100,
            easing: 'linear'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        anime({
            targets: card,
            rotateX: 0,
            rotateY: 0,
            duration: 400,
            easing: 'easeOutElastic(1, .6)'
        });
    });
});
```

- [ ] **Step 3: Commit**
```bash
git add index.html styles/style.scss scripts/script.js
git commit -m "feat: implement project grid and interactive cards"
```

---

### Task 5: Skills Matrix & Final Polish

**Files:**
- Modify: `index.html`
- Modify: `styles/style.scss`
- Modify: `scripts/script.js`

- [ ] **Step 1: Create the Skill Matrix UI**
Build the "Core Modules" layout in the `#skills` section.

- [ ] **Step 2: Final Responsive Tweaks**
Adjust the Dock and Grid for mobile screens.

- [ ] **Step 3: Commit**
```bash
git add index.html styles/style.scss scripts/script.js
git commit -m "feat: complete skills matrix and responsive polish"
```
