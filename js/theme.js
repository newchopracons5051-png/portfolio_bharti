/**
 * Bharti Chopra Portfolio - Theme & Customization Engine
 * Controls color schemes, dark/light mode, fonts, layout radius,
 * and handles the interactive Theme Customizer floating panel.
 */

const THEME_STORAGE_KEY = "bharti_portfolio_theme_v1";

const THEME_PRESETS = {
  emerald: {
    name: "Jaipur Emerald",
    primary: "#059669",
    primaryLight: "#10b981",
    accent: "#34d399",
    heroGlow: "rgba(5, 150, 105, 0.25)"
  },
  blueprint: {
    name: "Civil Blueprint",
    primary: "#0284c7",
    primaryLight: "#38bdf8",
    accent: "#0ea5e9",
    heroGlow: "rgba(2, 132, 199, 0.25)"
  },
  amber: {
    name: "Sunset Amber",
    primary: "#d97706",
    primaryLight: "#f59e0b",
    accent: "#fbbf24",
    heroGlow: "rgba(217, 119, 6, 0.25)"
  },
  violet: {
    name: "Royal Violet",
    primary: "#6366f1",
    primaryLight: "#818cf8",
    accent: "#a855f7",
    heroGlow: "rgba(99, 102, 241, 0.25)"
  },
  rose: {
    name: "Modern Rose",
    primary: "#e11d48",
    primaryLight: "#fb7185",
    accent: "#f43f5e",
    heroGlow: "rgba(225, 29, 72, 0.25)"
  },
  slate: {
    name: "Midnight Slate",
    primary: "#475569",
    primaryLight: "#64748b",
    accent: "#94a3b8",
    heroGlow: "rgba(71, 85, 105, 0.25)"
  }
};

const DEFAULT_THEME_CONFIG = {
  mode: "dark", // 'dark' or 'light'
  preset: "blueprint",
  primaryColor: "#0284c7",
  primaryLightColor: "#38bdf8",
  accentColor: "#0ea5e9",
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  fontId: "jakarta",
  borderRadius: "14px",
  editMode: false
};

// Retrieve stored theme or fallback
function getThemeConfig() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Theme storage unavailable, using defaults:", e);
  }
  return { ...DEFAULT_THEME_CONFIG };
}

// Save theme config
function saveThemeConfig(config) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
    applyTheme(config);
    window.dispatchEvent(new CustomEvent("themeConfigUpdated", { detail: config }));
  } catch (e) {
    console.error("Failed to save theme config:", e);
  }
}

// Apply CSS variables and root attributes
function applyTheme(config) {
  const root = document.documentElement;

  // Dark or Light Mode
  root.setAttribute("data-theme", config.mode);

  // CSS variables
  root.style.setProperty("--primary", config.primaryColor);
  root.style.setProperty("--primary-light", config.primaryLightColor || config.primaryColor);
  root.style.setProperty("--accent", config.accentColor);
  root.style.setProperty("--font-sans", config.fontFamily);
  root.style.setProperty("--radius", config.borderRadius);

  // Derive subtle shadows and glows
  root.style.setProperty("--primary-rgb", hexToRgbString(config.primaryColor));
  root.style.setProperty("--accent-rgb", hexToRgbString(config.accentColor));

  // Edit mode attribute
  if (config.editMode) {
    document.body.classList.add("portfolio-edit-mode");
  } else {
    document.body.classList.remove("portfolio-edit-mode");
  }

  // Update theme toggle button icons if present
  const themeToggleIcons = document.querySelectorAll(".theme-toggle-icon");
  themeToggleIcons.forEach(icon => {
    if (config.mode === "light") {
      icon.innerHTML = `<i class="fa-solid fa-moon"></i>`;
      icon.setAttribute("title", "Switch to Dark Mode");
    } else {
      icon.innerHTML = `<i class="fa-solid fa-sun"></i>`;
      icon.setAttribute("title", "Switch to Light Mode");
    }
  });
}

