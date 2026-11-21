"use strict";

// ==========================================
// 1. CANVAS INITIALIZATION
// ==========================================

const canvas = document.getElementById("danceCanvas");

if (!canvas) {
    throw new Error('Canvas element "#danceCanvas" was not found in HTML.');
}

const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Canvas 2D context is not supported.");
}

let W = 0;
let H = 0;
let dpr = 1;

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    W = rect.width;
    H = rect.height;

    if (W === 0 || H === 0) return;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


// ==========================================
// 2. ANIMATION UTILITIES
// ==========================================

function clamp(value, min, max) {

    return Math.max(min, Math.min(max, value));

}

function easeInOut(t) {

    t = clamp(t, 0, 1);

    return t * t * (3 - 2 * t);

}

function oscillate(time, frequency, phase = 0) {

    return Math.sin(time * frequency + phase);

}


// ==========================================
// 3. DRAWING UTILITIES
// ==========================================

function drawLimb(x1, y1, x2, y2, thickness, color) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;

    ctx.lineWidth = thickness;

    ctx.lineCap = "round";

    ctx.lineJoin = "round";

    ctx.stroke();

}


function drawJoint(x, y, radius, color) {

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;

    ctx.fill();

}


function drawEllipse(x, y, rx, ry, color) {

    ctx.beginPath();

    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);

    ctx.fillStyle = color;

    ctx.fill();

}


// ==========================================
// 4. CHARACTER HEAD
// ==========================================

function drawHead(t) {

    ctx.save();

    const headTilt = oscillate(t, 3) * 0.12;

    ctx.translate(0, -130);

    ctx.rotate(headTilt);

    // Neck

    drawEllipse(0, 37, 13, 25, "#bd7958");

    // Face

    drawEllipse(0, 0, 45, 55, "#e9ad86");

    // Hair cap

    ctx.beginPath();

    ctx.arc(0, -15, 46, Math.PI, Math.PI * 2);

    ctx.fillStyle = "#25202a";

    ctx.fill();

    // Left hair

    ctx.beginPath();

    ctx.ellipse(-35, -10, 15, 30, -0.2, 0, Math.PI * 2);

    ctx.fill();

    // Right hair

    ctx.beginPath();

    ctx.ellipse(35, -10, 15, 30, 0.2, 0, Math.PI * 2);

    ctx.fill();

    // Eyebrows

    drawLimb(-25, -14, -9, -16, 3, "#38252a");

    drawLimb(9, -16, 25, -14, 3, "#38252a");

    // Eyes

    drawJoint(-16, -2, 4, "#29202a");

    drawJoint(16, -2, 4, "#29202a");

    // Smile

    ctx.beginPath();

    ctx.arc(0, 10, 12, 0.1, Math.PI - 0.1);

    ctx.strokeStyle = "#874b43";

    ctx.lineWidth = 3;

    ctx.stroke();

    // Cheeks

    drawJoint(-29, 13, 7, "rgba(255,100,120,0.3)");

    drawJoint(29, 13, 7, "rgba(255,100,120,0.3)");

    ctx.restore();

}


// ==========================================
// 5. CHARACTER BODY
// ==========================================

function drawBody(t) {

    ctx.save();

    const bodyBounce = oscillate(t, 5) * 5;

    ctx.translate(0, bodyBounce);

    // Shirt

    ctx.beginPath();

    ctx.moveTo(-38, -65);

    ctx.lineTo(38, -65);

    ctx.lineTo(48, 65);

    ctx.lineTo(-48, 65);

    ctx.closePath();

    ctx.fillStyle = "#526dff";

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

    for (let i = 0; i < 3; i++) {

        drawJoint(0, -20 + i * 25, 3, "#ffffff");

    }

    // Belt

    ctx.fillStyle = "#202943";

    ctx.fillRect(-43, 55, 86, 13);

    ctx.restore();

}


// ==========================================
// 6. CHARACTER ARMS
// ==========================================

function drawArms(t) {

    const swing = oscillate(t, 4);

    const shoulderY = -45;

    // LEFT ARM

    const leftElbowX = -55 - swing * 18;

    const leftElbowY = -75 - oscillate(t, 4) * 35;

    const leftHandX = leftElbowX - 30;

    const leftHandY = leftElbowY - 35 + swing * 10;

    // Upper arm

    drawLimb(
        -35,
        shoulderY,
        leftElbowX,
        leftElbowY,
        20,
        "#526dff"
    );

    // Elbow

    drawJoint(leftElbowX, leftElbowY, 10, "#e9ad86");

    // Forearm

    drawLimb(
        leftElbowX,
        leftElbowY,
        leftHandX,
        leftHandY,
        14,
        "#e9ad86"
    );

    // Hand

    drawJoint(leftHandX, leftHandY, 10, "#e9ad86");


    // RIGHT ARM

    const rightElbowX = 55 + swing * 18;

    const rightElbowY = -75 + oscillate(t, 4) * 35;

    const rightHandX = rightElbowX + 30;

    const rightHandY = rightElbowY - 35 - swing * 10;

    // Upper arm

    drawLimb(
        35,
        shoulderY,
        rightElbowX,
        rightElbowY,
        20,
        "#526dff"
    );

    // Elbow

    drawJoint(rightElbowX, rightElbowY, 10, "#e9ad86");

    // Forearm

    drawLimb(
        rightElbowX,
        rightElbowY,
        rightHandX,
        rightHandY,
        14,
        "#e9ad86"
    );

    // Hand

    drawJoint(rightHandX, rightHandY, 10, "#e9ad86");

}


