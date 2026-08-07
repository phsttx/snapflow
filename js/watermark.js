/* ==========================================================================
   DesignExpress - Image Watermark & Logo Overlay Module
   ========================================================================== */

class WatermarkModule {
  constructor() {
    this.baseImage = null;
    this.logoImage = null;
    this.watermarkType = 'text'; // 'text' or 'image'
    this.position = 'center'; // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'tile'
    
    this.opacity = 50;
    this.scale = 100;
    this.textValue = '© SnapFlow';
    this.textColor = '#ffffff';

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('watermarkDropZone');
    this.fileInput = document.getElementById('watermarkFileInput');
    this.workspace = document.getElementById('watermarkWorkspace');
    this.canvas = document.getElementById('watermarkCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    if (!this.dropZone || !this.fileInput) return;

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.loadBaseImage(e.target.files[0]);
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) this.loadBaseImage(e.dataTransfer.files[0]);
    });

    // Control Binds
    const bindInput = (id, callback) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', callback);
    };

    bindInput('wmTextValue', (e) => {
      this.textValue = e.target.value || '© DesignExpress';
      this.render();
    });

    bindInput('wmOpacityRange', (e) => {
      this.opacity = parseInt(e.target.value, 10);
      document.getElementById('wmOpacityVal').textContent = `${this.opacity}%`;
      this.render();
    });

    bindInput('wmScaleRange', (e) => {
      this.scale = parseInt(e.target.value, 10);
      document.getElementById('wmScaleVal').textContent = `${this.scale}%`;
      this.render();
    });

    bindInput('wmTextColor', (e) => {
      this.textColor = e.target.value;
      this.render();
    });

    // Logo upload for watermark
    const logoInput = document.getElementById('wmLogoInput');
    if (logoInput) {
      logoInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
          try {
            this.logoImage = await Utils.fileToImage(e.target.files[0]);
            this.watermarkType = 'image';
            document.getElementById('wmTypeToggleText').classList.remove('active');
            document.getElementById('wmTypeToggleImg').classList.add('active');
            this.render();
            Utils.showToast('Logo da marca d\'água adicionado!');
          } catch (err) {
            Utils.showToast('Erro ao carregar o logo da marca d\'água.', 'error');
          }
        }
      });
    }

    // Watermark Type Buttons
    const btnText = document.getElementById('wmTypeToggleText');
    const btnImg = document.getElementById('wmTypeToggleImg');
    if (btnText && btnImg) {
      btnText.addEventListener('click', () => {
        this.watermarkType = 'text';
        btnText.classList.add('active');
        btnImg.classList.remove('active');
        document.getElementById('wmTextControls').classList.remove('hidden');
        document.getElementById('wmImgControls').classList.add('hidden');
        this.render();
      });

      btnImg.addEventListener('click', () => {
        this.watermarkType = 'image';
        btnImg.classList.add('active');
        btnText.classList.remove('active');
        document.getElementById('wmImgControls').classList.remove('hidden');
        document.getElementById('wmTextControls').classList.add('hidden');
        this.render();
      });
    }

    // Position Buttons
    document.querySelectorAll('.wm-pos-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.wm-pos-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.position = btn.dataset.pos;
        this.render();
      });
    });

    // Download Button
    const downloadBtn = document.getElementById('downloadWatermarkedBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'snapflow_watermarked.png');
        Utils.showToast('Imagem com marca d\'água baixada!');
      });
    }
  }

  async loadBaseImage(file) {
    try {
      this.baseImage = await Utils.fileToImage(file);
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');
      this.render();
      Utils.showToast('Imagem pronta para marca d\'água!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar imagem base.', 'error');
    }
  }

  render() {
    if (!this.baseImage || !this.ctx || !this.canvas) return;

    const img = this.baseImage;
    this.canvas.width = img.naturalWidth;
    this.canvas.height = img.naturalHeight;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(img, 0, 0);

    const w = this.canvas.width;
    const h = this.canvas.height;
    const alpha = this.opacity / 100;

    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    if (this.watermarkType === 'text') {
      const fontSize = Math.max(16, Math.round((w * 0.04) * (this.scale / 100)));
      this.ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      this.ctx.fillStyle = this.textColor;
      this.ctx.textBaseline = 'middle';

      const metrics = this.ctx.measureText(this.textValue);
      const textW = metrics.width;
      const textH = fontSize;

      const pos = this.calculatePosition(w, h, textW, textH);

      if (this.position === 'tile') {
        for (let x = 40; x < w; x += textW + 80) {
          for (let y = 40; y < h; y += textH + 60) {
            this.ctx.fillText(this.textValue, x, y);
          }
        }
      } else {
        this.ctx.fillText(this.textValue, pos.x, pos.y);
      }
    } else if (this.watermarkType === 'image' && this.logoImage) {
      const logoW = (w * 0.2) * (this.scale / 100);
      const logoH = (this.logoImage.naturalHeight / this.logoImage.naturalWidth) * logoW;

      const pos = this.calculatePosition(w, h, logoW, logoH);

      if (this.position === 'tile') {
        for (let x = 30; x < w; x += logoW + 60) {
          for (let y = 30; y < h; y += logoH + 60) {
            this.ctx.drawImage(this.logoImage, x, y, logoW, logoH);
          }
        }
      } else {
        this.ctx.drawImage(this.logoImage, pos.x, pos.y, logoW, logoH);
      }
    }

    this.ctx.restore();
  }

  calculatePosition(w, h, objW, objH) {
    const margin = 30;
    switch (this.position) {
      case 'top-left': return { x: margin, y: margin + objH / 2 };
      case 'top-right': return { x: w - objW - margin, y: margin + objH / 2 };
      case 'bottom-left': return { x: margin, y: h - objH - margin };
      case 'bottom-right': return { x: w - objW - margin, y: h - objH - margin };
      case 'center':
      default: return { x: (w - objW) / 2, y: h / 2 };
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.watermarkApp = new WatermarkModule();
});
