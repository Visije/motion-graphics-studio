"use strict";

/* =====================================
   CANVAS INITIALIZATION
===================================== */

const canvas = document.getElementById("danceCanvas");

const ctx = canvas.getContext("2d");

let W = 0;
let H = 0;
let DPR = 1;

function resizeCanvas() {

    const rect = canvas.getBoundingClientRect();

    W = rect.width;
    H = rect.height;

    DPR = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =====================================
   COLORS
===================================== */

const COLORS = {

    skin: "#E9AD86",

    skinDark: "#BD7958",

    hair: "#25202A",

    shirt: "#526DFF",

    shirtLight: "#8295FF",

    pants: "#26314E",

    shoes: "#F5F5FA",

    outline: "#171B2B",

    eyes: "#29202A"

};


/* =====================================
   EASING FUNCTIONS
===================================== */

function clamp(value, min, max) {

    return Math.max(min, Math.min(max, value));

}

function easeInOut(t) {

    t = clamp(t, 0, 1);

    return t * t * (3 - 2 * t);

}


/* =====================================
   DRAWING UTILITIES
===================================== */

function drawLimb(
    x1,
    y1,
    x2,
    y2,
    thickness,
    color
) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.lineWidth = thickness;

    ctx.lineCap = "round";

    ctx.strokeStyle = COLORS.outline;

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.lineWidth = thickness - 4;

    ctx.lineCap = "round";

    ctx.strokeStyle = color;

    ctx.stroke();

}


function drawJoint(x, y, radius, color) {

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = COLORS.outline;

    ctx.fill();

    ctx.beginPath();

    ctx.arc(x, y, radius - 2, 0, Math.PI * 2);

    ctx.fillStyle = color;

    ctx.fill();

}


/* =====================================
   CHARACTER HEAD
===================================== */

function drawHead(t) {

    ctx.save();

    const headTilt = Math.sin(t * 3) * 0.12;

    ctx.translate(0, -125);

    ctx.rotate(headTilt);


    // Ears

    ctx.fillStyle = COLORS.skin;

    ctx.beginPath();

    ctx.arc(-43, 5, 10, 0, Math.PI * 2);

    ctx.arc(43, 5, 10, 0, Math.PI * 2);

    ctx.fill();


    // Face

    ctx.beginPath();

    ctx.ellipse(0, 0, 43, 54, 0, 0, Math.PI * 2);

    ctx.fillStyle = COLORS.skin;

    ctx.fill();


    // Hair

    ctx.fillStyle = COLORS.hair;

    ctx.beginPath();

    ctx.arc(0, -19, 45, Math.PI, Math.PI * 2);

    ctx.fill();


    ctx.beginPath();

    ctx.ellipse(-34, -12, 13, 28, -0.2, 0, Math.PI * 2);

    ctx.ellipse(34, -12, 13, 28, 0.2, 0, Math.PI * 2);

    ctx.fill();


    // Hair fringe

    ctx.beginPath();

    ctx.moveTo(-35, -32);

    ctx.quadraticCurveTo(-12, -65, 5, -40);

    ctx.quadraticCurveTo(20, -65, 37, -30);

    ctx.quadraticCurveTo(0, -20, -35, -32);

    ctx.fill();


    // Blinking

    const blink = Math.pow(
        Math.max(0, Math.sin(t * 2.2 - 1.5)),
        30
    );

    const eyeHeight = Math.max(0.8, 5 - blink * 4.5);


    // Eyes

    ctx.fillStyle = COLORS.eyes;

    ctx.beginPath();

    ctx.ellipse(-15, -3, 3.5, eyeHeight, 0, 0, Math.PI * 2);

    ctx.ellipse(15, -3, 3.5, eyeHeight, 0, 0, Math.PI * 2);

    ctx.fill();


    // Eyebrows

    ctx.strokeStyle = COLORS.hair;

    ctx.lineWidth = 2.5;

    ctx.beginPath();

    ctx.moveTo(-22, -14);

    ctx.lineTo(-10, -16);

    ctx.moveTo(10, -16);

    ctx.lineTo(22, -14);

    ctx.stroke();


    // Nose

    ctx.beginPath();

    ctx.moveTo(0, 2);

    ctx.lineTo(-3, 9);

    ctx.lineTo(3, 9);

    ctx.strokeStyle = COLORS.skinDark;

    ctx.lineWidth = 2;

    ctx.stroke();


    // Smile

    ctx.beginPath();

    ctx.arc(0, 12, 11, 0.15, Math.PI - 0.15);

    ctx.strokeStyle = "#874B43";

    ctx.lineWidth = 2.5;

    ctx.stroke();


    // Cheeks

    ctx.fillStyle = "rgba(255,100,120,0.25)";

    ctx.beginPath();

    ctx.arc(-29, 12, 7, 0, Math.PI * 2);

    ctx.arc(29, 12, 7, 0, Math.PI * 2);

    ctx.fill();


    ctx.restore();

}