// ==========================================
// 7. CHARACTER LEGS
// ==========================================

function drawLegs(t) {

    const step = oscillate(t, 4);

    // LEFT LEG

    const leftKneeX = -25 + step * 25;

    const leftKneeY = 140 - Math.max(0, step) * 25;

    const leftFootX = -35 + step * 35;

    const leftFootY = 210 - Math.max(0, step) * 30;

    // Upper leg

    drawLimb(
        -22,
        65,
        leftKneeX,
        leftKneeY,
        23,
        "#26314e"
    );

    drawJoint(leftKneeX, leftKneeY, 10, "#e9ad86");

    // Lower leg

    drawLimb(
        leftKneeX,
        leftKneeY,
        leftFootX,
        leftFootY,
        19,
        "#26314e"
    );

    // Shoe

    drawLimb(
        leftFootX - 10,
        leftFootY,
        leftFootX + 25,
        leftFootY,
        13,
        "#ffffff"
    );


    // RIGHT LEG

    const rightKneeX = 25 - step * 25;

    const rightKneeY = 140 + Math.max(0, step) * 20;

    const rightFootX = 35 - step * 35;

    const rightFootY = 210 + Math.max(0, step) * 15;

    // Upper leg

    drawLimb(
        22,
        65,
        rightKneeX,
        rightKneeY,
        23,
        "#26314e"
    );

    drawJoint(rightKneeX, rightKneeY, 10, "#e9ad86");

    // Lower leg

    drawLimb(
        rightKneeX,
        rightKneeY,
        rightFootX,
        rightFootY,
        19,
        "#26314e"
    );

    // Shoe

    drawLimb(
        rightFootX - 10,
        rightFootY,
        rightFootX + 25,
        rightFootY,
        13,
        "#ffffff"
    );

}


// ==========================================
// 8. CHARACTER SHADOW
// ==========================================

function drawShadow(t) {

    const pulse = oscillate(t, 4) * 7;

    const radius = 90 + pulse;

    ctx.save();

    ctx.globalAlpha = 0.3;

    ctx.beginPath();

    ctx.ellipse(
        0,
        245,
        radius,
        15,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#000000";

    ctx.fill();

    ctx.restore();

}


// ==========================================
// 9. BACKGROUND PARTICLES
// ==========================================

const particles = Array.from(
    { length: 45 },
    () => ({

        x: Math.random(),

        y: Math.random(),

        size: Math.random() * 2.5 + 1,

        speed: Math.random() * 20 + 10,

        alpha: Math.random() * 0.5 + 0.2

    })
);


function drawParticles(t) {

    particles.forEach(p => {

        const x = p.x * W;

        const y = (
            p.y * H - t * p.speed + H * 10
        ) % H;

        ctx.beginPath();

        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        ctx.fillStyle =
            `rgba(120,210,255,${p.alpha})`;

        ctx.fill();

    });

}


// ==========================================
// 10. BACKGROUND LIGHT
// ==========================================

function drawBackground(t) {

    const gradient = ctx.createRadialGradient(

        W * (0.5 + oscillate(t, 0.3) * 0.08),

        H * 0.45,

        10,

        W * 0.5,

        H * 0.5,

        Math.max(W, H) * 0.8

    );

    gradient.addColorStop(0, "rgba(40,100,170,0.12)");

    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, W, H);

}


// ==========================================
// 11. COMPLETE CHARACTER
// ==========================================

function drawCharacter(t) {

    const bounce =
        Math.abs(Math.sin(t * 4)) * 20;

    const sway =
        Math.sin(t * 2) * 12;

    const scale = Math.min(
        W / 500,
        H / 550,
        1.1
    );

    ctx.save();

    // Character position

    ctx.translate(
        W / 2 + sway,
        H / 2 - bounce + 5
    );

    ctx.scale(scale, scale);

    // Body rotation

    ctx.rotate(
        Math.sin(t * 2) * 0.07
    );

    // Draw character parts

    drawShadow(t);

    drawLegs(t);

    drawBody(t);

    drawArms(t);

    drawHead(t);

    ctx.restore();

}


// ==========================================
// 12. MAIN RENDER ENGINE
// ==========================================

function render(t) {

    if (W <= 0 || H <= 0) return;

    ctx.clearRect(0, 0, W, H);

    drawBackground(t);

    drawParticles(t);

    drawCharacter(t);

}


// ==========================================
// 13. ANIMATION LOOP
// ==========================================

let startTime = null;

let previousTime = 0;

function animate(timestamp) {

    if (startTime === null) {

        startTime = timestamp;

    }

    const elapsed =
        (timestamp - startTime) / 1000;

    // Continuous looping animation

    render(elapsed);

    previousTime = timestamp;

    requestAnimationFrame(animate);

}


// ==========================================
// 14. START ANIMATION
// ==========================================

render(0);

requestAnimationFrame(animate);

console.log("Dancing character animation started successfully.");
```
