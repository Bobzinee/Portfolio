# Design Spec: Gamified Command Center Portfolio
Date: 2026-04-09
Topic: Portfolio Website Redesign

## 1. Overview
A high-end, "Sleek & Gamified" portfolio website acting as a digital terminal (Command Center). The site showcases a diverse range of skills in web development, game development, and tool creation, prioritizing professional polish with an interactive, immersive experience.

## 2. Architecture & UI Layout
### 2.1 Structural Layout
- **The Dock**: A glassmorphism navigation bar (side on desktop, bottom-pill on mobile).
- **The Viewport**: Dynamic content area with an animated grid background.
- **Module Grid**: Projects displayed as "Data Cards" that activate on hover/touch.
- **Navigation**: SPA-style transitions between Home, Works, and Skills modules.

### 2.2 Visual Identity
- **Theme**: Dual-mode support.
    - **Dark (Default)**: Background `#0a0a0a`, Accent Neon Cyan `#00f3ff`.
    - **Light**: Background `#f5f5f7`, Accent Royal Blue `#1a365d`.
- **Typography**: 
    - Headings: `gilmoray.otf` (Futuristic/Bold).
    - Accents/Buttons: `LondrinaSolid-Black.ttf` (Gamified/Playful).
- **Styling**: Modular SCSS with CSS variables for theme switching.

## 3. Interactions & Animations (anime.js)
### 3.1 Sequence & Transitions
- **Boot Sequence**: Initial load features a "system check" text crawl followed by an elastic scale-in of the main UI.
- **Module Switching**: "Slide-and-fade" transitions between main views to simulate software module swapping.
- **Theme Transition**: A circular "wipe" animation expanding from the toggle point.

### 3.2 Project Card Behaviors
- **Idle**: Thumbnail, title, and category tag.
- **Active (Hover/Touch)**: 
    - Neon border pulse animation.
    - Staggered slide-up of tech stack and "Launch" button.
    - Subtle 3D tilt effect based on cursor position.

## 4. Content Mapping
### 4.1 Project Hierarchy
Projects are categorized and ordered by priority:
1. **Web Apps**: Animate Edge, Expense Tracker, Piano Edge, Robot Control Console.
2. **Games**: AstroSpectra, Bob's a Wuss (Part 1), Zombie Shooter (BobsAWuss2), The Otherworld.
3. **Tools**: Ultimate Edge.

### 4.2 Asset Integration
- **Images/Video**: Pulled from `src/[ProjectName]/`. Multi-image projects use a mini-carousel.
- **Icons**: Shared assets from `src/Icons` for social/nav links.
- **Descriptions**: Concise, technical, and consistent.

### 4.3 Skill Matrix
Skills grouped by "Core Modules":
- **Frontend**: React 19, TypeScript, SCSS, GSAP, anime.js.
- **Game Dev**: Unity, Godot, Three.js, Cannon.js, GLSL.
- **System/Tooling**: Rust, WASM, Electron, SQLite-vec, Ollama.
- **Backend**: Node.js, Express, MongoDB, Supabase.

## 5. Technical Constraints
- **Responsive**: Fully fluid layout (Mobile $\rightarrow$ Tablet $\rightarrow$ Desktop).
- **Performance**: anime.js animations optimized for 60fps; simplified animations for mobile.
- **Structure**: Strictly separated into `index.html`, `styles/style.scss`, and `scripts/script.js`.
