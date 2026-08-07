/* ==========================================================================
   OmniMedia Studio - Image Cropper, Filters & Editor
   ========================================================================== */

class ImageCropperModule {
  constructor() {
    this.originalImage = null;
    this.rotation = 0;
    this.flipH = false;
    this.aspectRatio = null; // null for free

    this.filters = {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      sepia: 0
    };

    // Crop box coordinates (relative to displayed canvas)
    this.crop = { x: 0, y: 0, w: 0, h: 0 };
    this.isDraggingBox = false;
    this.isResizingHandle = null;
    this.dragStart = { x: 0, y: 0 };

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.dropZone = document.getElementById('cropperDropZone');
    this.fileInput = document.getElementById('cropperFileInput');
    this.workspace = document.getElementById('cropperWorkspace');

    this.canvas = document.getElementById('cropCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    
    this.cropOverlay = document.getElementById('cropOverlay');
    this.cropBox = document.getElementById('cropBox');

    // Controls
    this.rotateLeftBtn = document.getElementById('rotateLeftBtn');
    this.rotateRightBtn = document.getElementById('rotateRightBtn');
    this.flipHBtn = document.getElementById('flipHBtn');

    this.brightnessSlider = document.getElementById('sliderBrightness');
    this.contrastSlider = document.getElementById('sliderContrast');
    this.saturateSlider = document.getElementById('sliderSaturate');
    this.blurSlider = document.getElementById('sliderBlur');
    this.sepiaSlider = document.getElementById('sliderSepia');

    this.downloadBtn = document.getElementById('downloadCroppedBtn');
    this.resetBtn = document.getElementById('resetCropBtn');

    this.presetBtns = document.querySelectorAll('.preset-btn');
  }

  bindEvents() {
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

    // Preset Aspect Ratios
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const aspectStr = btn.dataset.aspect;
        if (aspectStr === 'free') {
          this.aspectRatio = null;
        } else {
          const parts = aspectStr.split(':').map(Number);
          this.aspectRatio = parts[0] / parts[1];
        }
        this.resetCropBox();
      });
    });

    // Rotation & Flip
    this.rotateLeftBtn.addEventListener('click', () => {
      this.rotation = (this.rotation - 90) % 360;
      this.render();
      this.resetCropBox();
    });

    this.rotateRightBtn.addEventListener('click', () => {
      this.rotation = (this.rotation + 90) % 360;
      this.render();
      this.resetCropBox();
    });

    this.flipHBtn.addEventListener('click', () => {
      this.flipH = !this.flipH;
      this.render();
    });

    // Filters
    const bindFilter = (slider, key, unit = '%') => {
      if (!slider) return;
      slider.addEventListener('input', () => {
        this.filters[key] = parseInt(slider.value, 10);
        document.getElementById(`val${key.charAt(0).toUpperCase() + key.slice(1)}`).textContent = `${slider.value}${unit}`;
        this.render();
      });
    };

    bindFilter(this.brightnessSlider, 'brightness');
    bindFilter(this.contrastSlider, 'contrast');
    bindFilter(this.saturateSlider, 'saturate');
    bindFilter(this.blurSlider, 'blur', 'px');
    bindFilter(this.sepiaSlider, 'sepia');

    this.downloadBtn.addEventListener('click', () => this.exportCroppedImage());
    this.resetBtn.addEventListener('click', () => this.resetFilters());

    // Crop box mouse events
    this.initCropBoxInteractions();
  }

  async loadFile(file) {
    try {
      this.originalImage = await Utils.fileToImage(file);
      this.resetFilters();

      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.render();
      this.resetCropBox();
      Utils.showToast('Imagem pronta para edição!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar imagem para o editor.', 'error');
    }
  }

  render() {
    if (!this.originalImage || !this.ctx) return;

    const img = this.originalImage;
    const isRotated90 = Math.abs(this.rotation % 180) === 90;
    
    const srcW = isRotated90 ? img.naturalHeight : img.naturalWidth;
    const srcH = isRotated90 ? img.naturalWidth : img.naturalHeight;

    const maxCanvasW = 600;
    const maxCanvasH = 460;

    let scale = Math.min(maxCanvasW / srcW, maxCanvasH / srcH, 1);
    const canvasW = Math.round(srcW * scale);
    const canvasH = Math.round(srcH * scale);

    this.canvas.width = canvasW;
    this.canvas.height = canvasH;

    this.ctx.save();
    this.ctx.clearRect(0, 0, canvasW, canvasH);

    // Apply Filter String
    this.ctx.filter = `brightness(${this.filters.brightness}%) contrast(${this.filters.contrast}%) saturate(${this.filters.saturate}%) blur(${this.filters.blur}px) sepia(${this.filters.sepia}%)`;

    // Apply Transforms
    this.ctx.translate(canvasW / 2, canvasH / 2);
    this.ctx.rotate((this.rotation * Math.PI) / 180);
    this.ctx.scale(this.flipH ? -1 : 1, 1);

    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;

    this.ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    this.ctx.restore();
  }

  resetCropBox() {
    if (!this.canvas) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    let w = cw * 0.8;
    let h = ch * 0.8;

    if (this.aspectRatio) {
      if (w / h > this.aspectRatio) {
        w = h * this.aspectRatio;
      } else {
        h = w / this.aspectRatio;
      }
    }

    this.crop = {
      x: (cw - w) / 2,
      y: (ch - h) / 2,
      w: w,
      h: h
    };

    this.updateCropBoxDOM();
  }

  updateCropBoxDOM() {
    if (!this.cropBox) return;
    this.cropBox.style.left = `${this.crop.x}px`;
    this.cropBox.style.top = `${this.crop.y}px`;
    this.cropBox.style.width = `${this.crop.w}px`;
    this.cropBox.style.height = `${this.crop.h}px`;
  }

  initCropBoxInteractions() {
    if (!this.cropBox || !this.cropOverlay) return;

    const onMouseDown = (e) => {
      if (e.target.classList.contains('crop-handle')) {
        this.isResizingHandle = e.target.classList[1]; // nw, ne, sw, se
      } else {
        this.isDraggingBox = true;
      }
      this.dragStart = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
    };

    const onMouseMove = (e) => {
      if (!this.isDraggingBox && !this.isResizingHandle) return;

      const dx = e.clientX - this.dragStart.x;
      const dy = e.clientY - this.dragStart.y;
      this.dragStart = { x: e.clientX, y: e.clientY };

      const cw = this.canvas.width;
      const ch = this.canvas.height;

      if (this.isDraggingBox) {
        this.crop.x = Math.max(0, Math.min(cw - this.crop.w, this.crop.x + dx));
        this.crop.y = Math.max(0, Math.min(ch - this.crop.h, this.crop.y + dy));
      } else if (this.isResizingHandle) {
        const handle = this.isResizingHandle;

        if (handle.includes('e')) this.crop.w = Math.min(cw - this.crop.x, Math.max(30, this.crop.w + dx));
        if (handle.includes('s')) this.crop.h = Math.min(ch - this.crop.y, Math.max(30, this.crop.h + dy));
        if (handle.includes('w')) {
          const newW = Math.max(30, this.crop.w - dx);
          this.crop.x += (this.crop.w - newW);
          this.crop.w = newW;
        }
        if (handle.includes('n')) {
          const newH = Math.max(30, this.crop.h - dy);
          this.crop.y += (this.crop.h - newH);
          this.crop.h = newH;
        }

        if (this.aspectRatio) {
          this.crop.h = this.crop.w / this.aspectRatio;
        }
      }

      this.updateCropBoxDOM();
    };

    const onMouseUp = () => {
      this.isDraggingBox = false;
      this.isResizingHandle = null;
    };

    this.cropBox.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  resetFilters() {
    this.rotation = 0;
    this.flipH = false;
    this.filters = { brightness: 100, contrast: 100, saturate: 100, blur: 0, sepia: 0 };

    if (this.brightnessSlider) this.brightnessSlider.value = 100;
    if (this.contrastSlider) this.contrastSlider.value = 100;
    if (this.saturateSlider) this.saturateSlider.value = 100;
    if (this.blurSlider) this.blurSlider.value = 0;
    if (this.sepiaSlider) this.sepiaSlider.value = 0;

    ['Brightness', 'Contrast', 'Saturate'].forEach(k => {
      const el = document.getElementById(`val${k}`);
      if (el) el.textContent = '100%';
    });
    if (document.getElementById('valBlur')) document.getElementById('valBlur').textContent = '0px';
    if (document.getElementById('valSepia')) document.getElementById('valSepia').textContent = '0%';

    this.render();
    this.resetCropBox();
  }

  exportCroppedImage() {
    if (!this.canvas) return;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = this.crop.w;
    outCanvas.height = this.crop.h;

    const outCtx = outCanvas.getContext('2d');
    outCtx.drawImage(
      this.canvas,
      this.crop.x, this.crop.y, this.crop.w, this.crop.h,
      0, 0, this.crop.w, this.crop.h
    );

    const dataUrl = outCanvas.toDataURL('image/png');
    Utils.downloadDataUrl(dataUrl, 'snapflow_cropped_image.png');
    Utils.updateStats(0);
    Utils.showToast('Imagem editada baixada com sucesso!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cropperApp = new ImageCropperModule();
});
