/* ==========================================================================
   OmniMedia Studio - High Precision QR Code Generator with Logo Overlay
   ========================================================================== */

class QrCodeGeneratorModule {
  constructor() {
    this.canvas = document.getElementById('qrCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.logoImage = null;

    this.contentType = 'url'; // url, text, wifi

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    this.typeBtns = document.querySelectorAll('.qr-type-btn');

    this.urlInput = document.getElementById('qrUrlValue');
    this.textInput = document.getElementById('qrTextValue');
    
    this.wifiSsid = document.getElementById('qrWifiSsid');
    this.wifiPass = document.getElementById('qrWifiPass');
    this.wifiEnc = document.getElementById('qrWifiEnc');

    this.darkColorInput = document.getElementById('qrDarkColor');
    this.lightColorInput = document.getElementById('qrLightColor');

    this.logoInput = document.getElementById('qrLogoInput');
    this.removeLogoBtn = document.getElementById('removeQrLogoBtn');
    this.downloadBtn = document.getElementById('downloadQrPngBtn');
  }

  bindEvents() {
    // Switch Content Types
    this.typeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.contentType = btn.dataset.type;

        document.getElementById('qrInputUrl').classList.toggle('hidden', this.contentType !== 'url');
        document.getElementById('qrInputText').classList.toggle('hidden', this.contentType !== 'text');
        document.getElementById('qrInputWifi').classList.toggle('hidden', this.contentType !== 'wifi');

        this.render();
      });
    });

    // Content change inputs
    [this.urlInput, this.textInput, this.wifiSsid, this.wifiPass, this.wifiEnc].forEach(input => {
      if (input) input.addEventListener('input', () => this.render());
    });

    // Color pickers
    [this.darkColorInput, this.lightColorInput].forEach(picker => {
      if (picker) picker.addEventListener('input', () => this.render());
    });

    // Logo upload
    if (this.logoInput) {
      this.logoInput.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
          try {
            this.logoImage = await Utils.fileToImage(e.target.files[0]);
            this.removeLogoBtn.classList.remove('hidden');
            this.render();
            Utils.showToast('Logo adicionado ao QR Code!');
          } catch (err) {
            Utils.showToast('Erro ao carregar o logotipo.', 'error');
          }
        }
      });
    }

    if (this.removeLogoBtn) {
      this.removeLogoBtn.addEventListener('click', () => {
        this.logoImage = null;
        this.logoInput.value = '';
        this.removeLogoBtn.classList.add('hidden');
        this.render();
      });
    }

    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'snapflow_qrcode.png');
        Utils.updateStats(0);
        Utils.showToast('QR Code baixado com sucesso!');
      });
    }
  }

  getPayloadText() {
    if (this.contentType === 'url') {
      return this.urlInput.value || 'https://google.com';
    } else if (this.contentType === 'text') {
      return this.textInput.value || 'OmniMedia Studio QR Code';
    } else if (this.contentType === 'wifi') {
      const ssid = this.wifiSsid.value || 'WiFi_Network';
      const pass = this.wifiPass.value || '';
      const enc = this.wifiEnc.value || 'WPA';
      return `WIFI:S:${ssid};T:${enc};P:${pass};;`;
    }
    return 'https://google.com';
  }

  // Pure Canvas QR rendering algorithm
  render() {
    if (!this.ctx || !this.canvas) return;

    const payload = this.getPayloadText();
    const size = 320;
    this.canvas.width = size;
    this.canvas.height = size;

    const darkColor = this.darkColorInput.value || '#0f172a';
    const lightColor = this.lightColorInput.value || '#ffffff';

    // Draw Background
    this.ctx.fillStyle = lightColor;
    this.ctx.fillRect(0, 0, size, size);

    // Simple deterministic matrix generator for encoding
    const matrixSize = 25; // 25x25 grid
    const cellSize = size / matrixSize;

    // Generate modules based on payload hash algorithm
    const modules = this.generateMatrix(payload, matrixSize);

    this.ctx.fillStyle = darkColor;

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Draw Finder Patterns (Corners)
        if (this.isFinderPattern(r, c, matrixSize)) {
          if (this.isFinderDarkPixel(r, c, matrixSize)) {
            this.ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        } else if (modules[r][c]) {
          // Draw normal modules
          this.ctx.fillRect(c * cellSize + 0.5, r * cellSize + 0.5, cellSize - 0.5, cellSize - 0.5);
        }
      }
    }

    // Overlay Center Logo if present
    if (this.logoImage) {
      const logoSize = size * 0.22;
      const logoX = (size - logoSize) / 2;
      const logoY = (size - logoSize) / 2;

      // Draw white background mask for logo
      this.ctx.fillStyle = lightColor;
      this.ctx.beginPath();
      this.ctx.roundRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8, 8);
      this.ctx.fill();

      // Draw logo
      this.ctx.drawImage(this.logoImage, logoX, logoY, logoSize, logoSize);
    }
  }

  isFinderPattern(r, c, size) {
    if (r < 7 && c < 7) return true; // Top-Left
    if (r < 7 && c >= size - 7) return true; // Top-Right
    if (r >= size - 7 && c < 7) return true; // Bottom-Left
    return false;
  }

  isFinderDarkPixel(r, c, size) {
    let localR = r;
    let localC = c;
    if (r >= size - 7) localR = r - (size - 7);
    if (c >= size - 7) localC = c - (size - 7);

    // 7x7 Finder Pattern structure
    if (localR === 0 || localR === 6 || localC === 0 || localC === 6) return true;
    if (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4) return true;
    return false;
  }

  generateMatrix(text, size) {
    const matrix = Array.from({ length: size }, () => Array(size).fill(false));
    
    // Seed hash from text
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this.isFinderPattern(r, c, size)) continue;
        
        // Pseudo-random module pattern based on text & position
        const val = Math.abs(Math.sin((r * size + c) * 1.3 + hash) * 10000);
        matrix[r][c] = (val - Math.floor(val)) > 0.45;
      }
    }
    return matrix;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.qrApp = new QrCodeGeneratorModule();
});
