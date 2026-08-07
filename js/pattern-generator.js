/* ==========================================================================
   DesignExpress - Mesh Gradient & Pattern Generator Module
   ========================================================================== */

class PatternGeneratorModule {
  constructor() {
    this.canvas = document.getElementById('patternCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.previewBox = document.getElementById('patternCssPreview');
    this.cssCodeEl = document.getElementById('patternCssCode');

    this.patternType = 'mesh'; // 'mesh', 'wave', 'radial'
    this.color1 = '#09090b';
    this.color2 = '#27272a';
    this.color3 = '#38bdf8';
    this.angle = 135;

    this.initEvents();
    this.render();
  }

  initEvents() {
    if (!this.canvas) return;

    const bindInput = (id, prop, isNumber = false) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this[prop] = isNumber ? parseInt(e.target.value, 10) : e.target.value;
          this.render();
        });
      }
    };

    bindInput('patternColor1', 'color1');
    bindInput('patternColor2', 'color2');
    bindInput('patternColor3', 'color3');
    bindInput('patternAngle', 'angle', true);

    document.querySelectorAll('.pattern-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pattern-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.patternType = btn.dataset.type;
        this.render();
      });
    });

    const copyBtn = document.getElementById('copyPatternCssBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (!this.cssCodeEl) return;
        navigator.clipboard.writeText(this.cssCodeEl.textContent);
        Utils.showToast('Código CSS do padrão copiado!');
      });
    }

    const downloadPngBtn = document.getElementById('downloadPatternPngBtn');
    if (downloadPngBtn) {
      downloadPngBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'supaedit_pattern_background.png');
        Utils.showToast('Padrão de fundo baixado em PNG 4K!');
      });
    }
  }

  render() {
    if (!this.canvas || !this.ctx) return;

    const w = 800;
    const h = 450;
    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx.clearRect(0, 0, w, h);

    let cssRule = '';

    if (this.patternType === 'mesh') {
      // Draw Mesh Gradient onto Canvas
      const rad = (this.angle * Math.PI) / 180;
      const x2 = Math.cos(rad) * w;
      const y2 = Math.sin(rad) * h;

      const grad = this.ctx.createLinearGradient(0, 0, Math.abs(x2), Math.abs(y2));
      grad.addColorStop(0, this.color1);
      grad.addColorStop(0.5, this.color2);
      grad.addColorStop(1, this.color3);

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      // Add mesh radial accents
      const radGrad = this.ctx.createRadialGradient(w * 0.7, h * 0.3, 10, w * 0.7, h * 0.3, w * 0.5);
      radGrad.addColorStop(0, this.color3);
      radGrad.addColorStop(1, 'transparent');
      this.ctx.globalAlpha = 0.4;
      this.ctx.fillStyle = radGrad;
      this.ctx.fillRect(0, 0, w, h);
      this.ctx.globalAlpha = 1.0;

      cssRule = `background: linear-gradient(${this.angle}deg, ${this.color1}, ${this.color2}, ${this.color3});`;
    } else if (this.patternType === 'wave') {
      this.ctx.fillStyle = this.color1;
      this.ctx.fillRect(0, 0, w, h);

      this.ctx.fillStyle = this.color3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, h * 0.6);
      this.ctx.bezierCurveTo(w * 0.25, h * 0.3, w * 0.75, h * 0.9, w, h * 0.5);
      this.ctx.lineTo(w, h);
      this.ctx.lineTo(0, h);
      this.ctx.closePath();
      this.ctx.fill();

      cssRule = `background: linear-gradient(${this.angle}deg, ${this.color1} 50%, ${this.color3} 100%);`;
    } else if (this.patternType === 'radial') {
      const grad = this.ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w / 1.2);
      grad.addColorStop(0, this.color3);
      grad.addColorStop(0.6, this.color2);
      grad.addColorStop(1, this.color1);

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);

      cssRule = `background: radial-gradient(circle at center, ${this.color3}, ${this.color2}, ${this.color1});`;
    }

    if (this.previewBox) this.previewBox.style.background = this.canvas.toDataURL('image/png');
    if (this.cssCodeEl) this.cssCodeEl.textContent = cssRule;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.patternApp = new PatternGeneratorModule();
});
