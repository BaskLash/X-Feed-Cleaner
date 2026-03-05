// content.js

// ────────────────────────────────────────────────
// Selektoren (passen bei Bedarf an – aktuell meist ausreichend)
const GROK_SELECTORS = [
  '[aria-label="Grok"]'
];

const GROK_SELECTOR = GROK_SELECTORS.join(', ');

function toggleGrok(hide) {
  document.querySelectorAll(GROK_SELECTOR).forEach(el => {
    el.style.display = hide ? 'none' : '';
  });
}

// Zentrale Apply-Funktion (später leicht erweiterbar für mehr Settings)
function applyGrokSetting(hide = false) {
  toggleGrok(!!hide);
}

// ────────────────────────────────────────────────
// A) Sofort-Reaktion vom Popup (schnellste Möglichkeit)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.action === "toggleSetting" && message.key === "hideGrok") {
    applyGrokSetting(message.value);
    // Optional: Bestätigung zurücksenden
    // sendResponse({ success: true });
  }
  // return true;   ← nur wenn du asynchron sendResponse nutzen willst
});

// ────────────────────────────────────────────────
// B) Reagiert auf ALLE storage-Änderungen (auch nach Neuladen, von anderem Tab etc.)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  if ('hideGrok' in changes) {
    const newValue = changes.hideGrok.newValue;
    applyGrokSetting(newValue);
  }
});

// ────────────────────────────────────────────────
// C) Initial laden (einmalig beim Content-Script-Start)
chrome.storage.local.get("hideGrok", (result) => {
  applyGrokSetting(result.hideGrok);
});