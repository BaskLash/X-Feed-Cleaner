'use strict';

// ─── Selectors ────────────────────────────────────────────────────────────────
// Maps each popup setting key to the CSS selector(s) it controls.
const TOGGLE_SELECTORS = {
  hideGrok:                '[data-testid="AppTabBar_Grok_Link"]',
  hideFollow:              '[aria-label="Follow"]',
  hideNotifications:       '[data-testid="AppTabBar_Notifications_Link"]',
  hideExplore:             '[data-testid="AppTabBar_Explore_Link"]',
  hidePremiumNav:          '[href="/i/premium_sign_up"]',
  hideTrends:              '[aria-label="Timeline: Trending now"]',
  hideLive:                '[aria-label="Live on X"]',
  hidePremiumBanner:       '[data-testid="upsell-section"]',
  hideCommunitySuggestions:'[aria-label="Who to follow"]',
  hideNewPosts:            '[data-testid="pillLabel"]',
};

const DIM_STYLE_ID       = 'x-customizer-dim-style';
const REPOST_CONTEXT_SEL = '[data-testid="socialContext"]';
const TWEET_ARTICLE_SEL  = '[data-testid="tweet"]';

// ─── State ────────────────────────────────────────────────────────────────────
let currentSettings  = {};
let titleInterval    = null;
let domObserver      = null;
let rafPending       = false;

// Track which paths we have already redirected from this session,
// so we never redirect the same path twice (prevents redirect loops).
const redirectedPaths = new Set();

// ─── Entry point ──────────────────────────────────────────────────────────────
function init() {
  chrome.storage.local.get(null, (data) => {
    currentSettings = data;
    applyAll();
    startDomObserver();
    watchNavigation();
  });
}

// ─── Full apply (settings change or navigation) ───────────────────────────────
function applyAll() {
  const enabled = currentSettings.extensionEnabled !== false;

  if (!enabled) {
    restoreAll();
    return;
  }

  applyToggleSelectors();
  applyReposts();
  applyDimMode();
  applyTitleCounter();
  applyAutoFollowing();
  checkRedirects();
}

// ─── Restore everything to X default ─────────────────────────────────────────
function restoreAll() {
  Object.values(TOGGLE_SELECTORS).forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.removeProperty('display'));
  });

  document.querySelectorAll(TWEET_ARTICLE_SEL).forEach(el => {
    el.style.removeProperty('display');
  });

  document.getElementById(DIM_STYLE_ID)?.remove();

  if (titleInterval) {
    clearInterval(titleInterval);
    titleInterval = null;
  }
}

// ─── Element hiding ───────────────────────────────────────────────────────────
function applyToggleSelectors() {
  Object.entries(TOGGLE_SELECTORS).forEach(([key, selector]) => {
    const hide = currentSettings[key] === true;
    document.querySelectorAll(selector).forEach(el => {
      if (hide) {
        el.style.display = 'none';
      } else {
        el.style.removeProperty('display');
      }
    });
  });
}

function applyReposts() {
  const hide = currentSettings.hideReposts === true;
  document.querySelectorAll(TWEET_ARTICLE_SEL).forEach(article => {
    const isRepost = !!article.querySelector(REPOST_CONTEXT_SEL);
    if (isRepost) {
      if (hide) {
        article.style.display = 'none';
      } else {
        article.style.removeProperty('display');
      }
    }
  });
}

// ─── Dim mode (inject CSS into page) ─────────────────────────────────────────
function applyDimMode() {
  const isDim    = currentSettings.displayTheme === 'themeDim';
  const existing = document.getElementById(DIM_STYLE_ID);

  if (isDim && !existing) {
    const style = document.createElement('style');
    style.id = DIM_STYLE_ID;
    style.textContent = [
      'html, body { background-color: #15202b !important; }',
      '[data-testid="primaryColumn"] { background-color: #15202b !important; }',
      '[data-testid="sidebarColumn"] { background-color: #15202b !important; }',
    ].join('\n');
    document.head.appendChild(style);
  } else if (!isDim && existing) {
    existing.remove();
  }
}

