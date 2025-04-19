let heartbeatScale = 1;
let hourScale = 1;
let lastBeatTime = 0;
let beatInterval = 1000;
let timeLabels = [];

function setup() {
  createCanvas(1200, 1200);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textSize(8);
  noStroke();

  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 2) {
      timeLabels.push(nf(h, 2) + ":" + nf(m, 2));
    }
  }
}

function draw() {
  background(255);
  translate(width / 2, height / 2);

  let now = millis();
  let elapsedSec = now / 1000;
  let totalDuration = 20;
  let t = constrain(elapsedSec / totalDuration, 0, 1);

  // 🌀 ROTATION
  let easedRotation;
  if (elapsedSec < 5) {
    // First 5s: slow, linear
    easedRotation = map(elapsedSec, 0, 5, 0, 60);
  } else if (elapsedSec < 15) {
    // 5–15s: accelerate
    let tMid = (elapsedSec - 5) / 10; // 0 → 1
    easedRotation = 60 + tMid * (240); // from 60 to 300 total
  } else {
    // 15–20s: steady finish
    let tEnd = (elapsedSec - 15) / 5;
    easedRotation = 300 + tEnd * 60; // 300 → 360 total
  }

  rotate(easedRotation);

  // 💓 HEARTBEAT SPEED
  if (elapsedSec < 5 || elapsedSec > 15) {
    beatInterval = 1000; // Normal
  } else {
    let tBeat = (elapsedSec - 5) / 10; // 0–1
    beatInterval = map(tBeat, 0, 1, 1000, 500); // Get gradually faster
  }

  // ⏱ Trigger pulse
  
  if (now - lastBeatTime > beatInterval) {
    heartbeatScale = 1.25;
    hourScale = 1.55;
    lastBeatTime = now;
  } else {
    heartbeatScale = lerp(heartbeatScale, 0.5, 0.5);
    hourScale = lerp(hourScale, 0.5, 0.5);
  }

  // 🌀 Minute spiral
  let arms = 36;
  let minRadius = 10;
  let maxRadius = 280;
  let rings = 12;
  let radiusStep = (maxRadius - minRadius) / (rings - 1);
  let index = 0;

  for (let r = 0; r < rings; r++) {
    let radius = minRadius + r * radiusStep;
    let fontSize = map(r, 0, rings - 1, 6, 18);
    textSize(fontSize);

    for (let i = 0; i < arms; i++) {
      if (index >= timeLabels.length) break;

      let angle = (360 / arms) * i;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      push();
      translate(x, y);
      rotate(angle + 90);
      scale(heartbeatScale);
      fill(0);
     
      text(timeLabels[index], 0, 0);
      pop();

      index++;
    }
  }

  // ⭕ Hour ring
  let outerRadius = maxRadius + 35;
  push();
  rotate(-easedRotation * 1.5);
  textSize(15);

  for (let i = 0; i < 24; i++) {
    let angle = map(i, 0, 24, 0, 360);
    let label = nf(i, 2) + ":00";
    let x = cos(angle) * outerRadius;
    let y = sin(angle) * outerRadius;

    push();
    translate(x, y);
    rotate(angle + 90);
    scale(hourScale);
    fill(0);
    text(label, 0, 0);
    pop();
  }
  pop();
}
