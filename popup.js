"use strict";

function updateToggleText(hideFeed) {
  const toggleElement = document.getElementById("toggOnOff");
  const switchElement = document.querySelector(".switch");
  toggleElement.innerHTML = hideFeed
    ? "Display Content <strong>On</strong>"
    : "Display Content <strong>Off</strong>";

  switchElement.title = hideFeed
    ? "View the content of the accounts you follow and bookmarks."
    : "Don't view any content.";
}

document.addEventListener("DOMContentLoaded", () => {
  const checkboxSubs = document.getElementById("checkbox-subs");

  // Initialen Wert aus dem Storage abrufen
  chrome.storage.local.get(["hideFeed"], (res) => {
    const hideFeed = res.hideFeed ?? false; // Setzt auf false, wenn nicht gesetzt
    checkboxSubs.checked = hideFeed;
    updateToggleText(hideFeed);
  });

  // Event Listener für Änderungen an der Checkbox
  checkboxSubs.addEventListener("change", () => {
    const isChecked = checkboxSubs.checked;
    chrome.storage.local.set({ hideFeed: isChecked }); // Speichern in Storage
    updateToggleText(isChecked); // Aktualisiere den Text sofort
  });

  setInterval(updateTodayTime, 1000);
});