// ─── Notification counter in title ───────────────────────────────────────────
function applyTitleCounter() {
  if (currentSettings.removeTitleCounter) {
    stripTitleCounter();
    if (!titleInterval) {
      titleInterval = setInterval(stripTitleCounter, 1000);
    }
  } else {
    if (titleInterval) {
      clearInterval(titleInterval);
      titleInterval = null;
    }
  }
}

function stripTitleCounter() {
  document.title = document.title.replace(/^\(\d+\+?\)\s*/, '');
}

// ─── Auto-switch to "Following" tab ──────────────────────────────────────────
function applyAutoFollowing() {
  if (!currentSettings.autoFollowing) return;
  if (window.location.pathname !== '/home') return;

  const followingTab = [...document.querySelectorAll('[role="tab"]')]
    .find(tab => tab.textContent.trim() === 'Following');

  if (followingTab && followingTab.getAttribute('aria-selected') !== 'true') {
    followingTab.click();
  }
}

// ─── Distraction redirects ────────────────────────────────────────────────────
// Redirect only fires once per unique path per session, preventing loops.
// Does NOT redirect from profile pages — only from /notifications and
// individual tweet status URLs (/user/status/id).
function checkRedirects() {
  const path = window.location.pathname;

  if (currentSettings.redirectFromNotifications && path === '/notifications') {
    if (!redirectedPaths.has(path)) {
      redirectedPaths.add(path);
      navigateToHome();
    }
    return;
  }

  // Only match tweet status pages, not profile pages
  if (currentSettings.redirectFromTweets && /^\/[^/]+\/status\/\d+/.test(path)) {
    if (!redirectedPaths.has(path)) {
      redirectedPaths.add(path);
      navigateToHome();
    }
  }
}

function navigateToHome() {
  // Prefer clicking X's internal home link to keep SPA navigation intact
  const homeLink = document.querySelector('[data-testid="AppTabBar_Home_Link"]');
  if (homeLink) {
    homeLink.click();
  } else {
    window.location.href = 'https://x.com/home';
  }
}

// ─── SPA navigation watcher ───────────────────────────────────────────────────
// X is a React SPA — the content script runs once but the URL changes via
// history.pushState. We intercept pushState/replaceState to re-apply settings.
function watchNavigation() {
  let lastPath = window.location.pathname;

  function onPathChange() {
    const current = window.location.pathname;
    if (current === lastPath) return;
    lastPath = current;
    // Clear redirect tracking on real navigation so each page is evaluated fresh
    redirectedPaths.clear();
    applyAll();
  }

  const origPush    = history.pushState.bind(history);
  const origReplace = history.replaceState.bind(history);

  history.pushState = function (...args) {
    origPush(...args);
    onPathChange();
  };

  history.replaceState = function (...args) {
    origReplace(...args);
    onPathChange();
  };

  window.addEventListener('popstate', onPathChange);
}

// ─── DOM observer (handles dynamically injected elements) ─────────────────────
function startDomObserver() {
  if (domObserver) domObserver.disconnect();

  domObserver = new MutationObserver(() => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      if (currentSettings.extensionEnabled !== false) {
        applyToggleSelectors();
        applyReposts();
        applyAutoFollowing();
      }
    });
  });

  domObserver.observe(document.body, { childList: true, subtree: true });
}

// ─── Settings change listeners ────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message) => {
  if (message?.action !== 'settingsChanged') return;
  chrome.storage.local.get(null, (data) => {
    currentSettings = data;
    redirectedPaths.clear();
    applyAll();
  });
});

chrome.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach(key => {
    currentSettings[key] = changes[key].newValue;
  });
  redirectedPaths.clear();
  applyAll();
});

// ─── Start ────────────────────────────────────────────────────────────────────
init();
