```javascript
const canvas = document.getElementById("danceCanvas");
const ctx = canvas.getContext("2d");

let W, H;

function resize() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = canvas.clientWidth;
    H = canvas.clientHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

window.addEventListener("resize", resize);
resize();


// ------------------------------
// DRAWING UTILITIES
// ------------------------------

function roundedRect(x, y, w, h, r, color) {

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.roundRect(x, y, w, h, r);

    ctx.fill();

}


function drawLimb(x1, y1, x2, y2, thickness, color) {

    ctx.strokeStyle = color;

    ctx.lineWidth = thickness;

    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(x1, y1);

    ctx.lineTo(x2, y2);

    ctx.stroke();

}


function drawJoint(x, y, radius, color) {

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(x, y, radius, 0, Math.PI * 2);

    ctx.fill();

}


// ------------------------------
// CHARACTER HEAD
// ------------------------------

function drawHead(t) {

    ctx.save();

    const headTilt = Math.sin(t * 3) * 0.12;

    ctx.translate(0, -105);

    ctx.rotate(headTilt);

    // Neck

    roundedRect(-13, 25, 26, 35, 10, "#b86e4d");

    // Head

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

    ctx.ellipse(-32, -17, 17, 34, -0.4, 0, Math.PI * 2);

    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(32, -17, 17, 34, 0.4, 0, Math.PI * 2);

    ctx.fill();

    // Eyes

    ctx.fillStyle = "#29232a";

    ctx.beginPath();

    ctx.arc(-17, -3, 4, 0, Math.PI * 2);

    ctx.arc(17, -3, 4, 0, Math.PI * 2);

    ctx.fill();

    // Smile

    ctx.strokeStyle = "#783d39";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(0, 12, 12, 0.15, Math.PI - 0.15);

    ctx.stroke();

    // Cheeks

    ctx.fillStyle = "rgba(255,100,120,0.3)";

    ctx.beginPath();

    ctx.arc(-30, 13, 8, 0, Math.PI * 2);

    ctx.arc(30, 13, 8, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();

}


// ------------------------------
// BODY
// ------------------------------

function drawBody(t) {

    ctx.save();

    const bounce = Math.sin(t * 4) * 5;

    ctx.translate(0, bounce);

    // Shirt

    ctx.fillStyle = "#5c75ff";

    ctx.beginPath();

    ctx.moveTo(-38, -55);

    ctx.lineTo(38, -55);

    ctx.lineTo(48, 65);

    ctx.lineTo(-48, 65);

    ctx.closePath();

    ctx.fill();

    // Shirt details

    ctx.strokeStyle = "#a9b6ff";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(0, -45);

    ctx.lineTo(0, 50);

    ctx.stroke();

    // Shirt collar

    ctx.strokeStyle = "#e8eeff";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(-15, -55);

    ctx.lineTo(0, -38);

    ctx.lineTo(15, -55);

    ctx.stroke();

    // Belt

    roundedRect(-43, 57, 86, 13, 4, "#242c43");

    ctx.restore();

}


// ------------------------------
// ARMS
// ------------------------------

function drawArms(t) {

    const swing = Math.sin(t * 4);

    const shoulderY = -40;

    // Left arm

    const leftAngle = -1.0 + swing * 0.8;

    const leftElbowX = -55 + Math.cos(leftAngle) * 45;
    const leftElbowY = shoulderY + Math.sin(leftAngle) * 45;

    const leftHandX = leftElbowX - 25;
    const leftHandY = leftElbowY - 40 + swing * 12;

    drawLimb(-35, shoulderY, leftElbowX, leftElbowY, 19, "#5c75ff");

    drawJoint(leftElbowX, leftElbowY, 10, "#e5a078");

    drawLimb(leftElbowX, leftElbowY, leftHandX, leftHandY, 13, "#e5a078");

    drawJoint(leftHandX, leftHandY, 11, "#e5a078");


    // Right arm

    const rightAngle = -2.1 - swing * 0.8;

    const rightElbowX = 55 + Math.cos(rightAngle) * 45;
    const rightElbowY = shoulderY + Math.sin(rightAngle) * 45;

    const rightHandX = rightElbowX + 25;
    const rightHandY = rightElbowY - 35 - swing * 12;

    drawLimb(35, shoulderY, rightElbowX, rightElbowY, 19, "#5c75ff");

    drawJoint(rightElbowX, rightElbowY, 10, "#e5a078");

    drawLimb(rightElbowX, rightElbowY, rightHandX, rightHandY, 13, "#e5a078");

    drawJoint(rightHandX, rightHandY, 11, "#e5a078");

}


// ------------------------------
// LEGS
// ------------------------------

function drawLegs(t) {

    const step = Math.sin(t * 4);

    const hipY = 70;

    // Left leg

    const leftKneeX = -25 + step * 20;
    const leftKneeY = 135 - Math.max(0, step) * 25;

    const leftFootX = -35 + step * 40;
    const leftFootY = 210 - Math.max(0, step) * 35;

    drawLimb(-22, hipY, leftKneeX, leftKneeY, 23, "#242e4b");

    drawJoint(leftKneeX, leftKneeY, 11, "#d99570");

    drawLimb(leftKneeX, leftKneeY, leftFootX, leftFootY, 19, "#242e4b");

    drawLimb(leftFootX - 10, leftFootY, leftFootX + 23, leftFootY, 13, "#f2f3f8");


    // Right leg

    const rightKneeX = 25 - step * 20;
    const rightKneeY = 135 + Math.max(0, step) * 25;

    const rightFootX = 35 - step * 40;
    const rightFootY = 210 + Math.max(0, step) * 20;

    drawLimb(22, hipY, rightKneeX, rightKneeY, 23, "#242e4b");

    drawJoint(rightKneeX, rightKneeY, 11, "#d99570");

    drawLimb(rightKneeX, rightKneeY, rightFootX, rightFootY, 19, "#242e4b");

    drawLimb(rightFootX - 10, rightFootY, rightFootX + 23, rightFootY, 13, "#f2f3f8");

}


// ------------------------------
// SHADOW
// ------------------------------

function drawShadow(t) {

    const pulse = Math.sin(t * 4) * 5;

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        235,
        100 + pulse,
        20,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// ------------------------------
// COMPLETE CHARACTER
// ------------------------------

function drawCharacter(t) {

    ctx.save();

    const bounce = Math.abs(Math.sin(t * 4)) * 18;

    const sway = Math.sin(t * 2) * 12;

    ctx.translate(
        W / 2 + sway,
        H / 2 - bounce
    );

    ctx.scale(1.15, 1.15);

    // Shadow stays near floor

    drawShadow(t);

    // Character movement

    ctx.rotate(Math.sin(t * 2) * 0.06);

    drawLegs(t);

    drawBody(t);

    drawArms(t);

    drawHead(t);

    ctx.restore();

}


// ------------------------------
// BACKGROUND PARTICLES
// ------------------------------

const particles = Array.from({ length: 35 }, () => ({

    x: Math.random(),
    y: Math.random(),

    size: Math.random() * 3 + 1,

    speed: Math.random() * 0.15 + 0.05

}));


function drawParticles(t) {

    particles.forEach(p => {

        const x = p.x * W;

        const y = ((p.y - t * p.speed * 0.1) % 1 + 1) % 1 * H;

        ctx.fillStyle = "rgba(130,210,255,0.5)";

        ctx.beginPath();

        ctx.arc(x, y, p.size, 0, Math.PI * 2);

        ctx.fill();

    });

}


// ------------------------------
// ANIMATION LOOP
// ------------------------------

let start = performance.now();

function animate(now) {

    const t = (now - start) / 1000;

    ctx.clearRect(0, 0, W, H);

    drawParticles(t);

    drawCharacter(t);

    requestAnimationFrame(animate);

}

requestAnimationFrame(animate);
```
