// content.js

const GROK_SELECTOR = '[aria-label="Grok"]';
const FOLLOW_SELECTOR = '[aria-label="Follow"]';

function toggleGrok(hide) {
  const elements = document.querySelectorAll(GROK_SELECTOR);
  elements.forEach(el => { el.style.display = hide ? 'none' : ''; });
  return elements.length > 0; // Gibt true zurück, wenn Elemente gefunden wurden
}

function toggleFollowSuggestions(hide) {
  const elements = document.querySelectorAll(FOLLOW_SELECTOR);
  elements.forEach(el => { el.style.display = hide ? 'none' : ''; });
  return elements.length > 0;
}

function applySettings(settings) {
  const grokFound = toggleGrok(settings.hideGrok === true);
  const followFound = toggleFollowSuggestions(settings.hideFollow === true);
  return { grokFound, followFound };
}

// Intervall-Logik für das initiale Laden
function startInitializationInterval() {
  const checkInterval = setInterval(() => {
    chrome.storage.local.get(["hideGrok", "hideFollow"], (settings) => {
      const results = applySettings(settings);
      
      // Stop-Bedingung: Wenn beide aktivierten Funktionen ihre Ziele gefunden haben
      const needGrok = settings.hideGrok === true;
      const needFollow = settings.hideFollow === true;

      const grokOk = !needGrok || (needGrok && results.grokFound);
      const followOk = !needFollow || (needFollow && results.followFound);

      if (grokOk && followOk) {
        clearInterval(checkInterval);
        console.log("DOM-Elemente gefunden und bearbeitet. Intervall gestoppt.");
      }
    });
  }, 500); // Prüft alle 500ms

  // Sicherheitshalber nach 10 Sekunden stoppen, falls Elemente gar nicht existieren
  setTimeout(() => clearInterval(checkInterval), 10000);
}

// ────────────────────────────────────────────────
// Event Listener (Bleiben gleich für sofortige Updates)

chrome.runtime.onMessage.addListener((message) => {
  if (message?.action !== "toggleSetting") return;
  chrome.storage.local.get(["hideGrok", "hideFollow"], (settings) => {
    applySettings(settings);
  });
});

chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(["hideGrok", "hideFollow"], (settings) => {
    applySettings(settings);
  });
});

// Startpunkt
startInitializationInterval();
