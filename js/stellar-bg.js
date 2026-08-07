/* ==========================================================================
   SupaEdit - Dual-Theme Interactive Ambient Background Engine
   Dark Mode: Constelação Estelar Noturna (Estrelas & Traços Luminosos)
   Light Mode: Nódulo Geométrico & Partículas de Tinta Fluida Magnética
   ========================================================================== */

class StellarBackgroundModule {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'stellarCanvas';
    this.ctx = this.canvas.getContext('2d');

    this.particles = [];
    this.particleCount = 65;
    this.maxDistance = 110;
    this.mouse = { x: null, y: null, radius: 150 };

    this.initCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
    this.canvas.style.opacity = '0.75';

    document.body.prepend(this.canvas);
    this.resize();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const isLightMode = document.body.classList.contains('light-theme');

    // Theme Color Tokens
    const particleColor = isLightMode ? 'rgba(9, 9, 11, ' : 'rgba(255, 255, 255, ';
    const lineStrokeColor = isLightMode ? 'rgba(2, 132, 199, ' : 'rgba(56, 189, 248, ';
    const gridLineColor = isLightMode ? 'rgba(113, 113, 122, ' : 'rgba(255, 255, 255, ';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Mouse Pursuit & Elastic Gravity
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;

          // Draw Connection Beam to Mouse
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `${lineStrokeColor}${0.35 * (1 - dist / this.mouse.radius)})`;
          this.ctx.lineWidth = isLightMode ? 1 : 0.8;
          this.ctx.stroke();
        }
      }

      // Draw Particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${particleColor}${isLightMode ? p.alpha * 0.25 : p.alpha})`;
      this.ctx.fill();

      // Connect Neighboring Nodes
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const lineAlpha = (1 - dist / this.maxDistance) * (isLightMode ? 0.08 : 0.12);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `${gridLineColor}${lineAlpha})`;
          this.ctx.lineWidth = 0.6;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.stellarBg = new StellarBackgroundModule();
});
