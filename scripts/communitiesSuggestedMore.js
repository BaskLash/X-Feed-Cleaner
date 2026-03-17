function communitiesSuggestedMore() {
  function hideElements() {
    // Find the main div with aria-label="Home timeline"
    const homeTimelineDiv = document.querySelector(
      '[aria-label="Home timeline"]'
    );

    if (homeTimelineDiv) {
      // Hide the 3rd div
      const thirdDiv = homeTimelineDiv.children[2];
      if (thirdDiv) {
        thirdDiv.style.display = "block";
      }

      // Hide the 4th div
      const fourthDiv = homeTimelineDiv.children[3];
      if (fourthDiv) {
        fourthDiv.style.display = "block";
      }

      // Hide the section element
      const sectionElement = homeTimelineDiv.querySelector("section");
      if (sectionElement) {
        sectionElement.style.display = "block";
      }

      const tablist = document.querySelector("[role='tablist']");
      if (tablist) {
        tablist.style.display = "none";
      }
    } else {
      console.log("Home timeline div not found.");
    }
  }

  // Wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", hideElements);

  // Use a MutationObserver to handle dynamically loaded content
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        hideElements(); // Re-run the hiding logic
      }
    }
  });

  // Observe the document for changes
  observer.observe(document.body, { childList: true, subtree: true });
}
