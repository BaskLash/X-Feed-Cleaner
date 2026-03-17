function stopWatchToggle() {
  /* Responsible for Chrome Storage and Toggle Update */
  let stopwatchInterval;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;
  let isStopwatchRunning = false;

  function updateStopwatch() {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes >= 60) {
      minutes = 0;
      hours++;
    }

    // Zeit in der Konsole ausgeben
    const timeString = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    console.log(timeString);

    // Zeit im Chrome-Storage speichern
    storeWastedTime();
  }

  function timeStringToSeconds(timeString) {
    const [h, m, s] = timeString.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  }

  function secondsToTimeString(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  }

  let lastLoggedSeconds = 0; // Speichert die letzte geloggte Zeit (für Differenzen)

  function storeWastedTime() {
    const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
    const currentTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

    // Calculate the difference to the last logged time
    const deltaTimeInSeconds = currentTimeInSeconds - lastLoggedSeconds;

    // Check if the delta time is at least 1 second
    if (deltaTimeInSeconds >= 1) {
      // Retrieve existing data and update it
      chrome.storage.local.get(["wastedTime"], (res) => {
        const wastedTime = res.wastedTime || {};
        const previousTime = wastedTime[today]
          ? timeStringToSeconds(wastedTime[today])
          : 0;

        // Add the new time difference
        const newTimeInSeconds = previousTime + deltaTimeInSeconds;
        wastedTime[today] = secondsToTimeString(newTimeInSeconds);

        // Save and update `lastLoggedSeconds`
        chrome.storage.local.set({ wastedTime }, () => {
          console.log("Updated wastedTime:", wastedTime);
          lastLoggedSeconds = currentTimeInSeconds; // Update the last logged time
        });
      });
    } else {
      console.log(
        "Time not sufficient to log. Delta time is less than 1 second."
      );
    }
  }

  function toggleFeed(hideFeed) {
    if (!hideFeed && window.location.pathname.match(/\/status\/\d+/)) {
      window.location.href = "https://x.com/home";
    }
    const path = window.location.pathname;
    const isHomePage = window.location.pathname === "/home";
    const isStatusPage = window.location.pathname.match(/\/status\/\d+/);
    const isUserOverview = /^\/[^/]+$/.test(path);
    const isBookmarkPage = window.location.pathname === "/i/bookmarks";

    if (isHomePage) {
      const feedElement = document.querySelector(
        '[aria-label="Timeline: Your Home Timeline"]'
      );

      if (feedElement) {
        feedElement.style.visibility = hideFeed ? "visible" : "hidden";
      }
    }

    if (isBookmarkPage) {
      const thirdElement = document.querySelector(
        'div[aria-label="Home timeline"] > *:nth-child(3)'
      );
      if (thirdElement) {
        thirdElement.style.visibility = hideFeed ? "visible" : "hidden";
      }
    }

    handleStopwatch(
      hideFeed,
      isHomePage || isStatusPage || isUserOverview || isBookmarkPage
    );
  }

  function handleStopwatch(hideFeed, isRelevantPage) {
    if (isRelevantPage) {
      if (hideFeed) {
        const editProfileButton = document.querySelector(
          "[role='link'][data-testid='editProfileButton']"
        );
        /* Prüfen, ob sich der Benutzer in seinem eigenen Profil befindet. Wenn dies der Fall ist, sollte die Zeit natürlich nicht gemessen werden. */
        if (!editProfileButton) {
          stopStopwatch();
          startStopwatch();
        } else {
          stopStopwatch();
        }
      } else {
        stopStopwatch();
      }
    } else {
      stopStopwatch(); // Ensure the stopwatch is stopped when conditions are not met
    }
  }

  function stopStopwatch() {
    if (isStopwatchRunning) {
      clearInterval(stopwatchInterval);
      isStopwatchRunning = false;

      // Letztes Update, bevor die Stoppuhr gestoppt wird
      storeWastedTime();
      console.log("Stopwatch gestoppt");
    }
  }

  function startStopwatch() {
    if (!isStopwatchRunning) {
      isStopwatchRunning = true;
      stopwatchInterval = setInterval(updateStopwatch, 1000);
      console.log("Stopwatch gestartet");
    }
  }

  // Funktion zur Initialisierung des MutationObservers für das Feed-Element
  function observeDOMForFeed() {
    const observer = new MutationObserver(() => {
      chrome.storage.local.get(["hideFeed"], (res) => {
        const hideFeed = res.hideFeed ?? false;
        toggleFeed(hideFeed);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Initialen Wert aus dem Storage abrufen und den Feed sofort anpassen
  chrome.storage.local.get(["hideFeed"], (res) => {
    const hideFeed = res.hideFeed ?? false;
    toggleFeed(hideFeed);
    observeDOMForFeed();
  });

  // Echtzeit-Überwachung von Änderungen im Storage
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.hideFeed) {
      toggleFeed(changes.hideFeed.newValue);
    }
  });
}