/* =====================================
   BODY
===================================== */

function drawBody(t) {

    ctx.save();

    const bodyTilt = Math.sin(t * 4) * 0.04;

    ctx.rotate(bodyTilt);


    // Neck

    ctx.fillStyle = COLORS.skinDark;

    ctx.fillRect(-11, -78, 22, 30);


    // Shirt shape

    ctx.beginPath();

    ctx.moveTo(-35, -65);

    ctx.lineTo(35, -65);

    ctx.lineTo(48, 58);

    ctx.lineTo(-48, 58);

    ctx.closePath();

    ctx.fillStyle = COLORS.outline;

    ctx.fill();


    ctx.beginPath();

    ctx.moveTo(-33, -63);

    ctx.lineTo(33, -63);

    ctx.lineTo(44, 55);

    ctx.lineTo(-44, 55);

    ctx.closePath();

    ctx.fillStyle = COLORS.shirt;

    ctx.fill();


    // Shirt details

    ctx.strokeStyle = COLORS.shirtLight;

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(0, -48);

    ctx.lineTo(0, 45);

    ctx.stroke();


    // Collar

    ctx.beginPath();

    ctx.moveTo(-14, -65);

    ctx.lineTo(0, -45);

    ctx.lineTo(14, -65);

    ctx.strokeStyle = "#FFFFFF";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Buttons

    ctx.fillStyle = "#FFFFFF";

    for (let i = 0; i < 3; i++) {

        ctx.beginPath();

        ctx.arc(0, -20 + i * 23, 2.5, 0, Math.PI * 2);

        ctx.fill();

    }


    // Belt

    ctx.fillStyle = "#1D263E";

    ctx.fillRect(-44, 53, 88, 12);


    ctx.restore();

}


/* =====================================
   ARMS
===================================== */

function drawArms(t) {

    const rhythm = t * 4;

    const swing = Math.sin(rhythm);

    const lift = Math.cos(rhythm);


    // LEFT ARM

    const leftElbowX = -62 - swing * 12;

    const leftElbowY = -65 - lift * 18;

    const leftHandX = leftElbowX - 20;

    const leftHandY = leftElbowY - 35 - lift * 10;


    drawLimb(
        -35, -48,
        leftElbowX, leftElbowY,
        20,
        COLORS.shirt
    );

    drawJoint(
        leftElbowX,
        leftElbowY,
        10,
        COLORS.skin
    );

    drawLimb(
        leftElbowX,
        leftElbowY,
        leftHandX,
        leftHandY,
        15,
        COLORS.skin
    );

    drawJoint(
        leftHandX,
        leftHandY,
        10,
        COLORS.skin
    );


    // RIGHT ARM

    const rightElbowX = 62 + swing * 12;

    const rightElbowY = -65 + lift * 18;

    const rightHandX = rightElbowX + 20;

    const rightHandY = rightElbowY - 35 + lift * 10;


    drawLimb(
        35, -48,
        rightElbowX, rightElbowY,
        20,
        COLORS.shirt
    );

    drawJoint(
        rightElbowX,
        rightElbowY,
        10,
        COLORS.skin
    );

    drawLimb(
        rightElbowX,
        rightElbowY,
        rightHandX,
        rightHandY,
        15,
        COLORS.skin
    );

    drawJoint(
        rightHandX,
        rightHandY,
        10,
        COLORS.skin
    );

}


/* =====================================
   LEGS
===================================== */

