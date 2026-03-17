function communitiesExplore() {
  console.log("Your exploring the communities!");
  const tablist = document.querySelector(
    'div[role="tablist"][data-testid="ScrollSnap-List"'
  );
  if (tablist) {
    tablist.style.visibility="hidden";
  }

  // If you don't follow any community
  const homeTimeline = document.querySelector(
    'div[aria-label="Home timeline"]'
  );

  if (homeTimeline) {
    const thirdDiv = homeTimeline.children[2]; // Access the third child element

    // Now you can manipulate the third div as needed:
    thirdDiv.style.visibility="hidden";
    // https://www.loom.com/share/bc6cef219ef641d9b6a80726e7775ef6?sid=004d8f79-4fdb-4474-893c-25436ebacf37
  } else {
    console.log("Home timeline div not found.");
  }

  const section = document.querySelector('section[role="region"]');
  if (section) {
    section.style.visibility="hidden";
  }
}
