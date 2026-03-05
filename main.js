const intervalId = setInterval(() => {
  // Always in use; That's why on top
  const path = window.location.pathname;
  // Call the function
  updateTitleAndFavicon();
  startUp();

  // Only hide if the user is on the Home Feed
  if (path === "/home") {
    // Jump to "following" page
    autoClickOnce();
    homePart();
  }
  // Only hide if the user is on the Explore Page
  if (path === "/explore") {
    const tabList = document.querySelector(
      'div[role="tablist"][data-testid="ScrollSnap-List"]'
    );
    if (tabList) {
      tabList.style.visibility = "hidden";
    }

    const feed = document.querySelector('div[aria-label="Timeline: Explore"]');
    if (feed) {
      feed.style.visibility = "hidden";
    }
  }
  // Check if the path matches the pattern
  if (/^\/[^/]+\/communities\/explore/.test(path)) {
    console.log("community explorating");
    communitiesExplore();
  }
  // Check if the user is on profile section content overview
  if (/^\/[^\/]+\/?$/.test(path)) {
    chrome.storage.local.get(["hideFeed"], (res) => {
      const hideFeed = res.hideFeed ?? false;

      const currentUrl = window.location.href;

      if (!hideFeed) {
        if (
          currentUrl !== "https://x.com/home" &&
          currentUrl !== "https://x.com/explore" &&
          currentUrl !== "https://x.com/i" &&
          currentUrl !== "https://x.com/messages" &&
          currentUrl !== "https://x.com/jobs" &&
          currentUrl != "https://x.com/logout"
        ) {
          const editProfileButton = document.querySelector(
            "[role='link'][data-testid='editProfileButton']"
          );

          /* Überprüfe ob der "Edit profile" Knopf vorhanden ist zum unterscheiden zwischen eingeloggtem Profil und besuchtem Profil */
          if (!editProfileButton) {
            window.location.href = "https://x.com/home";
          }
        }
      }
    });
  }
  // If you follow a community
  if (/^\/[^/]+\/communities\/?$/.test(path)) {
    console.log("This is a community");
    const tabList = document.querySelector(
      'div[role="tablist"][data-testid="ScrollSnap-List"]'
    );
    if (tabList) {
      tabList.style.display = "none";
    }
  }
  // If someone jumps to a post, redirect to normal page
  if (window.location.pathname.match(/\/status\/\d+/)) {
    chrome.storage.local.get(["hideFeed"], (res) => {
      const hideFeed = res.hideFeed ?? false;
      if (!hideFeed) {
        window.location.href = "https://x.com/home";
      }
    });
  }
  // Remove community suggestion including their representing content
  if (window.location.href.includes("x.com/i/communities/suggested")) {
    console.log("community Suggestions");
    communitySuggestions();
  }
  // Display community suggestions while you're searching for one
  if (window.location.href.includes("x.com/i/communities/suggested?q=")) {
    console.log("community Suggestions while search");
    communitiesSuggestedMore();
  }
  sideBlock();
}, 1000); // Check every 1 second