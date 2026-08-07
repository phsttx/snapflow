/* ==========================================================================
   SupaEdit - Glassmorphism & Box Shadows CSS Studio Module
   ========================================================================== */

class CssEffectsModule {
  constructor() {
    this.blur = 16;
    this.opacity = 20;
    this.shadowX = 0;
    this.shadowY = 10;
    this.shadowBlur = 30;
    this.borderRadius = 16;
    this.tint = 'light'; // light, dark, blue, purple

    this.initEvents();
    this.render();
  }

  initEvents() {
    this.previewCard = document.getElementById('cssPreviewCard');
    this.codeOutput = document.getElementById('cssEffectCode');
    this.copyBtn = document.getElementById('copyCssEffectBtn');

    const bindInput = (id, prop, unit = '%') => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this[prop] = parseInt(e.target.value, 10);
          const valEl = document.getElementById(`${id}Val`);
          if (valEl) valEl.textContent = `${e.target.value}${unit}`;
          this.render();
        });
      }
    };

    bindInput('cssBlurRange', 'blur', 'px');
    bindInput('cssOpacityRange', 'opacity', '%');
    bindInput('cssRadiusRange', 'borderRadius', 'px');
    bindInput('cssShadowBlurRange', 'shadowBlur', 'px');

    // Glass Tint Swatches
    document.querySelectorAll('[data-glass-tint]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-glass-tint]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.tint = btn.dataset.glassTint;
        this.render();
      });
    });

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => {
        if (!this.codeOutput) return;
        navigator.clipboard.writeText(this.codeOutput.textContent);
        Utils.showToast('Código CSS de efeito copiado com sucesso!');
      });
    }
  }

  getBgColor() {
    const alpha = (this.opacity / 100).toFixed(2);
    switch (this.tint) {
      case 'dark':
        return `rgba(0, 0, 0, ${alpha})`;
      case 'blue':
        return `rgba(56, 189, 248, ${alpha})`;
      case 'purple':
        return `rgba(168, 85, 247, ${alpha})`;
      case 'light':
      default:
        return `rgba(255, 255, 255, ${alpha})`;
    }
  }

  getBorderColor() {
    switch (this.tint) {
      case 'dark':
        return 'rgba(255, 255, 255, 0.1)';
      case 'blue':
        return 'rgba(56, 189, 248, 0.35)';
      case 'purple':
        return 'rgba(168, 85, 247, 0.35)';
      case 'light':
      default:
        return 'rgba(255, 255, 255, 0.25)';
    }
  }

  render() {
    if (!this.previewCard || !this.codeOutput) return;

    const bgColor = this.getBgColor();
    const borderColor = this.getBorderColor();

    const cssString = `/* Glassmorphism Effect */
background: ${bgColor};
backdrop-filter: blur(${this.blur}px);
-webkit-backdrop-filter: blur(${this.blur}px);
border: 1px solid ${borderColor};
border-radius: ${this.borderRadius}px;
box-shadow: 0px 10px ${this.shadowBlur}px rgba(0, 0, 0, 0.4);`;

    this.previewCard.style.background = bgColor;
    this.previewCard.style.backdropFilter = `blur(${this.blur}px)`;
    this.previewCard.style.webkitBackdropFilter = `blur(${this.blur}px)`;
    this.previewCard.style.border = `1px solid ${borderColor}`;
    this.previewCard.style.borderRadius = `${this.borderRadius}px`;
    this.previewCard.style.boxShadow = `0px 10px ${this.shadowBlur}px rgba(0, 0, 0, 0.4)`;

    this.codeOutput.textContent = cssString;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cssEffectsApp = new CssEffectsModule();
});
