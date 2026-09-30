// ---------- Animated black hole (accretion disk) background ----------
const canvas = document.getElementById('globeCanvas');
const ctx = canvas.getContext('2d');

let width, height, cx, cy, coreRadius;
let particles = [];
let time = 0;

const PARTICLE_COUNT = 260;

function resize() {
  const panel = canvas.parentElement;
  width = canvas.width = panel.offsetWidth;
  height = canvas.height = panel.offsetHeight;
  cx = width / 2;
  cy = height / 2;
  coreRadius = Math.min(width, height) * 0.09;
  generateParticles();
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function generateParticles() {
  particles = [];
  const maxOrbit = Math.min(width, height) * 0.55;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const orbitRadius = rand(coreRadius * 1.6, maxOrbit);
    particles.push({
      angle: rand(0, Math.PI * 2),
      radius: orbitRadius,
      baseRadius: orbitRadius,
      speed: rand(0.0025, 0.012) * (coreRadius * 6 / orbitRadius), // inner particles orbit faster
      size: rand(0.6, 2.2),
      brightness: rand(0.35, 1),
      fallRate: rand(0.02, 0.08), // how fast it spirals inward over its lifetime
      life: rand(0, 1),
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Background subtle vignette
  const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.7);
  bgGradient.addColorStop(0, 'rgba(10,10,14,1)');
  bgGradient.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Accretion disk glow (behind particles)
  const diskGlow = ctx.createRadialGradient(cx, cy, coreRadius * 0.8, cx, cy, coreRadius * 5);
  diskGlow.addColorStop(0, 'rgba(255, 200, 140, 0.35)');
  diskGlow.addColorStop(0.35, 'rgba(140, 120, 255, 0.12)');
  diskGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = diskGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius * 5, 0, Math.PI * 2);
  ctx.fill();

  // Particles spiraling inward
  for (const p of particles) {
    p.angle += p.speed;
    p.life += p.fallRate * 0.01;
    p.radius = p.baseRadius * (1 - p.life * 0.5);

    // Respawn when it falls too close to the core
    if (p.radius <= coreRadius * 1.1 || p.life >= 1) {
      p.life = 0;
      p.baseRadius = rand(coreRadius * 1.6, Math.min(width, height) * 0.55);
      p.radius = p.baseRadius;
      p.angle = rand(0, Math.PI * 2);
    }

    const x = cx + Math.cos(p.angle) * p.radius;
    const y = cy + Math.sin(p.angle) * p.radius * 0.55; // flatten into disk shape

    const fade = 1 - p.life * 0.7;
    const alpha = p.brightness * fade;

    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 225, 190, ${alpha})`;
    ctx.fill();
  }

  // Event horizon (solid black core)
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();

  // Thin bright ring right at the horizon edge
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 210, 160, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  time += 1;
  requestAnimationFrame(draw);
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('resize', resize);
resize();

if (!prefersReducedMotion) {
  requestAnimationFrame(draw);
} else {
  draw(); // draw a single static frame
}
window.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (loginForm && emailInput) {
    loginForm.addEventListener("submit", (e) => {
      // 1. Prevent page refresh on submit
      e.preventDefault();

      const emailValue = emailInput.value.trim();

      // 2. Check if email matches pattern
      if (!emailRegex.test(emailValue)) {
        emailInput.classList.add("input-error");
        if (emailError) emailError.style.display = "block";
        alert("Please enter a valid email address!");
      } else {
        emailInput.classList.remove("input-error");
        if (emailError) emailError.style.display = "none";
        // Allow the browser to submit the form to the server login route.
        loginForm.submit();
      }
    });

    // Remove red border while typing
    emailInput.addEventListener("input", () => {
      emailInput.classList.remove("input-error");
      if (emailError) emailError.style.display = "none";
    });
  }
});