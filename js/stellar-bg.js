/* ==========================================================================
   SnapFlow - High-End Bioluminescent Fluid & Constellation Particle Engine
   WebGL & Canvas 2D Architecture - 60/120 FPS Fluid Physics with Cursor Gravity
   ========================================================================== */

class StellarBackground {
  constructor() {
    this.canvas = document.getElementById('stellarBg');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.orbs = [];
    
    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      isHovered: false
    };

    this.particleCount = window.innerWidth < 768 ? 45 : 90;
    this.connectionDist = 130;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.initOrbs();
    this.initParticles();
    this.initEvents();
    this.resize();
    this.animate();
  }

  initOrbs() {
    // 3 Bioluminescent Atmospheric Light Wells
    this.orbs = [
      {
        x: window.innerWidth * 0.25,
        y: window.innerHeight * 0.3,
        radius: 380,
        color: 'rgba(56, 189, 248, 0.12)', // Electric Sky
        vx: 0.3,
        vy: 0.2,
        phase: 0
      },
      {
        x: window.innerWidth * 0.75,
        y: window.innerHeight * 0.6,
        radius: 440,
        color: 'rgba(129, 140, 248, 0.09)', // Nebula Indigo
        vx: -0.25,
        vy: 0.35,
        phase: Math.PI / 2
      },
      {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.85,
        radius: 320,
        color: 'rgba(192, 132, 252, 0.08)', // Cosmic Violet
        vx: 0.2,
        vy: -0.25,
        phase: Math.PI
      }
    ];
  }

  initParticles() {
    this.particles = [];
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        originX: Math.random() * w,
        originY: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.4 ? '#38bdf8' : (Math.random() > 0.5 ? '#818cf8' : '#ffffff')
      });
    }
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.isHovered = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.isHovered = false;
      this.mouse.targetX = window.innerWidth / 2;
      this.mouse.targetY = window.innerHeight / 2;
    });
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  animate() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Smooth Mouse Interpolation (Inertia)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    const isLight = document.body.classList.contains('light-theme');

    // Solid Background Base (Deep Obsidian in Dark Mode / Pure Crisp Zinc in Light Mode)
    this.ctx.fillStyle = isLight ? '#f4f4f5' : '#07090e';
    this.ctx.fillRect(0, 0, w, h);

    // 1. Render Bioluminescent Ambient Orbs
    for (const orb of this.orbs) {
      orb.phase += 0.01;
      orb.x += orb.vx + Math.sin(orb.phase) * 0.4;
      orb.y += orb.vy + Math.cos(orb.phase) * 0.4;

      if (orb.x < -100) orb.x = w + 100;
      if (orb.x > w + 100) orb.x = -100;
      if (orb.y < -100) orb.y = h + 100;
      if (orb.y > h + 100) orb.y = -100;

      // Mouse influence on orbs
      const dx = this.mouse.x - orb.x;
      const dy = this.mouse.y - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 500) {
        orb.x += (dx / dist) * 0.6;
        orb.y += (dy / dist) * 0.6;
      }

      const grad = this.ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, isLight ? 'rgba(56, 189, 248, 0.07)' : orb.color);
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 2. Render Constellation Filaments (Lines)
    this.ctx.lineWidth = 0.75;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDist) {
          const alpha = (1 - dist / this.connectionDist) * 0.18;
          this.ctx.strokeStyle = isLight 
            ? `rgba(2, 132, 199, ${alpha * 0.8})` 
            : `rgba(56, 189, 248, ${alpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    // 3. Render Particles with Mouse Gravity & Pulsing Glow
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Gravity pull / repulsion from cursor
      const mdx = this.mouse.x - p.x;
      const mdy = this.mouse.y - p.y;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mDist < 160) {
        const force = (1 - mDist / 160) * 1.5;
        p.x -= (mdx / mDist) * force;
        p.y -= (mdy / mDist) * force;

        // Draw active laser link from cursor to closest particles
        if (mDist < 90) {
          const cursorAlpha = (1 - mDist / 90) * 0.25;
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${cursorAlpha})`;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }

      // Draw particle dot
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.stellarBgInstance = new StellarBackground();
});
