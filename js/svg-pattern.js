/* ==========================================================================
   SupaEdit - SVG Pattern Repeater & Generator Engine
   ========================================================================== */

class SvgPatternRepeaterModule {
  constructor() {
    this.svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
    this.tileSize = 40;
    this.tileGap = 20;
    this.tileRotate = 0;
    this.tileOpacity = 100;
    this.bgColor = '#09090b';
    this.svgColor = '#38bdf8';
    this.gridMode = 'grid'; // 'grid', 'brick', 'diagonal'

    this.isRandomRotate = false;
    this.randomSeed = 12345;

    this.initEvents();
    this.renderPattern();
  }

  initEvents() {
    this.fileInput = document.getElementById('patternSvgFileInput');
    this.dropZone = document.getElementById('patternSvgDropZone');
    this.canvas = document.getElementById('svgPatternCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.codeOutput = document.getElementById('svgPatternCssCode');

    // Drag & Drop SVG
    if (this.dropZone) {
      this.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
      });

      this.dropZone.addEventListener('dragleave', () => {
        this.dropZone.classList.remove('drag-over');
      });

      this.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.loadSvgFile(e.dataTransfer.files[0]);
        }
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.loadSvgFile(e.target.files[0]);
        }
      });
    }

    // Sliders
    const bindSlider = (id, prop, unit = 'px') => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          this[prop] = parseInt(e.target.value, 10);
          if (prop === 'tileRotate') {
            this.isRandomRotate = false;
          }
          const valEl = document.getElementById(`${id}Val`);
          if (valEl) valEl.textContent = `${e.target.value}${unit}`;
          this.renderPattern();
        });
      }
    };

    bindSlider('patternTileSize', 'tileSize', 'px');
    bindSlider('patternTileGap', 'tileGap', 'px');
    bindSlider('patternTileRotate', 'tileRotate', '°');
    bindSlider('patternTileOpacity', 'tileOpacity', '%');

    // Randomize Rotation Button
    const randomBtn = document.getElementById('randomizePatternRotateBtn');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        this.isRandomRotate = true;
        this.randomSeed = Math.random() * 99999;
        const valEl = document.getElementById('patternTileRotateVal');
        if (valEl) valEl.textContent = 'Aleatório 🎲';
        this.renderPattern();
        Utils.showToast('Rotações aleatórias aplicadas aos SVGs!');
      });
    }

    // Color Inputs
    const bgColorInput = document.getElementById('patternBgColor');
    if (bgColorInput) {
      bgColorInput.addEventListener('input', (e) => {
        this.bgColor = e.target.value;
        this.renderPattern();
      });
    }

    const svgColorInput = document.getElementById('patternSvgColor');
    if (svgColorInput) {
      svgColorInput.addEventListener('input', (e) => {
        this.svgColor = e.target.value;
        this.renderPattern();
      });
    }

    // Grid Modes (Grid, Brick, Diagonal)
    document.querySelectorAll('[data-pattern-layout]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-pattern-layout]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.gridMode = btn.dataset.patternLayout;
        this.renderPattern();
      });
    });

    // Preset SVG Quick Pickers
    document.querySelectorAll('[data-svg-preset]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.svgPreset;
        this.loadSvgPreset(type);
      });
    });

    // Action Buttons
    const copyCssBtn = document.getElementById('copyPatternCssCodeBtn');
    if (copyCssBtn) {
      copyCssBtn.addEventListener('click', () => this.copyCssCode());
    }

    const downloadPngBtn = document.getElementById('downloadPatternPng4kBtn');
    if (downloadPngBtn) {
      downloadPngBtn.addEventListener('click', () => this.downloadPng4K());
    }

    const downloadSvgBtn = document.getElementById('downloadPatternSvgFileBtn');
    if (downloadSvgBtn) {
      downloadSvgBtn.addEventListener('click', () => this.downloadSvgPatternFile());
    }
  }

  loadSvgFile(file) {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      Utils.showToast('Por favor selecione um arquivo no formato .SVG');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.svgContent = e.target.result;
      Utils.showToast('Arquivo SVG carregado com sucesso!');
      this.renderPattern();
    };
    reader.readAsText(file);
  }

  loadSvgPreset(type) {
    const presets = {
      star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
      diamond: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l4 6-10 12L2 9z"/></svg>`,
      sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>`,
      circle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>`,
      grid: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`
    };

    if (presets[type]) {
      this.svgContent = presets[type];
      Utils.showToast(`Preset SVG de ${type} selecionado!`);
      this.renderPattern();
    }
  }

  getModifiedSvgString() {
    let svg = this.svgContent;
    // Replace fill and stroke with custom color
    if (!svg.includes('fill=')) {
      svg = svg.replace('<svg', `<svg fill="${this.svgColor}"`);
    } else {
      svg = svg.replace(/fill="[^"]*"/g, `fill="${this.svgColor}"`);
    }

    if (svg.includes('stroke=')) {
      svg = svg.replace(/stroke="[^"]*"/g, `stroke="${this.svgColor}"`);
    }

    return svg;
  }

  getTileAngle(x, y) {
    if (!this.isRandomRotate) return this.tileRotate;
    const pseudo = Math.sin((x + 1) * 12.9898 + (y + 1) * 78.233 + this.randomSeed) * 43758.5453;
    const factor = pseudo - Math.floor(pseudo);
    return Math.floor(factor * 360);
  }

  renderPattern() {
    if (!this.canvas || !this.ctx) return;

    const width = 800;
    const height = 600;
    this.canvas.width = width;
    this.canvas.height = height;

    // Fill background
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, width, height);

    const modifiedSvg = this.getModifiedSvgString();
    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const stepX = this.tileSize + this.tileGap;
      const stepY = this.tileSize + this.tileGap;
      const alpha = this.tileOpacity / 100;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;

      let row = 0;
      for (let y = -this.tileSize; y < height + this.tileSize; y += stepY) {
        let offsetX = 0;
        if (this.gridMode === 'brick' && row % 2 === 1) {
          offsetX = stepX / 2;
        } else if (this.gridMode === 'diagonal' && row % 2 === 1) {
          offsetX = stepX / 3;
        }

        for (let x = -this.tileSize + offsetX; x < width + this.tileSize; x += stepX) {
          const tileAngle = this.getTileAngle(x, y);

          this.ctx.save();
          this.ctx.translate(x + this.tileSize / 2, y + this.tileSize / 2);
          this.ctx.rotate((tileAngle * Math.PI) / 180);
          this.ctx.drawImage(img, -this.tileSize / 2, -this.tileSize / 2, this.tileSize, this.tileSize);
          this.ctx.restore();
        }
        row++;
      }

      this.ctx.restore();
      URL.revokeObjectURL(url);

      this.updateCssCode();
    };

    img.src = url;
  }

  updateCssCode() {
    if (!this.codeOutput) return;

    const modifiedSvg = this.getModifiedSvgString();
    const encodedSvg = encodeURIComponent(modifiedSvg);
    const stepX = this.tileSize + this.tileGap;

    const css = `/* Pattern SVG Background */
background-color: ${this.bgColor};
background-image: url("data:image/svg+xml,${encodedSvg}");
background-size: ${stepX}px ${stepX}px;
background-repeat: repeat;`;

    this.codeOutput.textContent = css;
  }

  copyCssCode() {
    if (!this.codeOutput) return;
    navigator.clipboard.writeText(this.codeOutput.textContent);
    Utils.showToast('Código CSS do Pattern copiado com sucesso!');
  }

  downloadPng4K() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 3840;
    exportCanvas.height = 2160;
    const eCtx = exportCanvas.getContext('2d');

    // Fill background
    eCtx.fillStyle = this.bgColor;
    eCtx.fillRect(0, 0, 3840, 2160);

    const modifiedSvg = this.getModifiedSvgString();
    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const stepX = (this.tileSize + this.tileGap) * 2;
      const stepY = (this.tileSize + this.tileGap) * 2;
      const tileSize4K = this.tileSize * 2;
      const alpha = this.tileOpacity / 100;

      eCtx.save();
      eCtx.globalAlpha = alpha;

      let row = 0;
      for (let y = -tileSize4K; y < 2160 + tileSize4K; y += stepY) {
        let offsetX = 0;
        if (this.gridMode === 'brick' && row % 2 === 1) {
          offsetX = stepX / 2;
        }

        for (let x = -tileSize4K + offsetX; x < 3840 + tileSize4K; x += stepX) {
          const tileAngle = this.getTileAngle(x, y);

          eCtx.save();
          eCtx.translate(x + tileSize4K / 2, y + tileSize4K / 2);
          eCtx.rotate((tileAngle * Math.PI) / 180);
          eCtx.drawImage(img, -tileSize4K / 2, -tileSize4K / 2, tileSize4K, tileSize4K);
          eCtx.restore();
        }
        row++;
      }

      eCtx.restore();
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = 'snapflow-pattern-4k.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
      Utils.showToast('Pattern em PNG 4K baixado com sucesso!');
    };

    img.src = url;
  }

  downloadSvgPatternFile() {
    const stepX = this.tileSize + this.tileGap;
    const modifiedSvg = this.getModifiedSvgString();

    const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
  <defs>
    <pattern id="svgPattern" width="${stepX}" height="${stepX}" patternUnits="userSpaceOnUse">
      <rect width="${stepX}" height="${stepX}" fill="${this.bgColor}"/>
      <g transform="translate(${stepX/2}, ${stepX/2}) rotate(${this.tileRotate}) translate(-${this.tileSize/2}, -${this.tileSize/2})">
        ${modifiedSvg}
      </g>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#svgPattern)"/>
</svg>`;

    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = 'snapflow-pattern.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
    Utils.showToast('Arquivo SVG Pattern baixado com sucesso!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.svgPatternModule = new SvgPatternRepeaterModule();
});