function drawLegs(t) {

    const rhythm = t * 4;

    const step = Math.sin(rhythm);

    const opposite = Math.sin(rhythm + Math.PI);


    // LEFT LEG

    const leftKneeX = -27 + step * 22;

    const leftKneeY = 125 - Math.max(0, step) * 20;

    const leftFootX = -30 + step * 38;

    const leftFootY = 205 - Math.max(0, step) * 30;


    drawLimb(
        -22, 60,
        leftKneeX, leftKneeY,
        25,
        COLORS.pants
    );

    drawJoint(
        leftKneeX,
        leftKneeY,
        11,
        COLORS.skin
    );

    drawLimb(
        leftKneeX,
        leftKneeY,
        leftFootX,
        leftFootY,
        20,
        COLORS.pants
    );


    // LEFT SHOE

    drawLimb(
        leftFootX - 5,
        leftFootY,
        leftFootX + 25,
        leftFootY,
        15,
        COLORS.shoes
    );


    // RIGHT LEG

    const rightKneeX = 27 + opposite * 22;

    const rightKneeY = 125 - Math.max(0, opposite) * 20;

    const rightFootX = 30 + opposite * 38;

    const rightFootY = 205 - Math.max(0, opposite) * 30;


    drawLimb(
        22, 60,
        rightKneeX, rightKneeY,
        25,
        COLORS.pants
    );

    drawJoint(
        rightKneeX,
        rightKneeY,
        11,
        COLORS.skin
    );

    drawLimb(
        rightKneeX,
        rightKneeY,
        rightFootX,
        rightFootY,
        20,
        COLORS.pants
    );


    // RIGHT SHOE

    drawLimb(
        rightFootX - 5,
        rightFootY,
        rightFootX + 25,
        rightFootY,
        15,
        COLORS.shoes
    );

}


/* =====================================
   CHARACTER SHADOW
===================================== */

function drawShadow(t) {

    const pulse = Math.sin(t * 4) * 8;

    ctx.beginPath();

    ctx.ellipse(
        0,
        240,
        85 + pulse,
        15,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(0,0,0,0.3)";

    ctx.fill();

}


/* =====================================
   BACKGROUND PARTICLES
===================================== */

const particles = [];

for (let i = 0; i < 45; i++) {

    particles.push({

        x: Math.random(),

        y: Math.random(),

        size: Math.random() * 2.5 + 1,

        speed: Math.random() * 20 + 8,

        alpha: Math.random() * 0.5 + 0.2

    });

}


function drawParticles(t) {

    for (const p of particles) {

        const x = p.x * W;

        const y = ((p.y * H - t * p.speed) % H + H) % H;

        ctx.beginPath();

        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(130,210,255,${p.alpha})`;

        ctx.fill();

    }

}


/* =====================================
   CHARACTER ANIMATION
===================================== */

function drawCharacter(t) {

    ctx.save();


    // Responsive scaling

    const scale = Math.min(

        W / 500,

        H / 570,

        1.1

    );


    // Body bounce

    const bounce = Math.abs(Math.sin(t * 4)) * 20;


    // Body horizontal movement

    const sway = Math.sin(t * 2) * 12;


    ctx.translate(

        W / 2 + sway,

        H / 2 - bounce

    );


    ctx.scale(scale, scale);


    // Character shadow

    drawShadow(t);


    // Body rotation

    ctx.rotate(Math.sin(t * 2) * 0.06);


    // Draw body parts

    drawLegs(t);

    drawArms(t);

    drawBody(t);

    drawHead(t);


    ctx.restore();

}


/* =====================================
   BACKGROUND
===================================== */

function drawBackground(t) {

    const gradient = ctx.createRadialGradient(

        W * (0.5 + Math.sin(t * 0.3) * 0.08),

        H * 0.5,

        10,

        W * 0.5,

        H * 0.5,

        Math.max(W, H)

    );


    gradient.addColorStop(0, "rgba(40,70,110,0.12)");

    gradient.addColorStop(1, "rgba(5,10,25,0)");

    
    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, W, H);

}


/* =====================================
   MAIN ANIMATION ENGINE
===================================== */

const startTime = performance.now();

function animate(now) {

    const t = (now - startTime) / 1000;


    // Clear canvas

    ctx.clearRect(0, 0, W, H);


    // Render background

    drawBackground(t);


    // Render particles

    drawParticles(t);


    // Render dancing character

    drawCharacter(t);


    // Next frame

    requestAnimationFrame(animate);

}


/* =====================================
   START ANIMATION
===================================== */

requestAnimationFrame(animate);
