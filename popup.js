document.addEventListener("DOMContentLoaded", () => {

  // Alle relevanten Felder
  const fields = [
    ...document.querySelectorAll('input[type="checkbox"]'),
    ...document.querySelectorAll('input[name="displayTheme"]')
  ];

  // 1. Alles laden
  chrome.storage.local.get(null, (data) => {
    fields.forEach(el => {
      if (el.type === "checkbox") {
        el.checked = !!data[el.id];
      } else if (el.type === "radio") {
        if (el.id === data.displayTheme) el.checked = true;
      }
    });
  });

  // 2. Bei jeder Änderung speichern
  fields.forEach(el => {
    el.addEventListener("change", () => {
      if (el.type === "checkbox") {
        chrome.storage.local.set({ [el.id]: el.checked });
      } else if (el.type === "radio" && el.checked) {
        chrome.storage.local.set({ displayTheme: el.id });
      }
    });
  });

  // Neu: Bei jeder Checkbox-Änderung → speichern + sofort ans Content-Script senden
checkboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    const key = checkbox.id;
    const value = checkbox.checked;

    // 1. Speichern (wie bisher)
    chrome.storage.local.set({ [key]: value });

    // 2. Sofort ans aktive Tab senden
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