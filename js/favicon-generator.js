/* ==========================================================================
   DesignExpress - Favicon & App Icon Generator Module
   ========================================================================== */

class FaviconGeneratorModule {
  constructor() {
    this.sourceImg = null;
    this.sizes = [
      { size: 16, label: '16x16 (Favicon Padrão)', key: 'favicon16' },
      { size: 32, label: '32x32 (Favicon Navegador)', key: 'favicon32' },
      { size: 180, label: '180x180 (Apple Touch Icon)', key: 'apple180' },
      { size: 192, label: '192x192 (Android / PWA)', key: 'android192' },
      { size: 512, label: '512x512 (PWA High-Res)', key: 'pwa512' }
    ];

    this.canvases = {};
    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('faviconDropZone');
    this.fileInput = document.getElementById('faviconFileInput');
    this.workspace = document.getElementById('faviconWorkspace');
    this.previewGrid = document.getElementById('faviconPreviewGrid');

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
  }

  async processFile(file) {
    try {
      this.sourceImg = await Utils.fileToImage(file);
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.generateIcons();
      Utils.showToast('Favicons e Ícones gerados com sucesso!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao processar imagem para favicons.', 'error');
    }
  }

  generateIcons() {
    if (!this.sourceImg || !this.previewGrid) return;

    this.previewGrid.innerHTML = '';
    this.canvases = {};

    this.sizes.forEach(item => {
      const canvas = document.createElement('canvas');
      canvas.width = item.size;
      canvas.height = item.size;

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(this.sourceImg, 0, 0, item.size, item.size);

      this.canvases[item.key] = canvas;

      // Card for preview grid
      const card = document.createElement('div');
      card.className = 'favicon-preview-card';

      const previewBox = document.createElement('div');
      previewBox.className = 'favicon-box';

      const displayImg = document.createElement('img');
      displayImg.src = canvas.toDataURL('image/png');
      displayImg.style.width = Math.min(item.size, 64) + 'px';
      displayImg.style.height = Math.min(item.size, 64) + 'px';

      previewBox.appendChild(displayImg);

      const infoBox = document.createElement('div');
      infoBox.className = 'favicon-info';
      infoBox.innerHTML = `<strong>${item.label}</strong><span>.PNG</span>`;

      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'btn btn-secondary btn-sm';
      downloadBtn.innerHTML = `<i data-lucide="download"></i> ${item.size}x${item.size}`;
      downloadBtn.addEventListener('click', () => {
        const url = canvas.toDataURL('image/png');
        Utils.downloadDataUrl(url, `supaedit_icon_${item.size}x${item.size}.png`);
        Utils.showToast(`Ícone ${item.size}x${item.size} baixado!`);
      });

      card.appendChild(previewBox);
      card.appendChild(infoBox);
      card.appendChild(downloadBtn);

      this.previewGrid.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.faviconApp = new FaviconGeneratorModule();
});
