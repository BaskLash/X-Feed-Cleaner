document.addEventListener("DOMContentLoaded", () => {

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const radios     = document.querySelectorAll('input[name="displayTheme"]');

  // ── Load stored settings ───────────────────────────────────────────────────
  chrome.storage.local.get(null, (data) => {
    checkboxes.forEach(el => {
      // extensionEnabled defaults to true; all other checkboxes default to false
      if (el.id === "extensionEnabled") {
        el.checked = data[el.id] !== false;
      } else {
        el.checked = !!data[el.id];
      }
    });

    radios.forEach(el => {
      if (el.id === data.displayTheme) el.checked = true;
    });

    // Reflect dim mode on the popup body itself
    applyPopupDimMode(data.displayTheme);
  });

  // ── Save on change + notify content script ─────────────────────────────────
  checkboxes.forEach(el => {
    el.addEventListener("change", () => {
      const key   = el.id;
      const value = el.checked;
      chrome.storage.local.set({ [key]: value });
      notifyTab({ action: "settingsChanged" });
    });
  });

  radios.forEach(el => {
    el.addEventListener("change", () => {
      if (!el.checked) return;
      const value = el.id;
      chrome.storage.local.set({ displayTheme: value });
      applyPopupDimMode(value);
      notifyTab({ action: "settingsChanged" });
    });
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  function notifyTab(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }

  function applyPopupDimMode(theme) {
    document.body.classList.toggle("dim-mode", theme === "themeDim");
  }

});
