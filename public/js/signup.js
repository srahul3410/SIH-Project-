// Signup script · JS
// ---------- Animated black hole (accretion disk) background for Sign Up page ----------
const canvas = document.getElementById('signupCanvas');
const ctx = canvas.getContext('2d');
 
let width, height, cx, cy, coreRadius;
let particles = [];
 
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
      baseRadius: orbitRadius,
      radius: orbitRadius,
      speed: rand(0.0025, 0.012) * (coreRadius * 6 / orbitRadius),
      size: rand(0.6, 2.2),
      brightness: rand(0.35, 1),
      fallRate: rand(0.02, 0.08),
      life: rand(0, 1),
    });
  }
}
 
function draw() {
  ctx.clearRect(0, 0, width, height);
 
  const bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.7);
  bgGradient.addColorStop(0, 'rgba(10,10,14,1)');
  bgGradient.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
 
  const diskGlow = ctx.createRadialGradient(cx, cy, coreRadius * 0.8, cx, cy, coreRadius * 5);
  diskGlow.addColorStop(0, 'rgba(255, 200, 140, 0.35)');
  diskGlow.addColorStop(0.35, 'rgba(140, 120, 255, 0.12)');
  diskGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = diskGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius * 5, 0, Math.PI * 2);
  ctx.fill();
 
  for (const p of particles) {
    p.angle += p.speed;
    p.life += p.fallRate * 0.01;
    p.radius = p.baseRadius * (1 - p.life * 0.5);
 
    if (p.radius <= coreRadius * 1.1 || p.life >= 1) {
      p.life = 0;
      p.baseRadius = rand(coreRadius * 1.6, Math.min(width, height) * 0.55);
      p.radius = p.baseRadius;
      p.angle = rand(0, Math.PI * 2);
    }
 
    const x = cx + Math.cos(p.angle) * p.radius;
    const y = cy + Math.sin(p.angle) * p.radius * 0.55;
 
    const fade = 1 - p.life * 0.7;
    const alpha = p.brightness * fade;
 
    ctx.beginPath();
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 225, 190, ${alpha})`;
    ctx.fill();
  }
 
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#000000';
  ctx.fill();
 
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 210, 160, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
 
  requestAnimationFrame(draw);
}
 
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
window.addEventListener('resize', resize);
resize();
 
if (!prefersReducedMotion) {
  requestAnimationFrame(draw);
} else {
  draw();
}
 
// ---------- Password show/hide toggle ----------
document.querySelectorAll('.toggle-eye').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const targetId = toggle.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const eyeOpen = toggle.querySelector('.eye-open');
    const eyeClosed = toggle.querySelector('.eye-closed');
 
    if (input.type === 'password') {
      input.type = 'text';
      eyeOpen.style.display = 'none';
      eyeClosed.style.display = 'block';
    } else {
      input.type = 'password';
      eyeOpen.style.display = 'block';
      eyeClosed.style.display = 'none';
    }
  });
});