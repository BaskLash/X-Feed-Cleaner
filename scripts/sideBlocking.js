function sideBlock() {
  // Hide the "Live on X" section
  const liveOnX = document.querySelector(
    'section[aria-labelledby*="Live"], div[aria-label="Live"]'
  );
  if (liveOnX) {
    liveOnX.style.display = "none";
  }

  // Hide the "Trends for you" section
  const trends = document.querySelector(
    'section[aria-labelledby*="Trends"], div[data-testid="sidebarColumn"]'
  );
  if (trends) {
    trends.style.display = "none";
  }
}
