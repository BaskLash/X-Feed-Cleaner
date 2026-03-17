document.addEventListener("DOMContentLoaded", () => {

  const fields = document.querySelectorAll('input[type="checkbox"]');

  // Load all settings from storage and populate the UI
  chrome.storage.local.get(null, (data) => {
    fields.forEach(el => {
      if (el.id === "extensionEnabled") {
        // Default to true (enabled) if not set
        el.checked = data[el.id] !== false;
      } else {
        el.checked = !!data[el.id];
      }
    });
  });

  // On any change: save to storage and notify the active tab's content script
  fields.forEach(el => {
    el.addEventListener("change", () => {
      const key = el.id;
      const value = el.checked;

      chrome.storage.local.set({ [key]: value });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0]?.id) return;
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleSetting",
          key: key,
          value: value
        });
      });
    });
  });

});