function hexToRgbString(hex) {
  if (!hex || hex[0] !== '#') return "2, 132, 199";
  let c = hex.substring(1);
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

// Helper to inject theme customizer modal / panel into DOM
function injectCustomizerModal() {
  if (document.getElementById("customizer-panel")) return;

  const config = getThemeConfig();

  const customizerHtml = `
    <!-- Floating Quick Launch Button -->
    <div class="customizer-launcher-container" id="customizer-launcher-container">
      <button class="customizer-launch-btn" id="customizer-open-btn" aria-label="Open Theme Customizer" title="Customize Colors, Fonts & Edit Mode">
        <span class="customizer-icon-spin"><i class="fa-solid fa-palette"></i></span>
        <span class="customizer-label">Customize</span>
      </button>
    </div>

    <!-- Customizer Drawer / Modal Overlay -->
    <div class="customizer-backdrop" id="customizer-backdrop"></div>
    <div class="customizer-drawer" id="customizer-drawer" role="dialog" aria-modal="true" aria-labelledby="customizer-title">
      <div class="customizer-header">
        <div class="customizer-title-group">
          <i class="fa-solid fa-wand-magic-sparkles text-primary"></i>
          <h3 id="customizer-title">Theme & Layout Studio</h3>
        </div>
        <button class="customizer-close-btn" id="customizer-close-btn" aria-label="Close Customizer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="customizer-body">
        <!-- Edit Mode Switch -->
        <div class="customizer-section edit-mode-highlight">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-pen-to-square"></i> Live Content Edit Mode</span>
            <span class="badge badge-accent">Interactive</span>
          </div>
          <p class="customizer-hint">Turn on to edit text, add/remove skills, projects, and achievements right on screen!</p>
          <label class="toggle-switch-label">
            <input type="checkbox" id="customizer-edit-mode-toggle" ${config.editMode ? "checked" : ""}>
            <span class="toggle-slider"></span>
            <span class="toggle-text" id="edit-mode-status-text">${config.editMode ? "Editing Enabled" : "Preview Mode"}</span>
          </label>
        </div>

        <!-- Mode Toggle (Dark / Light) -->
        <div class="customizer-section">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-circle-half-stroke"></i> Color Appearance</span>
          </div>
          <div class="theme-mode-buttons">
            <button class="mode-select-btn ${config.mode === 'dark' ? 'active' : ''}" data-mode="dark">
              <i class="fa-solid fa-moon"></i> Dark Mode
            </button>
            <button class="mode-select-btn ${config.mode === 'light' ? 'active' : ''}" data-mode="light">
              <i class="fa-solid fa-sun"></i> Light Mode
            </button>
          </div>
        </div>

        <!-- Preset Palettes -->
        <div class="customizer-section">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-swatchbook"></i> Curated Color Palettes</span>
          </div>
          <div class="preset-palettes-grid">
            ${Object.entries(THEME_PRESETS).map(([key, preset]) => `
              <button class="preset-chip ${config.preset === key ? 'active' : ''}" data-preset="${key}">
                <span class="color-dot" style="background:${preset.primary}; box-shadow: 0 0 8px ${preset.accent};"></span>
                <span class="preset-name">${preset.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Custom Color Pickers -->
        <div class="customizer-section">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-sliders"></i> Fine-Tune Colors</span>
          </div>
          <div class="color-pickers-row">
            <div class="color-picker-item">
              <label for="custom-primary-picker">Primary Brand</label>
              <div class="picker-input-wrapper">
                <input type="color" id="custom-primary-picker" value="${config.primaryColor}">
                <span class="picker-hex-val" id="primary-hex-display">${config.primaryColor}</span>
              </div>
            </div>
            <div class="color-picker-item">
              <label for="custom-accent-picker">Accent Highlight</label>
              <div class="picker-input-wrapper">
                <input type="color" id="custom-accent-picker" value="${config.accentColor}">
                <span class="picker-hex-val" id="accent-hex-display">${config.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Typography / Font Switcher -->
        <div class="customizer-section">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-font"></i> Typography & Font Style</span>
          </div>
          <select id="custom-font-select" class="customizer-select">
            <option value="jakarta" ${config.fontId === 'jakarta' ? 'selected' : ''}>Plus Jakarta Sans (Modern & Crisp)</option>
            <option value="inter" ${config.fontId === 'inter' ? 'selected' : ''}>Inter (Balanced & Clean UI)</option>
            <option value="space" ${config.fontId === 'space' ? 'selected' : ''}>Space Grotesk (Civil Tech & Geometric)</option>
            <option value="outfit" ${config.fontId === 'outfit' ? 'selected' : ''}>Outfit (Minimalist & Polished)</option>
            <option value="playfair" ${config.fontId === 'playfair' ? 'selected' : ''}>Playfair Display (Editorial Serif)</option>
          </select>
        </div>

        <!-- Border Radius / Corner Roundness -->
        <div class="customizer-section">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-shapes"></i> Corner Radius</span>
          </div>
          <div class="radius-options">
            <button class="radius-btn ${config.borderRadius === '6px' ? 'active' : ''}" data-radius="6px">Sharp (6px)</button>
            <button class="radius-btn ${config.borderRadius === '14px' ? 'active' : ''}" data-radius="14px">Modern (14px)</button>
            <button class="radius-btn ${config.borderRadius === '22px' ? 'active' : ''}" data-radius="22px">Curved (22px)</button>
          </div>
        </div>

        <!-- Data Management & Reset -->
        <div class="customizer-section customizer-data-actions">
          <div class="customizer-section-title">
            <span><i class="fa-solid fa-database"></i> Data & Backup</span>
          </div>
          <div class="customizer-btn-grid">
            <button class="btn btn-outline btn-sm" id="btn-export-data" title="Download your edited portfolio data as JSON">
              <i class="fa-solid fa-download"></i> Export Data JSON
            </button>
            <button class="btn btn-outline btn-sm" id="btn-reset-all" title="Reset theme and portfolio data to initial defaults">
              <i class="fa-solid fa-rotate-left"></i> Reset Defaults
            </button>
          </div>
        </div>
      </div>

      <div class="customizer-footer">
        <span class="customizer-autosave-note"><i class="fa-solid fa-cloud-check"></i> Changes auto-save instantly</span>
        <button class="btn btn-primary btn-sm" id="customizer-done-btn">Done</button>
      </div>
    </div>
  `;

  const container = document.createElement("div");
  container.id = "customizer-panel";
  container.innerHTML = customizerHtml;
  document.body.appendChild(container);

  bindCustomizerEvents();
}

function bindCustomizerEvents() {
  const launcher = document.getElementById("customizer-open-btn");
  const drawer = document.getElementById("customizer-drawer");
  const backdrop = document.getElementById("customizer-backdrop");
  const closeBtn = document.getElementById("customizer-close-btn");
  const doneBtn = document.getElementById("customizer-done-btn");

  const openDrawer = () => {
    drawer.classList.add("open");
    backdrop.classList.add("open");
  };

  const closeDrawer = () => {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
  };

  if (launcher) launcher.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  if (doneBtn) doneBtn.addEventListener("click", closeDrawer);
  if (backdrop) backdrop.addEventListener("click", closeDrawer);

  // Edit Mode toggle
  const editToggle = document.getElementById("customizer-edit-mode-toggle");
  const editStatusText = document.getElementById("edit-mode-status-text");
  if (editToggle) {
    editToggle.addEventListener("change", (e) => {
      const config = getThemeConfig();
      config.editMode = e.target.checked;
      if (editStatusText) {
        editStatusText.textContent = config.editMode ? "Editing Enabled" : "Preview Mode";
      }
      saveThemeConfig(config);
      showToast(config.editMode ? "✏️ Edit Mode Enabled: Click text or cards to edit!" : "👁️ Preview Mode Enabled", "info");
    });
  }

  // Dark/Light Mode buttons
  const modeButtons = document.querySelectorAll(".mode-select-btn");
  modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      modeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const config = getThemeConfig();
      config.mode = mode;
      saveThemeConfig(config);
    });
  });

  // Preset Palettes
  const presetChips = document.querySelectorAll(".preset-chip");
  presetChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const presetKey = chip.dataset.preset;
      const preset = THEME_PRESETS[presetKey];
      if (!preset) return;

      presetChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const config = getThemeConfig();
      config.preset = presetKey;
      config.primaryColor = preset.primary;
      config.primaryLightColor = preset.primaryLight;
      config.accentColor = preset.accent;

      // Update color picker inputs
      const pInput = document.getElementById("custom-primary-picker");
      const aInput = document.getElementById("custom-accent-picker");
      const pHex = document.getElementById("primary-hex-display");
      const aHex = document.getElementById("accent-hex-display");
      if (pInput) pInput.value = preset.primary;
      if (aInput) aInput.value = preset.accent;
      if (pHex) pHex.textContent = preset.primary;
      if (aHex) aHex.textContent = preset.accent;

      saveThemeConfig(config);
    });
  });

  // Color Pickers
  const primaryPicker = document.getElementById("custom-primary-picker");
  const accentPicker = document.getElementById("custom-accent-picker");
  const pHexDisplay = document.getElementById("primary-hex-display");
  const aHexDisplay = document.getElementById("accent-hex-display");

  if (primaryPicker) {
    primaryPicker.addEventListener("input", (e) => {
      const val = e.target.value;
      if (pHexDisplay) pHexDisplay.textContent = val;
      const config = getThemeConfig();
      config.primaryColor = val;
      config.primaryLightColor = val;
      config.preset = "custom";
      presetChips.forEach(c => c.classList.remove("active"));
      saveThemeConfig(config);
    });
  }

  if (accentPicker) {
    accentPicker.addEventListener("input", (e) => {
      const val = e.target.value;
      if (aHexDisplay) aHexDisplay.textContent = val;
      const config = getThemeConfig();
      config.accentColor = val;
      config.preset = "custom";
      presetChips.forEach(c => c.classList.remove("active"));
      saveThemeConfig(config);
    });
  }

  // Font Switcher
  const fontSelect = document.getElementById("custom-font-select");
  if (fontSelect) {
    fontSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const config = getThemeConfig();
      config.fontId = val;
      if (val === "inter") config.fontFamily = "'Inter', -apple-system, sans-serif";
      else if (val === "space") config.fontFamily = "'Space Grotesk', sans-serif";
      else if (val === "outfit") config.fontFamily = "'Outfit', sans-serif";
      else if (val === "playfair") config.fontFamily = "'Playfair Display', Georgia, serif";
      else config.fontFamily = "'Plus Jakarta Sans', -apple-system, sans-serif";
      saveThemeConfig(config);
    });
  }

  // Radius buttons
  const radiusButtons = document.querySelectorAll(".radius-btn");
  radiusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      radiusButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const radius = btn.dataset.radius;
      const config = getThemeConfig();
      config.borderRadius = radius;
      saveThemeConfig(config);
    });
  });

  // Export JSON
  const exportBtn = document.getElementById("btn-export-data");
  if (exportBtn && window.PortfolioDataStore) {
    exportBtn.addEventListener("click", () => {
      window.PortfolioDataStore.exportJSON();
      showToast("💾 Portfolio data exported to JSON file!", "success");
    });
  }

  // Reset to Defaults
  const resetBtn = document.getElementById("btn-reset-all");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("Reset theme styling and portfolio data back to defaults?")) {
        localStorage.removeItem(THEME_STORAGE_KEY);
        if (window.PortfolioDataStore) {
          window.PortfolioDataStore.reset();
        }
        applyTheme(DEFAULT_THEME_CONFIG);
        showToast("🔄 Restored initial default theme and data!", "info");
        setTimeout(() => window.location.reload(), 600);
      }
    });
  }
}

// Global Toast Notification Helper
function showToast(message, type = "info") {
  let toastContainer = document.getElementById("portfolio-toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "portfolio-toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `portfolio-toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Initial theme boot on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const config = getThemeConfig();
  applyTheme(config);
  injectCustomizerModal();

  // Bind any top-nav quick theme toggle buttons
  document.querySelectorAll(".quick-theme-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const currentConfig = getThemeConfig();
      currentConfig.mode = currentConfig.mode === "dark" ? "light" : "dark";
      saveThemeConfig(currentConfig);
      // Sync buttons inside modal if open
      document.querySelectorAll(".mode-select-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.mode === currentConfig.mode);
      });
      showToast(currentConfig.mode === "dark" ? "🌙 Dark theme activated" : "☀️ Light theme activated", "info");
    });
  });
});

// Immediate execution to avoid page flash
(function() {
  const config = getThemeConfig();
  document.documentElement.setAttribute("data-theme", config.mode);
  document.documentElement.style.setProperty("--primary", config.primaryColor);
  document.documentElement.style.setProperty("--primary-light", config.primaryLightColor || config.primaryColor);
  document.documentElement.style.setProperty("--accent", config.accentColor);
  document.documentElement.style.setProperty("--font-sans", config.fontFamily);
  document.documentElement.style.setProperty("--radius", config.borderRadius);
})();

window.ThemeEngine = {
  get: getThemeConfig,
  save: saveThemeConfig,
  apply: applyTheme,
  showToast: showToast
};
