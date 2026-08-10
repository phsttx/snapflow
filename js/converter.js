/* ==========================================================================
   SnapFlow - Universal Batch Image Converter & ZIP Generator
   Formats: PNG, JPG, WebP, AVIF, ICO, PDF (100% In-Browser Canvas API)
   ========================================================================== */

class ConverterModule {
  constructor() {
    this.files = [];
    this.convertedItems = [];
    this.targetFormat = 'image/webp';
    this.targetExtension = 'webp';
    this.quality = 0.9;
    this.scale = 1.0;

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('converterDropZone');
    this.fileInput = document.getElementById('converterFileInput');
    this.workspace = document.getElementById('converterWorkspace');
    this.itemsGrid = document.getElementById('converterItemsGrid');
    this.addMoreInput = document.getElementById('converterAddMoreInput');

    if (!this.dropZone || !this.fileInput) return;

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.handleFiles(Array.from(e.target.files));
    });

    if (this.addMoreInput) {
      this.addMoreInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) this.handleFiles(Array.from(e.target.files));
      });
    }

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) this.handleFiles(Array.from(e.dataTransfer.files));
    });

    // Format Selector Buttons
    document.querySelectorAll('.converter-format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.converter-format-btn').forEach(b => b.classList.remove('active', 'btn-primary'));
        document.querySelectorAll('.converter-format-btn').forEach(b => b.classList.add('btn-secondary'));
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-secondary');

        this.targetFormat = btn.dataset.mime || 'image/webp';
        this.targetExtension = btn.dataset.ext || 'webp';
        this.reprocessAll();
      });
    });

    // Quality Slider
    const qualitySlider = document.getElementById('converterQualityRange');
    if (qualitySlider) {
      qualitySlider.addEventListener('input', () => {
        const val = parseInt(qualitySlider.value, 10);
        this.quality = val / 100;
        const label = document.getElementById('converterQualityVal');
        if (label) label.textContent = `${val}%`;
        this.reprocessAll();
      });
    }

    // Scale Selector
    document.querySelectorAll('.converter-scale-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.converter-scale-btn').forEach(b => b.classList.remove('active', 'btn-primary'));
        document.querySelectorAll('.converter-scale-btn').forEach(b => b.classList.add('btn-secondary'));
        btn.classList.add('active', 'btn-primary');
        btn.classList.remove('btn-secondary');

        this.scale = parseFloat(btn.dataset.scale || '1');
        this.reprocessAll();
      });
    });

    // Download All as ZIP Button
    const downloadZipBtn = document.getElementById('converterDownloadZipBtn');
    if (downloadZipBtn) {
      downloadZipBtn.addEventListener('click', () => this.downloadAllZip());
    }

    // Clear All Button
    const clearBtn = document.getElementById('converterClearBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.files = [];
        this.convertedItems = [];
        this.workspace.classList.add('hidden');
        this.dropZone.classList.remove('hidden');
        this.fileInput.value = '';
        if (this.addMoreInput) this.addMoreInput.value = '';
      });
    }
  }

  async handleFiles(newFiles) {
    const validFiles = newFiles.filter(f => f.type.startsWith('image/') || f.name.match(/\.(png|jpg|jpeg|webp|avif|bmp|svg|gif)$/i));
    if (validFiles.length === 0) {
      Utils.showToast('Selecione arquivos de imagem válidos.', 'warning');
      return;
    }

    this.files = this.files.concat(validFiles);
    this.dropZone.classList.add('hidden');
    this.workspace.classList.remove('hidden');

    Utils.showToast(`Convertendo ${validFiles.length} imagens...`);
    await this.reprocessAll();
  }

  async reprocessAll() {
    if (this.files.length === 0) return;

    this.convertedItems = [];
    if (this.itemsGrid) this.itemsGrid.innerHTML = '';

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      try {
        const converted = await this.convertSingleFile(file);
        this.convertedItems.push(converted);
        this.renderItemCard(converted, i);
      } catch (err) {
        console.error(`Erro ao converter ${file.name}:`, err);
      }
    }

    this.updateStats();
  }

  async convertSingleFile(file) {
    const img = await Utils.fileToImage(file);
    const canvas = document.createElement('canvas');
    const origW = img.naturalWidth || img.width;
    const origH = img.naturalHeight || img.height;

    canvas.width = Math.max(1, Math.round(origW * this.scale));
    canvas.height = Math.max(1, Math.round(origH * this.scale));

    const ctx = canvas.getContext('2d');

    // Se for JPG e a imagem tiver transparência, preenche com fundo branco
    if (this.targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, this.targetFormat, this.quality);
    });

    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const newName = `${baseName}.${this.targetExtension}`;

    return {
      originalFile: file,
      convertedBlob: blob,
      newName: newName,
      previewUrl: URL.createObjectURL(blob),
      origSize: file.size,
      newSize: blob.size,
      width: canvas.width,
      height: canvas.height
    };
  }

  renderItemCard(item, index) {
    if (!this.itemsGrid) return;

    const sizeDiff = ((item.newSize - item.origSize) / item.origSize) * 100;
    const isSmaller = sizeDiff <= 0;
    const diffBadgeColor = isSmaller ? '#10b981' : '#f59e0b';
    const diffText = isSmaller ? `${Math.abs(Math.round(sizeDiff))}% menor` : `+${Math.round(sizeDiff)}%`;

    const card = document.createElement('div');
    card.className = 'glass-card converter-item-card';
    card.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.1rem; border-radius:12px; margin-bottom:0.6rem; gap:1rem; flex-wrap:wrap;';

    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.9rem; min-width:220px; flex:1;">
        <img src="${item.previewUrl}" style="width:46px; height:46px; object-fit:cover; border-radius:8px; border:1px solid var(--glass-border);" alt="Preview">
        <div>
          <div style="font-weight:600; font-size:0.88rem; color:var(--text-primary); max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${item.newName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">
            ${Utils.formatBytes(item.origSize)} ➔ <strong style="color:var(--text-primary);">${Utils.formatBytes(item.newSize)}</strong>
            <span style="background:rgba(255,255,255,0.05); color:${diffBadgeColor}; padding:1px 6px; border-radius:4px; margin-left:6px; font-weight:600;">${diffText}</span>
          </div>
        </div>
      </div>

      <div style="display:flex; align-items:center; gap:0.6rem;">
        <span style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">${item.width}x${item.height}</span>
        <button class="btn btn-secondary btn-sm converter-single-dl" data-idx="${index}" style="padding:0.45rem 0.75rem;">
          <i data-lucide="download"></i> Baixar
        </button>
      </div>
    `;

    const dlBtn = card.querySelector('.converter-single-dl');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        if (window.limitGuard && !window.limitGuard.canPerformOperation()) {
          window.limitGuard.openPaywall();
          return;
        }
        Utils.downloadBlob(item.convertedBlob, item.newName);
        if (window.limitGuard) window.limitGuard.recordOperation();
        Utils.showToast(`Baixado: ${item.newName}`);
      });
    }

    this.itemsGrid.appendChild(card);
    if (window.lucide) window.lucide.createIcons();
  }

  updateStats() {
    const countLabel = document.getElementById('converterCountVal');
    const totalOrigLabel = document.getElementById('converterTotalOrigVal');
    const totalNewLabel = document.getElementById('converterTotalNewVal');

    const totalOrig = this.convertedItems.reduce((sum, item) => sum + item.origSize, 0);
    const totalNew = this.convertedItems.reduce((sum, item) => sum + item.newSize, 0);

    if (countLabel) countLabel.textContent = `${this.convertedItems.length} arquivo(s)`;
    if (totalOrigLabel) totalOrigLabel.textContent = Utils.formatBytes(totalOrig);
    if (totalNewLabel) totalNewLabel.textContent = Utils.formatBytes(totalNew);
  }

  async downloadAllZip() {
    if (this.convertedItems.length === 0) return;

    if (window.limitGuard && !window.limitGuard.canPerformOperation()) {
      window.limitGuard.openPaywall();
      return;
    }

    if (!window.JSZip) {
      Utils.showToast('Biblioteca ZIP indisponível.', 'error');
      return;
    }

    Utils.showToast('Compactando imagens em arquivo ZIP...');
    const zip = new window.JSZip();

    this.convertedItems.forEach(item => {
      zip.file(item.newName, item.convertedBlob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    Utils.downloadBlob(zipBlob, `snapflow_convertidas_${this.targetExtension}.zip`);

    if (window.limitGuard) window.limitGuard.recordOperation();
    Utils.showToast('Pacote ZIP baixado com sucesso! 📦✨');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.converterApp = new ConverterModule();
});
