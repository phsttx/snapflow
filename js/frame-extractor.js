/* ==========================================================================
   DesignExpress - Video & GIF Frame Extractor Module
   ========================================================================== */

class FrameExtractorModule {
  constructor() {
    this.videoElement = null;
    this.currentBlobUrl = null;

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('frameDropZone');
    this.fileInput = document.getElementById('frameFileInput');
    this.workspace = document.getElementById('frameWorkspace');

    this.videoElement = document.getElementById('videoPlayer');
    this.captureBtn = document.getElementById('captureFrameBtn');
    this.capturedCanvas = document.getElementById('capturedFrameCanvas');
    this.downloadFrameBtn = document.getElementById('downloadFrameBtn');

    if (!this.dropZone || !this.fileInput) return;

    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) this.loadVideo(e.target.files[0]);
    });

    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => this.dropZone.classList.remove('drag-over'));
    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) this.loadVideo(e.dataTransfer.files[0]);
    });

    // Time seek step buttons
    const stepTime = (seconds) => {
      if (this.videoElement) {
        this.videoElement.currentTime = Math.max(0, Math.min(this.videoElement.duration || 0, this.videoElement.currentTime + seconds));
      }
    };

    const bindClick = (id, seconds) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => stepTime(seconds));
    };

    bindClick('stepBack1s', -1);
    bindClick('stepBackStep', -0.1);
    bindClick('stepForwardStep', 0.1);
    bindClick('stepForward1s', 1);

    if (this.captureBtn) {
      this.captureBtn.addEventListener('click', () => this.captureFrame());
    }

    if (this.downloadFrameBtn) {
      this.downloadFrameBtn.addEventListener('click', () => {
        if (!this.capturedCanvas) return;
        const dataUrl = this.capturedCanvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, `designexpress_frame_${Math.round(this.videoElement.currentTime || 0)}s.png`);
        Utils.showToast('Frame de vídeo baixado com sucesso!');
      });
    }
  }

  loadVideo(file) {
    if (!this.videoElement) return;

    if (this.currentBlobUrl) {
      URL.revokeObjectURL(this.currentBlobUrl);
    }

    this.currentBlobUrl = URL.createObjectURL(file);
    this.videoElement.src = this.currentBlobUrl;

    this.dropZone.classList.add('hidden');
    this.workspace.classList.remove('hidden');

    this.videoElement.onloadedmetadata = () => {
      this.videoElement.currentTime = 0;
      setTimeout(() => this.captureFrame(), 300);
      Utils.showToast('Vídeo carregado! Use a linha do tempo para capturar frames.');
    };
  }

  captureFrame() {
    if (!this.videoElement || !this.capturedCanvas) return;

    const v = this.videoElement;
    const w = v.videoWidth || 640;
    const h = v.videoHeight || 360;

    this.capturedCanvas.width = w;
    this.capturedCanvas.height = h;

    const ctx = this.capturedCanvas.getContext('2d');
    ctx.drawImage(v, 0, 0, w, h);

    document.getElementById('capturedFrameContainer').classList.remove('hidden');
    Utils.showToast('Quadro capturado com sucesso!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.frameApp = new FrameExtractorModule();
});
