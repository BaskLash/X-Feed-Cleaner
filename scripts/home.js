function homePart() {
  // Hide the "Subscribe to Premium" section
  const premium = document.querySelector(
    '[aria-label="Subscribe to Premium"], div[aria-labelledby*="Subscribe"]'
  );
  if (premium) {
    premium.style.display = "none";
  }

  const removeNotifyButton = document.querySelector(
    `[aria-label="New posts are available. Push the period key to go to the them."]`
  );
  if (removeNotifyButton) {
    removeNotifyButton.style.display = "none";
  }

  // ScrollSnap-next Button Wrapper Right
  const rightNext = document.querySelector(
    '[data-testid="ScrollSnap-nextButtonWrapper"'
  );
  if (rightNext) {
    rightNext.style.display = "none";
  }

  // ScrollSnap-next Button Wrapper Left
  const leftNext = document.querySelector(
    '[data-testid="ScrollSnap-prevButtonWrapper"'
  );
  if (leftNext) {
    leftNext.style.display = "none";
  }

  // Finde das Div mit der Rolle "tablist"
  const tabList = document.querySelector('[role="tablist"]');

  // Überprüfe, ob das Element gefunden wurde
  if (tabList) {
    // Finde alle Kind-Elemente mit der Rolle "presentation"
    const allTabs = tabList.querySelectorAll('[role="presentation"]');

    // Überprüfe, ob mindestens zwei Tabs gefunden wurden
    if (allTabs.length >= 2) {
      // Wähle den zweiten Tab aus (Index 1, da Arrays bei 0 beginnen)
      const firstTab = allTabs[0];
      if (firstTab) {
        firstTab.style.display = "none";
      }
      const thirdTab = allTabs[2];
      if (thirdTab) {
        thirdTab.style.display = "none";
      }
    } else {
      console.error("Es wurden nicht genügend Tabs gefunden.");
    }
  } else {
    console.error('Kein Element mit role="tablist" gefunden.');
  }
}