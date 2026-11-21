const canvas = document.getElementById("danceCanvas");
const ctx = canvas.getContext("2d");

let W, H, dpr;

function resize() {
    const rect = canvas.getBoundingClientRect();

    W = rect.width;
    H = rect.height;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();


// EASING
function ease(t) {
    t = Math.max(0, Math.min(1, t));
    return t * t * (3 - 2 * t);
}


// DRAW LIMBS
function limb(x1, y1, x2, y2, thickness, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.stroke();
}


// DRAW JOINT
function joint(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();
}


// DRAW CHARACTER HEAD
function head(t) {

    ctx.save();

    ctx.translate(0, -130);
    ctx.rotate(Math.sin(t * 3) * 0.12);

    // Neck
    ctx.fillStyle = "#bd7958";
    ctx.fillRect(-12, 25, 24, 35);

    // Face
    ctx.beginPath();
    ctx.ellipse(0, 0, 45, 55, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#e9ad86";
    ctx.fill();

    // Hair
    ctx.beginPath();
    ctx.arc(0, -15, 46, Math.PI, Math.PI * 2);
    ctx.fillStyle = "#25202a";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-35, -10, 15, 30, 0, 0, Math.PI * 2);
    ctx.ellipse(35, -10, 15, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = "#29202a";

    ctx.beginPath();
    ctx.arc(-16, -2, 4, 0, Math.PI * 2);
    ctx.arc(16, -2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(0, 10, 12, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = "#874b43";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
}


// DRAW BODY
function body(t) {

    ctx.save();

    ctx.translate(0, Math.sin(t * 5) * 5);

    // Shirt
    ctx.fillStyle = "#526dff";

    ctx.beginPath();
    ctx.moveTo(-38, -65);
    ctx.lineTo(38, -65);
    ctx.lineTo(48, 65);
    ctx.lineTo(-48, 65);
    ctx.closePath();
    ctx.fill();

    // Shirt collar
    ctx.beginPath();
    ctx.moveTo(-15, -65);
    ctx.lineTo(0, -43);
    ctx.lineTo(15, -65);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Shirt buttons
    ctx.fillStyle = "#ffffff";

    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, -20 + i * 25, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Belt
    ctx.fillStyle = "#202943";
    ctx.fillRect(-43, 55, 86, 13);

    ctx.restore();
}


// DRAW ARMS
function arms(t) {

    const swing = Math.sin(t * 4);

    // Left arm
    const lx = -55 - swing * 18;
    const ly = -75 - Math.cos(t * 4) * 35;

    limb(-35, -45, lx, ly, 20, "#526dff");
    joint(lx, ly, 10, "#e9ad86");

    limb(lx, ly, lx - 30, ly - 35, 14, "#e9ad86");
    joint(lx - 30, ly - 35, 10, "#e9ad86");


    // Right arm
    const rx = 55 + swing * 18;
    const ry = -75 + Math.cos(t * 4) * 35;

    limb(35, -45, rx, ry, 20, "#526dff");
    joint(rx, ry, 10, "#e9ad86");

    limb(rx, ry, rx + 30, ry - 35, 14, "#e9ad86");
    joint(rx + 30, ry - 35, 10, "#e9ad86");
}


// DRAW LEGS
function legs(t) {

    const step = Math.sin(t * 4);

    // Left leg
    const lx = -25 + step * 25;
    const ly = 140 - Math.max(0, step) * 25;

    limb(-22, 65, lx, ly, 23, "#26314e");
    joint(lx, ly, 10, "#e9ad86");

    limb(lx, ly, -35 + step * 35, 210 - Math.max(0, step) * 30, 19, "#26314e");

    limb(
        -45 + step * 35,
        210 - Math.max(0, step) * 30,
        -5 + step * 35,
        210 - Math.max(0, step) * 30,
        13,
        "#ffffff"
    );


    // Right leg
    const rx = 25 - step * 25;
    const ry = 140 + Math.max(0, step) * 20;

    limb(22, 65, rx, ry, 23, "#26314e");
    joint(rx, ry, 10, "#e9ad86");

    limb(rx, ry, 35 - step * 35, 210 + Math.max(0, step) * 15, 19, "#26314e");

    limb(
        25 - step * 35,
        210 + Math.max(0, step) * 15,
        65 - step * 35,
        210 + Math.max(0, step) * 15,
        13,
        "#ffffff"
    );
}


// SHADOW
function shadow(t) {

    const pulse = Math.sin(t * 4) * 7;

    ctx.beginPath();

    ctx.ellipse(0, 245, 90 + pulse, 15, 0, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fill();
}


// PARTICLES
const particles = Array.from({ length: 35 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 2 + 1,
    speed: Math.random() * 20 + 10
}));

function drawParticles(t) {

    particles.forEach(p => {

        const x = p.x * W;
        const y = (p.y * H - t * p.speed + H * 10) % H;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(120,210,255,0.55)";
        ctx.fill();

    });

}


// COMPLETE CHARACTER
function character(t) {

    const bounce = Math.abs(Math.sin(t * 4)) * 20;
    const sway = Math.sin(t * 2) * 12;

    // Responsive character scale
    const scale = Math.min(W / 500, H / 550, 1.1);

    ctx.save();

    ctx.translate(W / 2 + sway, H / 2 - bounce + 5);
    ctx.scale(scale, scale);

    shadow(t);

    ctx.rotate(Math.sin(t * 2) * 0.07);

    // Draw back limbs first
    legs(t);

    // Body
    body(t);

    // Arms
    arms(t);

    // Head
    head(t);

    ctx.restore();
}


// ANIMATION ENGINE
const start = performance.now();

function animate(now) {

    const t = (now - start) / 1000;

    ctx.clearRect(0, 0, W, H);

    drawParticles(t);

    character(t);

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```
