/* ==========================================================================
   DesignExpress - Utilities & UI Helpers
   ========================================================================== */

const Utils = {
  // Format bytes into human readable format (KB, MB)
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },

  // Display toast notification
  showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconName = 'check-circle-2';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) {
      lucide.createIcons();
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // Update session statistics
  updateStats(bytesSaved = 0) {
    const countEl = document.getElementById('statsFilesProcessed');
    const spaceEl = document.getElementById('statsSavedSpace');

    let currentCount = parseInt(localStorage.getItem('supaedit_processed_count') || '0', 10) + 1;
    let currentBytes = parseFloat(localStorage.getItem('supaedit_saved_bytes') || '0') + Math.max(0, bytesSaved);

    localStorage.setItem('supaedit_processed_count', currentCount.toString());
    localStorage.setItem('supaedit_saved_bytes', currentBytes.toString());

    if (countEl) countEl.textContent = currentCount;
    if (spaceEl) spaceEl.textContent = this.formatBytes(currentBytes, 1);
  },

  // Load stats from localStorage
  loadStats() {
    const countEl = document.getElementById('statsFilesProcessed');
    const spaceEl = document.getElementById('statsSavedSpace');

    const currentCount = localStorage.getItem('supaedit_processed_count') || '0';
    const currentBytes = parseFloat(localStorage.getItem('supaedit_saved_bytes') || '0');

    if (countEl) countEl.textContent = currentCount;
    if (spaceEl) spaceEl.textContent = this.formatBytes(currentBytes, 1);
  },

  // Convert File object to Image object
  fileToImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  // Trigger download for Canvas or DataURL
  downloadDataUrl(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    this.downloadDataUrl(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

// Initialize stats on load
document.addEventListener('DOMContentLoaded', () => Utils.loadStats());
