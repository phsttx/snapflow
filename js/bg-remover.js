/* ==========================================================================
   SnapFlow - In-Browser AI Neural Background Remover & Precision Touch-up Studio
   Features: Real-time In-Browser AI Segmentation, Precision Eraser & Restore Brush
   ========================================================================== */

class BgRemoverModule {
  constructor() {
    this.originalFile = null;
    this.originalImage = null;
    this.maskCanvas = null;
    this.maskCtx = null;

    this.activeTool = 'ai'; // 'ai', 'eraser', 'restore'
    this.bgType = 'transparent'; // 'transparent', 'white', 'black', 'gradient'
    this.brushSize = 25;
    this.isDrawing = false;

    this.aiLib = null;
    this.isAiProcessing = false;

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('bgDropZone');
    this.fileInput = document.getElementById('bgFileInput');
    this.workspace = document.getElementById('bgWorkspace');
    this.canvas = document.getElementById('bgCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.loadingOverlay = document.getElementById('aiLoadingOverlay');
    this.progressBarFill = document.getElementById('aiProgressBarFill');
    this.progressText = document.getElementById('aiProgressPercentageText');
    this.statusText = document.getElementById('aiProgressStatusText');

    this.toolAiBtn = document.getElementById('bgToolAiBtn');
    this.toolEraserBtn = document.getElementById('bgToolEraserBtn');
    this.toolRestoreBtn = document.getElementById('bgToolRestoreBtn');
    this.brushControls = document.getElementById('bgBrushControls');
    this.brushSizeRange = document.getElementById('bgBrushSizeRange');
    this.reprocessBtn = document.getElementById('reprocessAiBtn');

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

    // Tool Switcher (AI, Eraser, Restore)
    if (this.toolAiBtn && this.toolEraserBtn && this.toolRestoreBtn) {
      this.toolAiBtn.addEventListener('click', () => this.setTool('ai'));
      this.toolEraserBtn.addEventListener('click', () => this.setTool('eraser'));
      this.toolRestoreBtn.addEventListener('click', () => this.setTool('restore'));
    }

    // Brush Size Slider
    if (this.brushSizeRange) {
      this.brushSizeRange.addEventListener('input', () => {
        this.brushSize = parseInt(this.brushSizeRange.value, 10);
        const label = document.getElementById('bgBrushSizeVal');
        if (label) label.textContent = `${this.brushSize}px`;
      });
    }

    // Background Replacement Presets
    document.querySelectorAll('.bg-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bg-preset-btn').forEach(b => b.classList.remove('active', 'btn-primary'));
        btn.classList.add('active');
        this.bgType = btn.dataset.bgType;
        this.render();
      });
    });

    // Reprocess AI Button
    if (this.reprocessBtn) {
      this.reprocessBtn.addEventListener('click', () => {
        this.processWithAi();
      });
    }

    // Canvas Interactive Brush Painting (Eraser / Restore)
    if (this.canvas) {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const xRatio = this.canvas.width / rect.width;
        const yRatio = this.canvas.height / rect.height;
        return {
          x: Math.floor((e.clientX - rect.left) * xRatio),
          y: Math.floor((e.clientY - rect.top) * yRatio)
        };
      };

      this.canvas.addEventListener('mousedown', (e) => {
        if (this.activeTool === 'ai') return;
        this.isDrawing = true;
        const pos = getPos(e);
        this.applyBrush(pos.x, pos.y);
      });

      window.addEventListener('mousemove', (e) => {
        if (!this.isDrawing || this.activeTool === 'ai') return;
        const pos = getPos(e);
        this.applyBrush(pos.x, pos.y);
      });

      window.addEventListener('mouseup', () => {
        this.isDrawing = false;
      });

      // Touch events for mobile
      this.canvas.addEventListener('touchstart', (e) => {
        if (this.activeTool === 'ai' || e.touches.length === 0) return;
        this.isDrawing = true;
        const touch = e.touches[0];
        const pos = getPos(touch);
        this.applyBrush(pos.x, pos.y);
        e.preventDefault();
      });

      this.canvas.addEventListener('touchmove', (e) => {
        if (!this.isDrawing || this.activeTool === 'ai' || e.touches.length === 0) return;
        const touch = e.touches[0];
        const pos = getPos(touch);
        this.applyBrush(pos.x, pos.y);
        e.preventDefault();
      });

      this.canvas.addEventListener('touchend', () => {
        this.isDrawing = false;
      });
    }

    // Download Button
    const downloadBtn = document.getElementById('downloadBgRemovedBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;

        if (window.limitGuard && !window.limitGuard.canPerformOperation()) {
          window.limitGuard.openPaywall();
          return;
        }

        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'snapflow_recorte_ia.png');

        if (window.limitGuard) window.limitGuard.recordOperation();
        Utils.showToast('Imagem recortada com IA baixada com sucesso! ✨');
      });
    }
  }

  setTool(tool) {
    this.activeTool = tool;

    [this.toolAiBtn, this.toolEraserBtn, this.toolRestoreBtn].forEach(b => {
      if (b) b.classList.remove('active', 'btn-primary');
      if (b) b.classList.add('btn-secondary');
    });

    if (tool === 'ai') {
      if (this.toolAiBtn) {
        this.toolAiBtn.classList.add('active', 'btn-primary');
        this.toolAiBtn.classList.remove('btn-secondary');
      }
      if (this.brushControls) this.brushControls.classList.add('hidden');
      if (this.canvas) this.canvas.style.cursor = 'default';
    } else {
      if (this.brushControls) this.brushControls.classList.remove('hidden');
      if (this.canvas) this.canvas.style.cursor = 'crosshair';

      if (tool === 'eraser' && this.toolEraserBtn) {
        this.toolEraserBtn.classList.add('active', 'btn-primary');
        this.toolEraserBtn.classList.remove('btn-secondary');
        Utils.showToast('Modo Borracha ativado: clique e arraste para apagar partes do fundo.');
      } else if (tool === 'restore' && this.toolRestoreBtn) {
        this.toolRestoreBtn.classList.add('active', 'btn-primary');
        this.toolRestoreBtn.classList.remove('btn-secondary');
        Utils.showToast('Modo Restaurar ativado: clique e arraste para trazer partes originais de volta.');
      }
    }
  }

  async loadFile(file) {
    try {
      this.originalFile = file;
      this.originalImage = await Utils.fileToImage(file);

      // Create internal alpha mask canvas
      this.maskCanvas = document.createElement('canvas');
      this.maskCanvas.width = this.originalImage.naturalWidth;
      this.maskCanvas.height = this.originalImage.naturalHeight;
      this.maskCtx = this.maskCanvas.getContext('2d');

      // Initialize mask to fully opaque white (255)
      this.maskCtx.fillStyle = '#ffffff';
      this.maskCtx.fillRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);

      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.setTool('ai');
      this.processWithAi();
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar imagem.', 'error');
    }
  }

  async processWithAi() {
    if (!this.originalFile || this.isAiProcessing) return;

    this.isAiProcessing = true;
    this.showLoading(true, 'Carregando IA Neural no seu navegador...', 15);

    try {
      if (!this.aiLib) {
        this.showLoading(true, 'Inicializando motor WebGPU...', 30);
        const module = await import('https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.8/dist/index.mjs');
        this.aiLib = module.default || module.removeBackground || module;
      }

      this.showLoading(true, 'IA Neural segmentando cabelo, pessoas e objetos...', 50);

      const config = {
        model: 'small',
        progress: (key, current, total) => {
          if (total > 0) {
            const pct = Math.min(95, Math.round((current / total) * 100));
            this.showLoading(true, `Executando IA (${key})...`, pct);
          }
        },
        output: {
          format: 'image/png'
        }
      };

      const resultBlob = await this.aiLib(this.originalFile, config);
      const aiCutoutImg = await Utils.fileToImage(resultBlob);

      // Draw cutout to mask
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.maskCanvas.width;
      tempCanvas.height = this.maskCanvas.height;
      const tCtx = tempCanvas.getContext('2d');
      tCtx.drawImage(aiCutoutImg, 0, 0, tempCanvas.width, tempCanvas.height);

      const imgData = tCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const maskData = this.maskCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

      for (let i = 0; i < imgData.data.length; i += 4) {
        const alpha = imgData.data[i + 3];
        maskData.data[i] = alpha;
        maskData.data[i + 1] = alpha;
        maskData.data[i + 2] = alpha;
        maskData.data[i + 3] = 255;
      }

      this.maskCtx.putImageData(maskData, 0, 0);

      this.showLoading(false);
      this.isAiProcessing = false;
      this.render();
      Utils.showToast('Recorte por IA concluído com perfeição! 🧠✨');
    } catch (err) {
      console.warn('AI In-browser segmentation fallback:', err);
      this.showLoading(false);
      this.isAiProcessing = false;
      Utils.showToast('Use a Borracha e o Pincel para retoque fino!');
      this.render();
    }
  }

  applyBrush(x, y) {
    if (!this.maskCtx || !this.maskCanvas) return;

    this.maskCtx.save();
    this.maskCtx.beginPath();
    this.maskCtx.arc(x, y, this.brushSize, 0, Math.PI * 2);

    if (this.activeTool === 'eraser') {
      // Erase: Set alpha mask to black (0)
      this.maskCtx.fillStyle = '#000000';
      this.maskCtx.fill();
    } else if (this.activeTool === 'restore') {
      // Restore: Set alpha mask to white (255)
      this.maskCtx.fillStyle = '#ffffff';
      this.maskCtx.fill();
    }

    this.maskCtx.restore();
    this.render();
  }

  render() {
    if (!this.canvas || !this.ctx || !this.originalImage || !this.maskCanvas) return;

    const w = this.originalImage.naturalWidth;
    const h = this.originalImage.naturalHeight;

    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx.clearRect(0, 0, w, h);

    // 1. Draw Background Replacement (White, Black, Gradient)
    if (this.bgType === 'white') {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, w, h);
    } else if (this.bgType === 'black') {
      this.ctx.fillStyle = '#09090b';
      this.ctx.fillRect(0, 0, w, h);
    } else if (this.bgType === 'gradient') {
      const grad = this.ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#38bdf8');
      grad.addColorStop(0.5, '#818cf8');
      grad.addColorStop(1, '#c084fc');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, w, h);
    }

    // 2. Render Cutout using Alpha Mask
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tCtx = tempCanvas.getContext('2d');

    // Draw original image
    tCtx.drawImage(this.originalImage, 0, 0);

    // Apply alpha mask via destination-in
    const maskImgData = this.maskCtx.getImageData(0, 0, w, h);
    const origImgData = tCtx.getImageData(0, 0, w, h);

    for (let i = 0; i < origImgData.data.length; i += 4) {
      const maskVal = maskImgData.data[i]; // 0 to 255
      origImgData.data[i + 3] = maskVal;
    }

    tCtx.putImageData(origImgData, 0, 0);

    // Draw final cutout on main canvas
    this.ctx.drawImage(tempCanvas, 0, 0);
  }

  showLoading(show, status = '', pct = 0) {
    if (!this.loadingOverlay) return;
    if (show) {
      this.loadingOverlay.classList.remove('hidden');
      if (this.statusText) this.statusText.textContent = status;
      if (this.progressBarFill) this.progressBarFill.style.width = `${pct}%`;
      if (this.progressText) this.progressText.textContent = `${pct}% concluído`;
    } else {
      this.loadingOverlay.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.bgRemoverApp = new BgRemoverModule();
});
