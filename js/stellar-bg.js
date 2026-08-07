/* ==========================================================================
   SnapFlow - Interactive Fluid Aurora Borealis Background Engine (60 FPS)
   Ondas de Fluido Orgânico com Distorção e Brilho Interativo sob o Cursor
   ========================================================================== */

class FluidAuroraBackgroundModule {
  constructor() {
    this.canvas = document.getElementById('stellarBg');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'stellarBg';
      document.body.prepend(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');

    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    this.time = 0;

    this.initCanvas();
    this.bindEvents();
    this.animate();
  }

  initCanvas() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.85';

    this.resize();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.targetX = -1000;
      this.mouse.targetY = -1000;
    });
  }

  animate() {
    this.time += 0.008;

    // Smooth lerp mouse position
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isLightMode = document.body.classList.contains('light-theme');

    // Base background fill
    this.ctx.fillStyle = isLightMode ? '#f4f4f5' : '#09090b';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw Aurora Fluid Waves Layer 1 (Ciano / Sky)
    this.drawAuroraWave(
      isLightMode ? 'rgba(56, 189, 248, 0.18)' : 'rgba(56, 189, 248, 0.15)',
      this.width * 0.3,
      this.height * 0.4,
      this.width * 0.45,
      Math.sin(this.time * 0.8) * 40,
      Math.cos(this.time * 0.6) * 40
    );

    // Draw Aurora Fluid Waves Layer 2 (Indigo / Roxo)
    this.drawAuroraWave(
      isLightMode ? 'rgba(168, 85, 247, 0.15)' : 'rgba(139, 92, 246, 0.18)',
      this.width * 0.7,
      this.height * 0.6,
      this.width * 0.5,
      Math.cos(this.time * 0.7) * 50,
      Math.sin(this.time * 0.9) * 50
    );

    // Draw Aurora Fluid Waves Layer 3 (Deep Sky Accent)
    this.drawAuroraWave(
      isLightMode ? 'rgba(14, 165, 233, 0.12)' : 'rgba(3, 105, 161, 0.2)',
      this.width * 0.5,
      this.height * 0.2,
      this.width * 0.4,
      Math.sin(this.time * 1.1) * 35,
      Math.cos(this.time * 0.8) * 35
    );

    // Interactive Cursor Fluid Glow Spotlight
    if (this.mouse.x > 0 && this.mouse.y > 0) {
      const gradient = this.ctx.createRadialGradient(
        this.mouse.x,
        this.mouse.y,
        0,
        this.mouse.x,
        this.mouse.y,
        280
      );

      if (isLightMode) {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.1)');
        gradient.addColorStop(1, 'rgba(244, 244, 245, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.12)');
        gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
      }

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.x, this.mouse.y, 280, 0, Math.PI * 2);
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }

  drawAuroraWave(color, centerX, centerY, radius, offsetX, offsetY) {
    const posX = centerX + offsetX;
    const posY = centerY + offsetY;

    const grad = this.ctx.createRadialGradient(posX, posY, 0, posX, posY, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(posX, posY, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.fluidAuroraModule = new FluidAuroraBackgroundModule();
});
