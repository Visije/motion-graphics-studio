const canvas = document.getElementById("danceCanvas");
const ctx = canvas.getContext("2d");

const BASE_W = 600;
const BASE_H = 800;

let time = 0;

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const rect = canvas.getBoundingClientRect();

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    ctx.setTransform(
        canvas.width / BASE_W,
        0,
        0,
        canvas.height / BASE_H,
        0,
        0
    );
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


// DRAW LIMBS

function limb(x1, y1, x2, y2, width, color) {

    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";

    ctx.stroke();
}


// JOINTS

function joint(x, y, radius, color) {

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fillStyle = color;
    ctx.fill();

}


// HEAD

function drawHead(t) {

    ctx.save();

    ctx.translate(0, -120);
    ctx.rotate(Math.sin(t * 3) * 0.12);

    // Neck

    ctx.fillStyle = "#b86e4d";
    ctx.fillRect(-12, 30, 24, 35);

    // Face

    ctx.fillStyle = "#e5a078";

    ctx.beginPath();
    ctx.ellipse(0, 0, 48, 58, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair

    ctx.fillStyle = "#25212b";

    ctx.beginPath();
    ctx.arc(0, -23, 49, Math.PI, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(-32, -15, 17, 34, -0.4, 0, Math.PI * 2);
    ctx.ellipse(32, -15, 17, 34, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Eyes

    ctx.fillStyle = "#29232a";

    joint(-17, -3, 4, "#29232a");
    joint(17, -3, 4, "#29232a");

    // Smile

    ctx.beginPath();
    ctx.arc(0, 12, 12, 0.15, Math.PI - 0.15);

    ctx.strokeStyle = "#783d39";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
}


// BODY

function drawBody(t) {

    ctx.save();

    ctx.translate(0, Math.sin(t * 4) * 5);

    // Shirt

    ctx.fillStyle = "#5c75ff";

    ctx.beginPath();

    ctx.moveTo(-38, -55);
    ctx.lineTo(38, -55);
    ctx.lineTo(48, 65);
    ctx.lineTo(-48, 65);

    ctx.closePath();
    ctx.fill();

    // Shirt detail

    limb(0, -45, 0, 50, 3, "#a9b6ff");

    // Collar

    limb(-15, -55, 0, -38, 4, "#ffffff");
    limb(0, -38, 15, -55, 4, "#ffffff");

    // Belt

    ctx.fillStyle = "#242c43";
    ctx.fillRect(-43, 57, 86, 13);

    ctx.restore();
}


// ARMS

function drawArms(t) {

    const swing = Math.sin(t * 4);

    const leftElbowX = -65;
    const leftElbowY = -65 + swing * 35;

    const leftHandX = -100;
    const leftHandY = -120 + swing * 45;

    const rightElbowX = 65;
    const rightElbowY = -65 - swing * 35;

    const rightHandX = 100;
    const rightHandY = -120 - swing * 45;

    // Left arm

    limb(-35, -40, leftElbowX, leftElbowY, 19, "#5c75ff");

    joint(leftElbowX, leftElbowY, 10, "#e5a078");

    limb(
        leftElbowX,
        leftElbowY,
        leftHandX,
        leftHandY,
        13,
        "#e5a078"
    );

    joint(leftHandX, leftHandY, 11, "#e5a078");


    // Right arm

    limb(35, -40, rightElbowX, rightElbowY, 19, "#5c75ff");

    joint(rightElbowX, rightElbowY, 10, "#e5a078");

    limb(
        rightElbowX,
        rightElbowY,
        rightHandX,
        rightHandY,
        13,
        "#e5a078"
    );

    joint(rightHandX, rightHandY, 11, "#e5a078");

}


// LEGS

function drawLegs(t) {

    const step = Math.sin(t * 4);

    const leftKneeX = -30 + step * 22;
    const rightKneeX = 30 - step * 22;

    const leftFootX = -35 + step * 40;
    const rightFootX = 35 - step * 40;

    // Left leg

    limb(-22, 70, leftKneeX, 140, 23, "#242e4b");

    joint(leftKneeX, 140, 11, "#d99570");

    limb(
        leftKneeX,
        140,
        leftFootX,
        220 - Math.max(0, step) * 35,
        19,
        "#242e4b"
    );

    // Left shoe

    limb(
        leftFootX - 10,
        220 - Math.max(0, step) * 35,
        leftFootX + 25,
        220 - Math.max(0, step) * 35,
        13,
        "#ffffff"
    );


    // Right leg

    limb(22, 70, rightKneeX, 140, 23, "#242e4b");

    joint(rightKneeX, 140, 11, "#d99570");

    limb(
        rightKneeX,
        140,
        rightFootX,
        220 - Math.max(0, -step) * 35,
        19,
        "#242e4b"
    );

    // Right shoe

    limb(
        rightFootX - 10,
        220 - Math.max(0, -step) * 35,
        rightFootX + 25,
        220 - Math.max(0, -step) * 35,
        13,
        "#ffffff"
    );

}


// CHARACTER

function drawCharacter(t) {

    ctx.save();

    const bounce = Math.abs(Math.sin(t * 4)) * 20;
    const sway = Math.sin(t * 2) * 12;

    ctx.translate(
        BASE_W / 2 + sway,
        390 - bounce
    );

    ctx.scale(1.15, 1.15);

    // Shadow

    ctx.beginPath();

    ctx.ellipse(
        0,
        245,
        100 + Math.sin(t * 4) * 5,
        18,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fill();

    // Body movement

    ctx.rotate(Math.sin(t * 2) * 0.06);

    drawLegs(t);
    drawBody(t);
    drawArms(t);
    drawHead(t);

    ctx.restore();

}


// BACKGROUND PARTICLES

const particles = Array.from({ length: 35 }, () => ({

    x: Math.random() * BASE_W,
    y: Math.random() * BASE_H,

    size: Math.random() * 3 + 1,
    speed: Math.random() * 30 + 15

}));

function drawParticles(t) {

    particles.forEach(p => {

        const y = (p.y - t * p.speed) % BASE_H;

        ctx.beginPath();

        ctx.arc(
            p.x,
            (y + BASE_H) % BASE_H,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(130,210,255,0.6)";
        ctx.fill();

    });

}


// ANIMATION ENGINE

let previousTime = 0;

function animate(timestamp) {

    if (!previousTime) previousTime = timestamp;

    const delta = Math.min((timestamp - previousTime) / 1000, 0.05);

    previousTime = timestamp;

    time += delta;

    ctx.clearRect(0, 0, BASE_W, BASE_H);

    drawParticles(time);

    drawCharacter(time);

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);
