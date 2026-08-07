/* ==========================================================================
   SupaEdit - Background Remover Module (Canvas Alpha Segmentation)
   ========================================================================== */

class BgRemoverModule {
  constructor() {
    this.originalImage = null;
    this.targetColor = { r: 255, g: 255, b: 255 }; // Default target white
    this.tolerance = 30;

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('bgDropZone');
    this.fileInput = document.getElementById('bgFileInput');
    this.workspace = document.getElementById('bgWorkspace');
    this.canvas = document.getElementById('bgCanvas');
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

    const tolSlider = document.getElementById('bgToleranceRange');
    if (tolSlider) {
      tolSlider.addEventListener('input', () => {
        this.tolerance = parseInt(tolSlider.value, 10);
        document.getElementById('bgToleranceVal').textContent = `${this.tolerance}%`;
        this.render();
      });
    }

    // Click canvas to pick key background color to remove
    if (this.canvas) {
      this.canvas.addEventListener('click', (e) => {
        if (!this.originalImage || !this.ctx) return;
        const rect = this.canvas.getBoundingClientRect();
        const xRatio = this.canvas.width / rect.width;
        const yRatio = this.canvas.height / rect.height;

        const x = Math.floor((e.clientX - rect.left) * xRatio);
        const y = Math.floor((e.clientY - rect.top) * yRatio);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(this.originalImage, 0, 0);

        const p = tempCtx.getImageData(x, y, 1, 1).data;
        this.targetColor = { r: p[0], g: p[1], b: p[2] };

        Utils.showToast(`Cor de fundo selecionada: rgb(${p[0]}, ${p[1]}, ${p[2]})`);
        this.render();
      });
    }

    const downloadBtn = document.getElementById('downloadBgRemovedBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'snapflow_transparent_bg.png');
        Utils.showToast('Imagem transparente PNG baixada!');
      });
    }
  }

  async loadFile(file) {
    try {
      this.originalImage = await Utils.fileToImage(file);
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.render();
      Utils.showToast('Clique na cor de fundo ou ajuste a tolerância para remover!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar a imagem.', 'error');
    }
  }

  render() {
    if (!this.originalImage || !this.ctx || !this.canvas) return;

    const img = this.originalImage;
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx.drawImage(img, 0, 0);
    const imgData = this.ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const target = this.targetColor;
    const tol = (this.tolerance / 100) * 255;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const diff = Math.sqrt(
        (r - target.r) ** 2 +
        (g - target.g) ** 2 +
        (b - target.b) ** 2
      );

      if (diff < tol) {
        data[i + 3] = 0; // Transparent
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.bgRemoverApp = new BgRemoverModule();
});
