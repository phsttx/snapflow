/* ==========================================================================
   SupaEdit - Custom Rounded Dark Color Picker Popover (Hidden By Default)
   ========================================================================== */

class CustomColorPickerComponent {
  constructor() {
    this.activeInput = null;
    this.currentHex = '#ffffff';

    this.createPopoverDOM();
    this.bindGlobalColorInputs();
  }

  createPopoverDOM() {
    this.popover = document.createElement('div');
    this.popover.className = 'custom-color-popover hidden';
    this.popover.style.display = 'none'; // Ensure hidden initially
    this.popover.innerHTML = `
      <div class="popover-header">
        <span>Seletor de Cor</span>
        <button class="popover-close-btn" id="closeColorPopover">&times;</button>
      </div>

      <div class="popover-canvas-wrapper">
        <canvas id="colorSatCanvas" width="220" height="120"></canvas>
      </div>

      <div class="popover-controls">
        <input type="range" id="colorHueSlider" min="0" max="360" value="0" class="hue-slider">
        <div class="popover-hex-row">
          <div class="color-preview-circle" id="popoverColorPreview"></div>
          <input type="text" id="popoverHexInput" class="text-input" value="#ffffff" maxlength="7">
        </div>

        <div class="popover-presets-grid">
          <span class="preset-chip" style="background:#ffffff" data-hex="#ffffff"></span>
          <span class="preset-chip" style="background:#09090b" data-hex="#09090b"></span>
          <span class="preset-chip" style="background:#18181b" data-hex="#18181b"></span>
          <span class="preset-chip" style="background:#38bdf8" data-hex="#38bdf8"></span>
          <span class="preset-chip" style="background:#22c55e" data-hex="#22c55e"></span>
          <span class="preset-chip" style="background:#a855f7" data-hex="#a855f7"></span>
          <span class="preset-chip" style="background:#ef4444" data-hex="#ef4444"></span>
          <span class="preset-chip" style="background:#f59e0b" data-hex="#f59e0b"></span>
        </div>
      </div>
    `;

    document.body.appendChild(this.popover);

    this.satCanvas = document.getElementById('colorSatCanvas');
    this.satCtx = this.satCanvas ? this.satCanvas.getContext('2d') : null;
    this.hueSlider = document.getElementById('colorHueSlider');
    this.hexInput = document.getElementById('popoverHexInput');
    this.previewCircle = document.getElementById('popoverColorPreview');
    this.closeBtn = document.getElementById('closeColorPopover');

    this.currentHue = 0;
    this.bindPopoverEvents();
  }

  bindGlobalColorInputs() {
    // Intercept clicks on input[type="color"]
    document.addEventListener('click', (e) => {
      if (e.target && e.target.tagName === 'INPUT' && e.target.type === 'color') {
        e.preventDefault();
        e.stopPropagation();
        this.openPopover(e.target);
      } else if (this.popover && !this.popover.contains(e.target) && !this.popover.classList.contains('hidden')) {
        this.closePopover();
      }
    });
  }

  bindPopoverEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closePopover();
      });
    }

    if (this.hueSlider) {
      this.hueSlider.addEventListener('input', () => {
        this.currentHue = parseInt(this.hueSlider.value, 10);
        this.drawSatCanvas();
        this.updateFromSatCanvas(this.lastX || 110, this.lastY || 60);
      });
    }

    if (this.hexInput) {
      this.hexInput.addEventListener('input', () => {
        let val = this.hexInput.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          this.applyColor(val);
        }
      });
    }

    // Preset Chips
    this.popover.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const hex = chip.dataset.hex;
        this.applyColor(hex);
      });
    });

    // Saturation Canvas Click
    if (this.satCanvas) {
      let isDragging = false;
      const handleCanvasClick = (e) => {
        const rect = this.satCanvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        this.lastX = x;
        this.lastY = y;
        this.updateFromSatCanvas(x, y);
      };

      this.satCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        handleCanvasClick(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (isDragging) handleCanvasClick(e);
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  openPopover(inputEl) {
    this.activeInput = inputEl;
    this.currentHex = inputEl.value || '#ffffff';

    const rect = inputEl.getBoundingClientRect();
    this.popover.style.top = `${window.scrollY + rect.bottom + 8}px`;
    this.popover.style.left = `${Math.min(window.innerWidth - 260, rect.left)}px`;

    this.popover.classList.remove('hidden');
    this.popover.classList.add('active');
    this.popover.style.display = 'flex';

    this.hexInput.value = this.currentHex;
    this.previewCircle.style.backgroundColor = this.currentHex;

    this.drawSatCanvas();
  }

  closePopover() {
    this.popover.classList.remove('active');
    this.popover.classList.add('hidden');
    this.popover.style.display = 'none';
    this.activeInput = null;
  }

  drawSatCanvas() {
    if (!this.satCtx) return;
    const w = this.satCanvas.width;
    const h = this.satCanvas.height;

    const gradH = this.satCtx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, '#ffffff');
    gradH.addColorStop(1, `hsl(${this.currentHue}, 100%, 50%)`);

    this.satCtx.fillStyle = gradH;
    this.satCtx.fillRect(0, 0, w, h);

    const gradV = this.satCtx.createLinearGradient(0, 0, 0, h);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(1, 'rgba(0,0,0,1)');

    this.satCtx.fillStyle = gradV;
    this.satCtx.fillRect(0, 0, w, h);
  }

  updateFromSatCanvas(x, y) {
    if (!this.satCtx) return;
    const pixel = this.satCtx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(c => c.toString(16).padStart(2, '0')).join('');
    this.applyColor(hex);
  }

  applyColor(hex) {
    this.currentHex = hex;
    this.hexInput.value = hex;
    this.previewCircle.style.backgroundColor = hex;

    if (this.activeInput) {
      this.activeInput.value = hex;
      this.activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      this.activeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.customColorPicker = new CustomColorPickerComponent();
});
