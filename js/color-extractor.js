/* ==========================================================================
   OmniMedia Studio - Dominant Color Extractor & CSS Gradient Generator
   ========================================================================== */

class ColorExtractorModule {
  constructor() {
    this.sourceImg = document.getElementById('colorSourceImg');
    this.samplingCanvas = document.getElementById('colorSamplingCanvas');
    this.ctx = this.samplingCanvas ? this.samplingCanvas.getContext('2d') : null;

    this.dropZone = document.getElementById('colorDropZone');
    this.fileInput = document.getElementById('colorFileInput');
    this.workspace = document.getElementById('colorWorkspace');

    this.paletteGrid = document.getElementById('paletteGrid');
    this.gradientPreview = document.getElementById('gradientPreview');
    this.gradientCssCode = document.getElementById('gradientCssCode');
    this.copyGradientBtn = document.getElementById('copyGradientBtn');

    this.extractedColors = [];

    this.initEvents();
  }

  initEvents() {
    if (!this.dropZone || !this.fileInput) return;

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.processFile(e.target.files[0]);
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) this.processFile(e.dataTransfer.files[0]);
    });

    if (this.copyGradientBtn) {
      this.copyGradientBtn.addEventListener('click', () => {
        const css = this.gradientCssCode.textContent;
        navigator.clipboard.writeText(css);
        Utils.showToast('Gradiente CSS copiado para a área de transferência!');
      });
    }

    // Click on image to pick exact pixel color
    if (this.sourceImg) {
      this.sourceImg.addEventListener('click', (e) => this.pickPixelColor(e));
    }
  }

  async processFile(file) {
    try {
      const img = await Utils.fileToImage(file);
      this.sourceImg.src = img.src;

      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.extractPalette(img);
      Utils.showToast('Paleta de cores extraída com sucesso!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao processar imagem para extração de cores.', 'error');
    }
  }

  extractPalette(img) {
    const w = 150; // Downscale for fast sampling
    const h = Math.round((img.naturalHeight / img.naturalWidth) * w);

    this.samplingCanvas.width = w;
    this.samplingCanvas.height = h;

    this.ctx.drawImage(img, 0, 0, w, h);
    const imageData = this.ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // Color quantization via step sampling
    const colorCounts = {};

    for (let i = 0; i < data.length; i += 16) {
      const r = Math.round(data[i] / 24) * 24;
      const g = Math.round(data[i + 1] / 24) * 24;
      const b = Math.round(data[i + 2] / 24) * 24;
      const a = data[i + 3];

      if (a < 128) continue; // Skip transparent pixels

      const key = `${r},${g},${b}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }

    // Sort by frequency
    const sorted = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    this.extractedColors = sorted.map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, hex: this.rgbToHex(r, g, b) };
    });

    this.renderPalette();
    this.renderGradient();
  }

  renderPalette() {
    if (!this.paletteGrid) return;
    this.paletteGrid.innerHTML = '';

    this.extractedColors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'swatch-card';
      swatch.innerHTML = `
        <div class="swatch-color" style="background-color: ${color.hex}"></div>
        <div class="swatch-info">
          <span class="swatch-hex">${color.hex}</span>
          <span class="swatch-rgb">rgb(${color.r}, ${color.g}, ${color.b})</span>
        </div>
      `;

      swatch.addEventListener('click', () => {
        navigator.clipboard.writeText(color.hex);
        Utils.showToast(`Cor ${color.hex} copiada!`);
      });

      this.paletteGrid.appendChild(swatch);
    });
  }

  renderGradient() {
    if (this.extractedColors.length < 2) return;

    const c1 = this.extractedColors[0].hex;
    const c2 = this.extractedColors[1].hex;
    const c3 = this.extractedColors[2] ? `, ${this.extractedColors[2].hex}` : '';

    const cssRule = `background: linear-gradient(135deg, ${c1}, ${c2}${c3});`;

    if (this.gradientPreview) this.gradientPreview.style.background = `linear-gradient(135deg, ${c1}, ${c2}${c3})`;
    if (this.gradientCssCode) this.gradientCssCode.textContent = cssRule;
  }

  pickPixelColor(e) {
    if (!this.ctx || !this.samplingCanvas) return;

    const rect = this.sourceImg.getBoundingClientRect();
    const xRatio = this.samplingCanvas.width / rect.width;
    const yRatio = this.samplingCanvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * xRatio);
    const y = Math.floor((e.clientY - rect.top) * yRatio);

    const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    const hex = this.rgbToHex(pixel[0], pixel[1], pixel[2]);

    navigator.clipboard.writeText(hex);
    Utils.showToast(`Cor selecionada ${hex} copiada!`);
  }

  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.colorApp = new ColorExtractorModule();
});
