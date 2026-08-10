/* ==========================================================================
   SnapFlow - Professional Client-Side Background Remover
   Features: 4-Corner Auto Detection, Flood-Fill Boundary Scan & Alpha Feathering
   ========================================================================== */

class BgRemoverModule {
  constructor() {
    this.originalImage = null;
    this.targetColor = { r: 255, g: 255, b: 255 };
    this.tolerance = 25;
    this.feather = 2;
    this.preserveInterior = true;

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('bgDropZone');
    this.fileInput = document.getElementById('bgFileInput');
    this.workspace = document.getElementById('bgWorkspace');
    this.canvas = document.getElementById('bgCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.colorPreview = document.getElementById('bgDetectedColorPreview');
    this.colorHex = document.getElementById('bgDetectedColorHex');
    this.contiguousToggle = document.getElementById('bgContiguousToggle');
    this.toleranceSlider = document.getElementById('bgToleranceRange');
    this.featherSlider = document.getElementById('bgFeatherRange');

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

    if (this.toleranceSlider) {
      this.toleranceSlider.addEventListener('input', () => {
        this.tolerance = parseInt(this.toleranceSlider.value, 10);
        const label = document.getElementById('bgToleranceVal');
        if (label) label.textContent = `${this.tolerance}%`;
        this.render();
      });
    }

    if (this.featherSlider) {
      this.featherSlider.addEventListener('input', () => {
        this.feather = parseInt(this.featherSlider.value, 10);
        const label = document.getElementById('bgFeatherVal');
        if (label) label.textContent = `${this.feather}px`;
        this.render();
      });
    }

    if (this.contiguousToggle) {
      this.contiguousToggle.addEventListener('change', () => {
        this.preserveInterior = this.contiguousToggle.checked;
        this.render();
      });
    }

    // Interactive Eyedropper: Click canvas to pick target background color
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

        this.updateColorUi();
        Utils.showToast(`Cor selecionada: rgb(${p[0]}, ${p[1]}, ${p[2]})`);
        this.render();
      });
    }

    const downloadBtn = document.getElementById('downloadBgRemovedBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;

        // Limite gratuito check
        if (window.limitGuard && !window.limitGuard.canPerformOperation()) {
          window.limitGuard.openPaywall();
          return;
        }

        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'snapflow_sem_fundo.png');
        
        if (window.limitGuard) window.limitGuard.recordOperation();
        Utils.showToast('PNG transparente baixado com sucesso!');
      });
    }
  }

  async loadFile(file) {
    try {
      this.originalImage = await Utils.fileToImage(file);
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      // Auto-detect dominant background color from the 4 corners & edges
      this.targetColor = this.detectBackgroundColor(this.originalImage);
      this.updateColorUi();

      this.render();
      Utils.showToast('Fundo auto-detectado com sucesso! Ajuste a tolerância se necessário.');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar a imagem.', 'error');
    }
  }

  detectBackgroundColor(img) {
    const tempCanvas = document.createElement('canvas');
    const w = Math.min(img.naturalWidth, 200);
    const h = Math.min(img.naturalHeight, 200);
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0, w, h);

    const imgData = tempCtx.getImageData(0, 0, w, h).data;
    
    // Sample 8 perimeter points: 4 corners + 4 border midpoints
    const sampleCoords = [
      [2, 2],
      [w - 3, 2],
      [2, h - 3],
      [w - 3, h - 3],
      [Math.floor(w / 2), 2],
      [Math.floor(w / 2), h - 3],
      [2, Math.floor(h / 2)],
      [w - 3, Math.floor(h / 2)]
    ];

    let rSum = 0, gSum = 0, bSum = 0;
    for (const [x, y] of sampleCoords) {
      const idx = (y * w + x) * 4;
      rSum += imgData[idx];
      gSum += imgData[idx + 1];
      bSum += imgData[idx + 2];
    }

    const count = sampleCoords.length;
    return {
      r: Math.round(rSum / count),
      g: Math.round(gSum / count),
      b: Math.round(bSum / count)
    };
  }

  updateColorUi() {
    const { r, g, b } = this.targetColor;
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    if (this.colorPreview) this.colorPreview.style.background = hex;
    if (this.colorHex) this.colorHex.textContent = hex;
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
    const maxDist = 441.67; // sqrt(255^2 + 255^2 + 255^2)
    const tolDistance = (this.tolerance / 100) * maxDist;
    const featherDist = (this.feather / 10) * 40;

    if (this.preserveInterior) {
      // Flood Fill Algorithm from image boundaries
      const visited = new Uint8Array(w * h);
      const queue = [];

      // Seed all perimeter pixels (top, bottom, left, right)
      for (let x = 0; x < w; x++) {
        queue.push(x, 0);
        queue.push(x, h - 1);
        visited[0 * w + x] = 1;
        visited[(h - 1) * w + x] = 1;
      }
      for (let y = 0; y < h; y++) {
        queue.push(0, y);
        queue.push(w - 1, y);
        visited[y * w + 0] = 1;
        visited[y * w + (w - 1)] = 1;
      }

      let qIdx = 0;
      while (qIdx < queue.length) {
        const cx = queue[qIdx++];
        const cy = queue[qIdx++];
        const pIdx = (cy * w + cx) * 4;

        const r = data[pIdx];
        const g = data[pIdx + 1];
        const b = data[pIdx + 2];

        const diff = Math.sqrt(
          (r - target.r) ** 2 +
          (g - target.g) ** 2 +
          (b - target.b) ** 2
        );

        if (diff <= tolDistance) {
          // Erase background pixel with smooth feathering
          if (diff <= tolDistance - featherDist) {
            data[pIdx + 3] = 0; // Fully transparent
          } else {
            const alphaFactor = (diff - (tolDistance - featherDist)) / (featherDist || 1);
            data[pIdx + 3] = Math.round(alphaFactor * 255);
          }

          // Expand 4-connected neighbors
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1]
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              const nIdx = ny * w + nx;
              if (!visited[nIdx]) {
                visited[nIdx] = 1;
                queue.push(nx, ny);
              }
            }
          }
        }
      }
    } else {
      // Global Chroma Key mode
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const diff = Math.sqrt(
          (r - target.r) ** 2 +
          (g - target.g) ** 2 +
          (b - target.b) ** 2
        );

        if (diff < tolDistance) {
          if (diff <= tolDistance - featherDist) {
            data[i + 3] = 0;
          } else {
            const alphaFactor = (diff - (tolDistance - featherDist)) / (featherDist || 1);
            data[i + 3] = Math.round(alphaFactor * 255);
          }
        }
      }
    }

    this.ctx.putImageData(imgData, 0, 0);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.bgRemoverApp = new BgRemoverModule();
});
