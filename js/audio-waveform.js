/* ==========================================================================
   SupaEdit - Audio Waveform Visualizer Module (Web Audio API)
   ========================================================================== */

class AudioWaveformModule {
  constructor() {
    this.audioBuffer = null;
    this.waveColor = '#38bdf8';
    this.waveType = 'bars'; // bars, line, circular

    this.initEvents();
  }

  initEvents() {
    this.dropZone = document.getElementById('audioDropZone');
    this.fileInput = document.getElementById('audioFileInput');
    this.workspace = document.getElementById('audioWorkspace');
    this.canvas = document.getElementById('audioCanvas');
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

    const colorPicker = document.getElementById('audioWaveColor');
    if (colorPicker) {
      colorPicker.addEventListener('input', () => {
        this.waveColor = colorPicker.value;
        this.render();
      });
    }

    const downloadBtn = document.getElementById('downloadWaveformBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (!this.canvas) return;
        const dataUrl = this.canvas.toDataURL('image/png');
        Utils.downloadDataUrl(dataUrl, 'supaedit_audio_waveform.png');
        Utils.showToast('Imagem da Forma de Onda do Áudio baixada em PNG!');
      });
    }
  }

  async loadFile(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      this.dropZone.classList.add('hidden');
      this.workspace.classList.remove('hidden');

      this.render();
      Utils.showToast('Áudio decodificado e forma de onda gerada com sucesso!');
    } catch (err) {
      console.error(err);
      Utils.showToast('Erro ao ler o arquivo de áudio.', 'error');
    }
  }

  render() {
    if (!this.audioBuffer || !this.ctx || !this.canvas) return;

    const w = 800;
    const h = 300;
    this.canvas.width = w;
    this.canvas.height = h;

    const pcmData = this.audioBuffer.getChannelData(0);
    const step = Math.ceil(pcmData.length / 140);

    this.ctx.fillStyle = '#09090b';
    this.ctx.fillRect(0, 0, w, h);

    const barW = 4;
    const gap = 2;

    this.ctx.fillStyle = this.waveColor;

    for (let i = 0; i < 140; i++) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j++) {
        const datum = pcmData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const amp = (max - min) / 2;
      const barH = amp * (h - 40);
      const x = i * (barW + gap) + 20;
      const y = (h - barH) / 2;

      this.ctx.fillRect(x, y, barW, barH);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.audioApp = new AudioWaveformModule();
});
