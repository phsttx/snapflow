/* ==========================================================================
   SupaEdit - HD Upscaler & Unsharp Mask Sharpening Module
   ========================================================================== */

class UpscalerModule {
  constructor() {
    this.originalImage = null;
    this.scale = 2; // 2x, 4x
    this.sharpness = 30; // 0-100%

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('upscaleDropZone');
    this.fileInput = document.getElementById('upscaleFileInput');
    this.workspace = document.getElementById('upscaleWorkspace');
    this.canvas = document.getElementById('upscaleCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    if (!this.dropZone || !this.fileInput) return;

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.loadFile(e.target.files[0]);
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) this.loadFile(e.dataTransfer.files[0]);
    });

    // Scale buttons
    document.querySelectorAll('.scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.scale = parseInt(btn.dataset.scale, 10);
        this.render();
      });
    });

    // Sharpness Slider
    const sharpSlider = document.getElementById('sharpnessRange');
    if (sharpSlider) {
      sharpSlider.addEventListener('input', () => {
        this.sharpness = parseInt(sharpSlider.value, 10);
        document.getElementById('sharpnessVal').textContent = `${this.sharpness}%`;
        this.render();
      });
    }

    const downloadBtn = document.getElementById('downloadUpscaledBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, `snapflow_upscaled_${this.scale}x.png`);
        Utils.showToast(`Imagem ampliada ${this.scale}x HD baixada com sucesso!`);
      });
    }
  }

  async loadFile(file) {
    try {
      this.originalImage = await Utils.fileToImage(file);
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.render();
      Utils.showToast('Imagem pronta para ampliação e nitidez HD!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar a imagem.', 'error');
    }
  }

  render() {
    if (!this.originalImage || !this.ctx || !this.canvas) return;

    const img = this.originalImage;
    const targetW = img.naturalWidth * this.scale;
    const targetH = img.naturalHeight * this.scale;

    this.canvas.width = targetW;
    this.canvas.height = targetH;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.ctx.drawImage(img, 0, 0, targetW, targetH);

    // Apply Unsharp Mask sharpening convolution
    if (this.sharpness > 0) {
      const imgData = this.ctx.getImageData(0, 0, targetW, targetH);
      const data = imgData.data;
      const amount = (this.sharpness / 100) * 0.8;

      // 3x3 Sharpen Kernel
      // [ 0, -1,  0]
      // [-1,  5, -1]
      // [ 0, -1,  0]
      const w = targetW;
      const copy = new Uint8ClampedArray(data);

      for (let y = 1; y < targetH - 1; y++) {
        for (let x = 1; x < targetW - 1; x++) {
          const idx = (y * w + x) * 4;

          for (let c = 0; c < 3; c++) {
            const center = copy[idx + c];
            const top = copy[((y - 1) * w + x) * 4 + c];
            const bottom = copy[((y + 1) * w + x) * 4 + c];
            const left = copy[(y * w + (x - 1)) * 4 + c];
            const right = copy[(y * w + (x + 1)) * 4 + c];

            const val = center * (1 + 4 * amount) - (top + bottom + left + right) * amount;
            data[idx + c] = Math.max(0, Math.min(255, val));
          }
        }
      }

      this.ctx.putImageData(imgData, 0, 0);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.upscalerApp = new UpscalerModule();
});
