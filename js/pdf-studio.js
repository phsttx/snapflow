/* ==========================================================================
   SupaEdit - PDF Document Generator Studio
   ========================================================================== */

class PdfStudioModule {
  constructor() {
    this.images = [];
    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('pdfDropZone');
    this.fileInput = document.getElementById('pdfFileInput');
    this.workspace = document.getElementById('pdfWorkspace');
    this.listContainer = document.getElementById('pdfImageList');
    this.generateBtn = document.getElementById('generatePdfBtn');

    if (!this.dropZone || !this.fileInput) return;

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.loadFiles(Array.from(e.target.files));
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) this.loadFiles(Array.from(e.dataTransfer.files));
    });

    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.generatePdf());
    }
  }

  async loadFiles(files) {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (valid.length === 0) return;

    for (const file of valid) {
      try {
        const img = await Utils.fileToImage(file);
        this.images.push({ file, img });
      } catch (err) {
        console.error(err);
      }
    }

    this.dropZone.classList.add('hidden');
    this.workspace.classList.remove('hidden');

    this.renderList();
    Utils.showToast(`${valid.length} imagens adicionadas ao documento PDF!`);
  }

  renderList() {
    if (!this.listContainer) return;
    this.listContainer.innerHTML = '';

    this.images.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'pdf-image-row';
      row.innerHTML = `
        <img src="${item.img.src}" class="pdf-thumb">
        <div class="pdf-info">
          <strong>Página ${index + 1}: ${item.file.name}</strong>
          <span>${Utils.formatBytes(item.file.size)}</span>
        </div>
        <button class="btn btn-danger-outline btn-sm" onclick="window.pdfApp.removeImage(${index})">
          <i data-lucide="trash-2"></i> Remover
        </button>
      `;
      this.listContainer.appendChild(row);
    });

    if (window.lucide) lucide.createIcons();
  }

  removeImage(index) {
    this.images.splice(index, 1);
    if (this.images.length === 0) {
      this.workspace.classList.add('hidden');
      this.dropZone.classList.remove('hidden');
    } else {
      this.renderList();
    }
  }

  generatePdf() {
    if (this.images.length === 0) return;

    // Pure HTML5 Canvas & HTML print-to-pdf pipeline
    const printWin = window.open('', '_blank');
    if (!printWin) {
      Utils.showToast('Por favor, permita popups para gerar o PDF.', 'error');
      return;
    }

    let pagesHtml = '';
    this.images.forEach((item) => {
      pagesHtml += `
        <div class="pdf-page">
          <img src="${item.img.src}">
        </div>
      `;
    });

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SupaEdit Document</title>
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background: #fff; }
          .pdf-page { width: 210mm; height: 297mm; display: flex; align-items: center; justify-content: center; page-break-after: always; overflow: hidden; }
          .pdf-page img { max-width: 100%; max-height: 100%; object-fit: contain; }
        </style>
      </head>
      <body>
        ${pagesHtml}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);

    printWin.document.close();
    Utils.showToast('Documento PDF gerado com sucesso!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.pdfApp = new PdfStudioModule();
});
