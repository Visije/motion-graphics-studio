```javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const title = document.getElementById("title");
const underline = document.querySelector(".underline");
const subtitle = document.querySelector(".title-container p");

const progress = document.getElementById("progress");
const percentage = document.getElementById("percentage");

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

const DURATION = 15;

let elapsed = 0;
let playing = true;
let lastTime = 0;

let width;
let height;
let scale;

let particles = [];

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = canvas.clientWidth;
    height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    scale = dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// EASING FUNCTION

function ease(t) {

    t = Math.max(0, Math.min(1, t));

    return t * t * (3 - 2 * t);

}


// PARTICLE GENERATION

function createParticles() {

    particles = [];

    for (let i = 0; i < 100; i++) {

        particles.push({

            angle: Math.random() * Math.PI * 2,

            radius: 80 + Math.random() * 350,

            speed: 0.1 + Math.random() * 0.3,

            size: 1 + Math.random() * 3,

            alpha: 0.2 + Math.random() * 0.7

        });

    }

}

createParticles();


// BACKGROUND

function drawBackground(t) {

    const gradient = ctx.createRadialGradient(

        width / 2 + Math.sin(t * 0.5) * 100,
        height / 2,
        10,

        width / 2,
        height / 2,
        Math.max(width, height)

    );

    gradient.addColorStop(0, "#172c50");
    gradient.addColorStop(0.5, "#0a142d");
    gradient.addColorStop(1, "#050914");

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, width, height);

}


// GRID

function drawGrid() {

    ctx.strokeStyle = "rgba(120,170,220,0.07)";

    ctx.lineWidth = 1;

    const spacing = 65;

    for (let x = 0; x < width; x += spacing) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);

        ctx.stroke();

    }

    for (let y = 0; y < height; y += spacing) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        ctx.stroke();

    }

}


// PARTICLES

function drawParticles(t) {

    const cx = width / 2;
    const cy = height / 2;

    particles.forEach(p => {

        const angle = p.angle + t * p.speed;

        const x = cx + Math.cos(angle) * p.radius;
        const y = cy + Math.sin(angle) * p.radius * 0.55;

        ctx.beginPath();

        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(100,210,255,${p.alpha})`;

        ctx.fill();

    });

}


// GEOMETRIC RINGS

function drawRings(t) {

    const cx = width / 2;
    const cy = height / 2;

    ctx.save();

    ctx.translate(cx, cy);

    for (let i = 0; i < 5; i++) {

        ctx.beginPath();

        ctx.ellipse(

            0,
            0,

            150 + i * 35,
            80 + i * 20,

            t * 0.15 * (i % 2 ? -1 : 1),

            0,
            Math.PI * 2

        );

        const colors = [
            "#54dfff",
            "#9275ff",
            "#4ce6c2",
            "#ef73c9",
            "#75aaff"
        ];

        ctx.strokeStyle = colors[i];

        ctx.globalAlpha = 0.65 - i * 0.09;

        ctx.lineWidth = i < 2 ? 2 : 1;

        ctx.stroke();

    }

    ctx.globalAlpha = 1;

    ctx.restore();

}


// GLOWING ORB

function drawOrb(t) {

    const x = width / 2 + Math.cos(t * 0.8) * 300;

    const y = height / 2 + Math.sin(t * 0.8) * 160;

    const radius = 25 + Math.sin(t * 2) * 5;

    const glow = ctx.createRadialGradient(

        x, y, 0,

        x, y, radius * 3

    );

    glow.addColorStop(0, "rgba(80,220,255,0.9)");
    glow.addColorStop(0.4, "rgba(30,150,255,0.25)");
    glow.addColorStop(1, "rgba(30,150,255,0)");

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(x, y, radius * 3, 0, Math.PI * 2);

    ctx.fill();

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = "#70e5ff";

    ctx.fill();

}


// TITLE ANIMATION

function animateTitle(t) {

    const reveal = ease((t - 0.5) / 0.85);

    const exit = 1 - ease((t - 13.5) / 1.3);

    const opacity = reveal * exit;

    title.style.opacity = opacity;

    title.style.transform = `
        translateY(${(1 - reveal) * 50}px)
    `;

    underline.style.width =
        `${260 * ease((t - 1) / 1.1) * exit}px`;

    subtitle.style.opacity = opacity;

}


// MAIN RENDER FUNCTION

function render(t) {

    ctx.clearRect(0, 0, width, height);

    drawBackground(t);

    drawGrid();

    drawParticles(t);

    drawRings(t);

    drawOrb(t);

    animateTitle(t);

    progress.style.width =
        `${(t / DURATION) * 100}%`;

    percentage.textContent =
        `${Math.floor((t / DURATION) * 100)}%`;

}


// ANIMATION LOOP

function animationLoop(timestamp) {

    if (!playing) return;

    if (!lastTime) lastTime = timestamp;

    const delta = (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    elapsed += delta;

    if (elapsed >= DURATION) {

        elapsed = DURATION;

        playing = false;

        playBtn.textContent = "REPLAY";

    }

    render(elapsed);

    if (playing) {

        requestAnimationFrame(animationLoop);

    }

}


// PLAY / PAUSE

playBtn.addEventListener("click", () => {

    if (elapsed >= DURATION) {

        elapsed = 0;

    }

    playing = !playing;

    if (playing) {

        lastTime = 0;

        playBtn.textContent = "PAUSE";

        requestAnimationFrame(animationLoop);

    } else {

        playBtn.textContent = "PLAY";

    }

});


// RESTART

restartBtn.addEventListener("click", () => {

    elapsed = 0;

    playing = true;

    lastTime = 0;

    playBtn.textContent = "PAUSE";

    render(0);

    requestAnimationFrame(animationLoop);

});


// INITIALIZE

playBtn.textContent = "PAUSE";

render(0);

requestAnimationFrame(animationLoop);
```
