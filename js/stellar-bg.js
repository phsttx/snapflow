/* ==========================================================================
   SnapFlow - Dual Neon Ambient Spotlight Background Engine (Opção 8 - Apple/Stripe Style)
   Holofotes Duplos Neon em Vidro com Rastreamento Amortecido do Mouse (60 FPS)
   ========================================================================== */

class DualNeonSpotlightModule {
  constructor() {
    this.canvas = document.getElementById('stellarBg');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'stellarBg';
      document.body.prepend(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');

    this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
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
    this.canvas.style.opacity = '1';

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
      this.mouse.targetX = this.width / 2;
      this.mouse.targetY = this.height / 2;
    });
  }

  animate() {
    this.time += 0.005;

    // Smooth Lerp Mouse Movement for Primary Spotlight
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const isLightMode = document.body.classList.contains('light-theme');

    // Base background fill
    this.ctx.fillStyle = isLightMode ? '#f4f4f5' : '#09090b';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Orb 2: Autonomous Orbital Purple/Violet Spotlight
    const orb2X = this.width * 0.7 + Math.sin(this.time * 0.8) * 180;
    const orb2Y = this.height * 0.4 + Math.cos(this.time * 0.6) * 140;
    const orb2Radius = Math.min(this.width, this.height) * 0.45;

    const grad2 = this.ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, orb2Radius);
    if (isLightMode) {
      grad2.addColorStop(0, 'rgba(192, 132, 252, 0.25)');
      grad2.addColorStop(0.6, 'rgba(168, 85, 247, 0.08)');
      grad2.addColorStop(1, 'rgba(244, 244, 245, 0)');
    } else {
      grad2.addColorStop(0, 'rgba(147, 51, 234, 0.22)');
      grad2.addColorStop(0.6, 'rgba(126, 34, 206, 0.06)');
      grad2.addColorStop(1, 'rgba(9, 9, 11, 0)');
    }

    this.ctx.fillStyle = grad2;
    this.ctx.beginPath();
    this.ctx.arc(orb2X, orb2Y, orb2Radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Orb 1: Interactive Sky Blue Mouse Spotlight
    const orb1Radius = Math.min(this.width, this.height) * 0.4;
    const grad1 = this.ctx.createRadialGradient(this.mouse.x, this.mouse.y, 0, this.mouse.x, this.mouse.y, orb1Radius);

    if (isLightMode) {
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      grad1.addColorStop(0.5, 'rgba(14, 165, 233, 0.1)');
      grad1.addColorStop(1, 'rgba(244, 244, 245, 0)');
    } else {
      grad1.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
      grad1.addColorStop(0.5, 'rgba(3, 105, 161, 0.08)');
      grad1.addColorStop(1, 'rgba(9, 9, 11, 0)');
    }

    this.ctx.fillStyle = grad1;
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.x, this.mouse.y, orb1Radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle Noise Texture Overlay Effect for Premium Glass Polish
    this.ctx.fillStyle = isLightMode ? 'rgba(0, 0, 0, 0.015)' : 'rgba(255, 255, 255, 0.012)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.dualNeonSpotlightModule = new DualNeonSpotlightModule();
});
