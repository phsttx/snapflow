/* ==========================================================================
   SupaEdit - High-End Device & Presentation Mockup Studio Engine
   ========================================================================== */

class MockupStudioModule {
  constructor() {
    this.originalImage = null;
    this.frameType = 'safari'; // safari, iphone, macbook, twitter
    this.bgPreset = 'dark';    // dark, sunset, aurora, neon, transparent
    this.padding = 50;
    this.shadowDepth = 25;

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('mockupDropZone');
    this.fileInput = document.getElementById('mockupFileInput');
    this.workspace = document.getElementById('mockupWorkspace');
    this.canvas = document.getElementById('mockupCanvas');
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

    // Frame type buttons
    document.querySelectorAll('.mockup-frame-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mockup-frame-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.frameType = btn.dataset.frame;
        this.render();
      });
    });

    // Background preset buttons
    document.querySelectorAll('.mockup-bg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mockup-bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.bgPreset = btn.dataset.bg;
        this.render();
      });
    });

    // Padding slider
    const padSlider = document.getElementById('mockupPaddingRange');
    if (padSlider) {
      padSlider.addEventListener('input', (e) => {
        this.padding = parseInt(e.target.value, 10);
        document.getElementById('mockupPaddingVal').textContent = `${this.padding}px`;
        this.render();
      });
    }

    const downloadBtn = document.getElementById('downloadMockupBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, `snapflow_mockup_${this.frameType}.png`);
        Utils.showToast('Mockup de apresentação HD baixado em PNG!');
      });
    }
  }

  async loadFile(file) {
    try {
      this.originalImage = await Utils.fileToImage(file);
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.render();
      Utils.showToast('Screenshot carregado no Estúdio de Mockups!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar a imagem.', 'error');
    }
  }

  render() {
    if (!this.originalImage || !this.ctx || !this.canvas) return;

    const img = this.originalImage;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const p = this.padding;

    // Determine Frame dimensions
    let frameHeaderH = 0;
    let frameFooterH = 0;
    let frameW = imgW;

    if (this.frameType === 'safari') {
      frameHeaderH = 46;
    } else if (this.frameType === 'iphone') {
      frameHeaderH = 40;
      frameFooterH = 30;
      frameW = Math.min(imgW, 420); // standard phone width
    } else if (this.frameType === 'macbook') {
      frameHeaderH = 30;
      frameFooterH = 24;
    } else if (this.frameType === 'twitter') {
      frameHeaderH = 65;
      frameFooterH = 45;
    }

    const renderImgW = frameW;
    const renderImgH = (imgH / imgW) * frameW;

    const totalFrameH = renderImgH + frameHeaderH + frameFooterH;

    const canvasW = Math.round(frameW + p * 2);
    const canvasH = Math.round(totalFrameH + p * 2);

    this.canvas.width = canvasW;
    this.canvas.height = canvasH;

    // Clear Canvas
    this.ctx.clearRect(0, 0, canvasW, canvasH);

    // Render Background Preset Wallpaper
    if (this.bgPreset !== 'transparent') {
      const bgGrad = this.ctx.createLinearGradient(0, 0, canvasW, canvasH);
      if (this.bgPreset === 'sunset') {
        bgGrad.addColorStop(0, '#f43f5e');
        bgGrad.addColorStop(1, '#8b5cf6');
      } else if (this.bgPreset === 'aurora') {
        bgGrad.addColorStop(0, '#0284c7');
        bgGrad.addColorStop(1, '#22c55e');
      } else if (this.bgPreset === 'neon') {
        bgGrad.addColorStop(0, '#a855f7');
        bgGrad.addColorStop(1, '#ec4899');
      } else { // Dark matte default
        bgGrad.addColorStop(0, '#09090b');
        bgGrad.addColorStop(1, '#18181b');
      }
      this.ctx.fillStyle = bgGrad;
      this.ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // Set Drop Shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
    this.ctx.shadowBlur = this.shadowDepth;
    this.ctx.shadowOffsetY = 15;

    const fx = p;
    const fy = p;

    // Render specific Device Model Frame
    if (this.frameType === 'safari') {
      this.drawSafariFrame(fx, fy, frameW, totalFrameH, img, renderImgW, renderImgH, frameHeaderH);
    } else if (this.frameType === 'iphone') {
      this.drawIPhoneFrame(fx, fy, frameW, totalFrameH, img, renderImgW, renderImgH, frameHeaderH);
    } else if (this.frameType === 'macbook') {
      this.drawMacBookFrame(fx, fy, frameW, totalFrameH, img, renderImgW, renderImgH, frameHeaderH);
    } else if (this.frameType === 'twitter') {
      this.drawTwitterFrame(fx, fy, frameW, totalFrameH, img, renderImgW, renderImgH, frameHeaderH);
    }
  }

  /* 🌐 1. Safari Browser Window Model */
  drawSafariFrame(fx, fy, fw, fh, img, iw, ih, hh) {
    // Window Body
    this.ctx.fillStyle = '#18181b';
    this.ctx.beginPath();
    this.ctx.roundRect(fx, fy, fw, fh, 12);
    this.ctx.fill();

    // Reset shadow for inner elements
    this.ctx.shadowColor = 'transparent';

    // 3 Window Dots (Red, Yellow, Green)
    const dotY = fy + 23;
    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath(); this.ctx.arc(fx + 22, dotY, 6, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.beginPath(); this.ctx.arc(fx + 40, dotY, 6, 0, Math.PI * 2); this.ctx.fill();
    this.ctx.fillStyle = '#22c55e';
    this.ctx.beginPath(); this.ctx.arc(fx + 58, dotY, 6, 0, Math.PI * 2); this.ctx.fill();

    // URL Address Bar (Pill shape)
    const urlBarW = Math.min(320, fw - 160);
    const urlBarX = fx + (fw - urlBarW) / 2;
    this.ctx.fillStyle = '#09090b';
    this.ctx.beginPath();
    this.ctx.roundRect(urlBarX, fy + 12, urlBarW, 22, 11);
    this.ctx.fill();

    // URL Text
    this.ctx.fillStyle = '#a1a1aa';
    this.ctx.font = '11px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🔒 https://supaedit.app', urlBarX + urlBarW / 2, fy + 27);

    // Screenshot Content
    this.ctx.drawImage(img, fx, fy + hh, iw, ih);
  }

  /* 📱 2. iPhone 15 Pro Model */
  drawIPhoneFrame(fx, fy, fw, fh, img, iw, ih, hh) {
    // Outer Metallic Phone Chassis
    this.ctx.fillStyle = '#18181b';
    this.ctx.beginPath();
    this.ctx.roundRect(fx, fy, fw, fh, 36);
    this.ctx.fill();

    this.ctx.shadowColor = 'transparent';

    // Screenshot Content clipped with screen radius
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.roundRect(fx + 6, fy + 6, fw - 12, fh - 12, 30);
    this.ctx.clip();
    this.ctx.drawImage(img, fx + 6, fy + hh, iw - 12, ih);
    this.ctx.restore();

    // Dynamic Island Notch
    const notchW = 100;
    const notchX = fx + (fw - notchW) / 2;
    this.ctx.fillStyle = '#09090b';
    this.ctx.beginPath();
    this.ctx.roundRect(notchX, fy + 12, notchW, 22, 11);
    this.ctx.fill();
  }

  /* 💻 3. MacBook Pro Laptop Model */
  drawMacBookFrame(fx, fy, fw, fh, img, iw, ih, hh) {
    // Laptop Screen Bezel
    this.ctx.fillStyle = '#09090b';
    this.ctx.beginPath();
    this.ctx.roundRect(fx, fy, fw, fh - 16, 12);
    this.ctx.fill();

    this.ctx.shadowColor = 'transparent';

    // Top Webcam Dot
    this.ctx.fillStyle = '#27272a';
    this.ctx.beginPath();
    this.ctx.arc(fx + fw / 2, fy + 12, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Screenshot Content
    this.ctx.drawImage(img, fx + 8, fy + hh, iw - 16, ih);

    // Laptop Lip & Hinge at bottom
    this.ctx.fillStyle = '#27272a';
    this.ctx.beginPath();
    this.ctx.roundRect(fx - 15, fy + fh - 16, fw + 30, 16, [0, 0, 8, 8]);
    this.ctx.fill();
  }

  /* 🐤 4. Twitter / X Post Card Model */
  drawTwitterFrame(fx, fy, fw, fh, img, iw, ih, hh) {
    // Card Background
    this.ctx.fillStyle = '#121215';
    this.ctx.beginPath();
    this.ctx.roundRect(fx, fy, fw, fh, 16);
    this.ctx.fill();

    this.ctx.shadowColor = 'transparent';

    // Avatar Circle
    this.ctx.fillStyle = '#38bdf8';
    this.ctx.beginPath();
    this.ctx.arc(fx + 30, fy + 32, 18, 0, Math.PI * 2);
    this.ctx.fill();

    // Username & Verified Badge
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 13px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('SupaEdit Studio', fx + 58, fy + 28);

    this.ctx.fillStyle = '#a1a1aa';
    this.ctx.font = '12px sans-serif';
    this.ctx.fillText('@supaedit · 1min', fx + 58, fy + 44);

    // Screenshot Content
    this.ctx.drawImage(img, fx + 12, fy + hh, iw - 24, ih);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.mockupApp = new MockupStudioModule();
});
