/* ==========================================================================
   SupaEdit - SVG Vector Editor & HD PNG Converter Module
   ========================================================================== */

class SvgStudioModule {
  constructor() {
    this.svgCode = '';
    this.scale = 4; // 2x, 4x, 8x HD

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('svgDropZone');
    this.fileInput = document.getElementById('svgFileInput');
    this.workspace = document.getElementById('svgWorkspace');
    this.previewContainer = document.getElementById('svgPreviewArea');
    this.codeInput = document.getElementById('svgCodeArea');

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

    const fillColor = document.getElementById('svgFillColor');
    if (fillColor) {
      fillColor.addEventListener('input', () => {
        this.svgCode = this.svgCode.replace(/fill="[^"]*"/g, `fill="${fillColor.value}"`);
        this.render();
      });
    }

    const downloadPngBtn = document.getElementById('downloadSvgPngBtn');
    if (downloadPngBtn) {
      downloadPngBtn.addEventListener('click', () => this.exportPng());
    }
  }

  async loadFile(file) {
    try {
      this.svgCode = await file.text();
      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.render();
      Utils.showToast('Vetor SVG carregado para edição e exportação HD!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao carregar o arquivo SVG.', 'error');
    }
  }

  render() {
    if (!this.previewContainer || !this.svgCode) return;
    this.previewContainer.innerHTML = this.svgCode;
    if (this.codeInput) this.codeInput.value = this.svgCode;
  }

  exportPng() {
    if (!this.svgCode) return;

    const blob = new Blob([this.svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = (img.width || 300) * this.scale;
      canvas.height = (img.height || 300) * this.scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      Utils.downloadDataUrl(dataUrl, `supaedit_vector_${this.scale}x.png`);
      URL.revokeObjectURL(url);
      Utils.showToast(`Vetor exportado em PNG ${this.scale}x HD!`);
    };

    img.src = url;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.svgApp = new SvgStudioModule();
});
