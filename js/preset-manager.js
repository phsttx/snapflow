/* ==========================================================================
   SupaEdit - Preset & LocalStorage Manager Module
   ========================================================================== */

class PresetManagerModule {
  constructor() {
    this.storageKey = 'supaedit_user_presets';
    this.presets = this.loadPresets();
  }

  loadPresets() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {
        watermarkText: '© SupaEdit',
        watermarkColor: '#ffffff',
        brandColor1: '#38bdf8',
        brandColor2: '#22c55e',
        defaultQuality: 85
      };
    } catch (e) {
      return {};
    }
  }

  savePreset(key, val) {
    this.presets[key] = val;
    localStorage.setItem(this.storageKey, JSON.stringify(this.presets));
    Utils.showToast('Preferências salvas no navegador!');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.presetManager = new PresetManagerModule();
});
