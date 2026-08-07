/* ==========================================================================
   OmniMedia Studio - Image Compressor & Converter
   ========================================================================== */

class ImageCompressorModule {
  constructor() {
    this.originalFile = null;
    this.originalImage = null;
    this.compressedBlob = null;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.dropZone = document.getElementById('compressorDropZone');
    this.fileInput = document.getElementById('compressorFileInput');
    this.workspace = document.getElementById('compressorWorkspace');
    
    this.outputFormatSelect = document.getElementById('outputFormat');
    this.qualityRange = document.getElementById('qualityRange');
    this.qualityValue = document.getElementById('qualityValue');
    this.qualityControlGroup = document.getElementById('qualityControlGroup');

    this.origSizeLabel = document.getElementById('origSizeLabel');
    this.optSizeLabel = document.getElementById('optSizeLabel');
    this.savingLabel = document.getElementById('savingLabel');

    this.downloadBtn = document.getElementById('downloadCompressedBtn');
    this.resetBtn = document.getElementById('resetCompressorBtn');

    // Before / After Slider
    this.container = document.getElementById('comparisonContainer');
    this.imgBefore = document.getElementById('imgBefore');
    this.imgAfter = document.getElementById('imgAfter');
    this.afterWrapper = document.getElementById('afterWrapper');
    // Ensure clean initial state (Hide comparator until file upload)
    if (this.workspace) this.workspace.classList.add('hidden');
    if (this.dropZone) this.dropZone.classList.remove('hidden');
  }

  bindEvents() {
    if (!this.dropZone || !this.fileInput) return;

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      this.dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
      });
    });

    this.dropZone.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 1) {
        this.processBatchFiles(files);
      } else if (files.length === 1) {
        this.processFile(files[0]);
      } else {
        Utils.showToast('Por favor, selecione arquivos de imagem válidos.', 'error');
      }
    });

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 1) {
          this.processBatchFiles(Array.from(e.target.files));
        } else if (e.target.files.length === 1) {
          this.processFile(e.target.files[0]);
        }
      });
    }

    // Control listeners
    this.qualityRange.addEventListener('input', () => {
      this.qualityValue.textContent = `${this.qualityRange.value}%`;
      this.updateCompression();
    });

    this.outputFormatSelect.addEventListener('change', () => {
      const isPng = this.outputFormatSelect.value === 'image/png';
      this.qualityControlGroup.style.opacity = isPng ? '0.5' : '1';
      this.updateCompression();
    });

    this.downloadBtn.addEventListener('click', () => this.downloadResult());
    this.resetBtn.addEventListener('click', () => this.reset());

    // Before/After Slider Drag logic
    this.initSliderDrag();
  }

  async processBatchFiles(files) {
    Utils.showToast(`Processando lote de ${files.length} imagens...`);
    const zip = new window.SimpleZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const img = await Utils.fileToImage(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL(this.outputFormat, this.quality / 100);
        const base64 = dataUrl.split(',')[1];
        const binaryStr = atob(base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let j = 0; j < len; j++) bytes[j] = binaryStr.charCodeAt(j);

        const ext = this.outputFormat.split('/')[1];
        const fname = file.name.replace(/\.[^/.]+$/, '') + `_snapflow.${ext}`;
        zip.addFile(fname, bytes);
      } catch (err) {
        console.error(err);
      }
    }

    const zipBlob = zip.generateBlob();
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snapflow_batch_compressed.zip';
    a.click();
    URL.revokeObjectURL(url);
    Utils.showToast(`Lote de ${files.length} imagens compactado em ZIP baixado!`);
  }

  async processFile(file) {
    try {
      this.originalFile = file;
      this.originalImage = await Utils.fileToImage(file);

      this.imgBefore.src = this.originalImage.src;
      this.origSizeLabel.textContent = Utils.formatBytes(file.size);

      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.updateCompression();
      Utils.showToast('Imagem carregada com sucesso!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao abrir a imagem.', 'error');
    }
  }

  updateCompression() {
    if (!this.originalImage) return;

    const canvas = document.createElement('canvas');
    canvas.width = this.originalImage.naturalWidth;
    canvas.height = this.originalImage.naturalHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.originalImage, 0, 0);

    const mimeType = this.outputFormatSelect.value;
    const quality = parseInt(this.qualityRange.value, 10) / 100;

    canvas.toBlob((blob) => {
      if (!blob) return;

      this.compressedBlob = blob;
      const optSize = blob.size;
      const origSize = this.originalFile.size;

      this.optSizeLabel.textContent = Utils.formatBytes(optSize);

      const savedBytes = origSize - optSize;
      const savedPercent = Math.max(0, ((savedBytes / origSize) * 100)).toFixed(1);
      
      if (savedBytes >= 0) {
        this.savingLabel.textContent = `-${savedPercent}%`;
        this.savingLabel.style.color = 'var(--accent-emerald)';
      } else {
        const increase = Math.abs(savedPercent);
        this.savingLabel.textContent = `+${increase}%`;
        this.savingLabel.style.color = 'var(--accent-rose)';
      }

      const compressedUrl = URL.createObjectURL(blob);
      this.imgAfter.src = compressedUrl;
    }, mimeType, quality);
  }

  downloadResult() {
    if (!this.compressedBlob || !this.originalFile) return;

    const extMap = {
      'image/webp': '.webp',
      'image/jpeg': '.jpg',
      'image/png': '.png'
    };

    const ext = extMap[this.outputFormatSelect.value] || '.jpg';
    const originalName = this.originalFile.name.replace(/\.[^/.]+$/, "");
    const outputFilename = `${originalName}_supaedit_opt${ext}`;

    const savedBytes = Math.max(0, this.originalFile.size - this.compressedBlob.size);
    Utils.downloadBlob(this.compressedBlob, outputFilename);
    Utils.updateStats(savedBytes);
    Utils.showToast('Download concluído com sucesso!');
  }

  reset() {
    this.originalFile = null;
    this.originalImage = null;
    this.compressedBlob = null;

    this.fileInput.value = '';
    this.workspace.classList.add('hidden');
    this.dropZone.classList.remove('hidden');
  }

  initSliderDrag() {
    let isDragging = false;

    const updateSlider = (clientX) => {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      this.afterWrapper.style.width = `${percentage}%`;
      this.sliderHandle.style.left = `${percentage}%`;
    };

    const startDrag = (e) => {
      isDragging = true;
      updateSlider(e.clientX || (e.touches && e.touches[0].clientX));
    };

    const stopDrag = () => {
      isDragging = false;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      updateSlider(e.clientX || (e.touches && e.touches[0].clientX));
    };

    if (this.sliderHandle) {
      this.sliderHandle.addEventListener('mousedown', startDrag);
      this.container.addEventListener('mousedown', startDrag);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('mousemove', onMove);

      this.sliderHandle.addEventListener('touchstart', startDrag);
      this.container.addEventListener('touchstart', startDrag);
      window.addEventListener('touchend', stopDrag);
      window.addEventListener('touchmove', onMove);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.compressorApp = new ImageCompressorModule();
});
