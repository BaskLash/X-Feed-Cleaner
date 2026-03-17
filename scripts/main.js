// X Customizer – Content Script

const STYLE_ID = 'x-customizer-main';
const DIM_STYLE_ID = 'x-customizer-dim';

// CSS selectors for each feature that can be hidden via injected stylesheet
const FEATURE_SELECTORS = {
  hideGrok:                '[data-testid="AppTabBar_Grok_Link"]',
  hideNotifications:       '[data-testid="AppTabBar_Notifications_Link"]',
  hideExplore:             '[data-testid="AppTabBar_Explore_Link"]',
  hidePremiumNav:          '[data-testid="AppTabBar_Premium_Link"], [href="/i/premium_sign_up"]',
  hideFollow:              '[data-testid="who-to-follow-module"], [data-testid="sidebarColumn"] [data-testid="UserCell"]',
  hideTrends:              '[data-testid="sidebarColumn"] [data-testid="trend"], [data-testid="sidebarColumn"] section[aria-label*="rending"]',
  hideLive:                '[data-testid="liveVideoCard"]',
  hideCommunitySuggestions:'[data-testid="communityCell"]',
  hidePremiumBanner:       '[data-testid="subscribe-cta"], [data-testid="upsell-card"], [data-testid="UserPremiumSignupButton"]',
  hideNewPosts:            '[data-testid="pillLabel"]',
};

const ALL_KEYS = [
  'extensionEnabled',
  'autoFollowing', 'hideReposts', 'hideNewPosts', 'hidePremiumBanner',
  'hideNotifications', 'hideExplore', 'hideGrok', 'hidePremiumNav', 'hideFollow',
  'hideTrends', 'hideLive', 'hideCommunitySuggestions',
  'removeTitleCounter', 'dimMode',
];

// ── Current settings (kept in sync with storage) ───────────────────────────
let currentSettings = {};

// ── Stylesheet injection ───────────────────────────────────────────────────
function getOrCreateStyle(id) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
}

function buildHideCSS(settings) {
  return Object.entries(FEATURE_SELECTORS)
    .filter(([key]) => settings[key] === true)
    .map(([, selector]) => `${selector} { display: none !important; }`)
    .join('\n');
}

// ── Dim mode (applies a dimmer dark background to X.com) ───────────────────
function applyDimMode(enable) {
  const el = document.getElementById(DIM_STYLE_ID);
  if (enable) {
    const style = el || document.createElement('style');
    style.id = DIM_STYLE_ID;
    style.textContent = `
      body { background-color: #15202b !important; }
      [data-testid="primaryColumn"] { background-color: #15202b !important; }
      [data-testid="sidebarColumn"] > div { background-color: #15202b !important; }
      [data-testid="DashboardHeader"] { background-color: #15202b !important; }
    `;
    if (!el) document.head.appendChild(style);
  } else if (el) {
    el.remove();
  }
}

// ── Notification counter removal from page title ───────────────────────────
let titleObserver = null;

function applyTitleCounter(remove) {
  const cleanTitle = () => {
    document.title = document.title.replace(/^\(\d+\+?\)\s*/, '');
  };
  if (remove) {
    cleanTitle();
    if (!titleObserver) {
      const titleEl = document.querySelector('title');
      if (titleEl) {
        titleObserver = new MutationObserver(cleanTitle);
        titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
      }
    }
  } else {
    titleObserver?.disconnect();
    titleObserver = null;
  }
}

// ── Auto Following: switch to the "Following" tab on /home ─────────────────
function applyAutoFollowing(enable) {
  if (!enable || window.location.pathname !== '/home') return;
  const tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach(tab => {
    if (tab.textContent.trim() === 'Following' && tab.getAttribute('aria-selected') !== 'true') {
      tab.click();
    }
  });
}

// ── Hide reposts: requires text inspection so CSS alone isn't enough ────────
function applyHideReposts(hide) {
  document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach(cell => {
    const socialCtx = cell.querySelector('[data-testid="socialContext"]');
    if (socialCtx) {
      const isRepost = socialCtx.textContent.toLowerCase().includes('repost') ||
                       socialCtx.textContent.toLowerCase().includes('retweet');
      if (isRepost) cell.style.display = hide ? 'none' : '';
    }
  });
}

// ── Restore all inline styles set by applyHideReposts ──────────────────────
function restoreReposts() {
  document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach(cell => {
    cell.style.display = '';
  });
}

// ── Central apply function ─────────────────────────────────────────────────
function applySettings(settings) {
  const enabled = settings.extensionEnabled !== false;

  const mainStyle = getOrCreateStyle(STYLE_ID);

  if (!enabled) {
    mainStyle.textContent = '';
    restoreReposts();
    applyDimMode(false);
    applyTitleCounter(false);
    return;
  }

  mainStyle.textContent = buildHideCSS(settings);
  applyHideReposts(settings.hideReposts === true);
  applyDimMode(settings.dimMode === true);
  applyTitleCounter(settings.removeTitleCounter === true);
  applyAutoFollowing(settings.autoFollowing === true);
}

// ── MutationObserver: re-apply JS-only features when DOM updates ───────────
let repostTimer = null;
let followingTimer = null;

const domObserver = new MutationObserver((mutations) => {
  const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
  if (!hasNewNodes || currentSettings.extensionEnabled === false) return;

  if (currentSettings.hideReposts === true) {
    clearTimeout(repostTimer);
    repostTimer = setTimeout(() => applyHideReposts(true), 150);
  }

  if (currentSettings.autoFollowing === true) {
    clearTimeout(followingTimer);
    followingTimer = setTimeout(() => applyAutoFollowing(true), 300);
  }
});

// ── Initialize ─────────────────────────────────────────────────────────────
chrome.storage.local.get(ALL_KEYS, (settings) => {
  currentSettings = settings;
  applySettings(settings);
  domObserver.observe(document.body, { childList: true, subtree: true });
});

// ── Listen for messages from the popup ────────────────────────────────────
chrome.runtime.onMessage.addListener((message) => {
  if (message?.action !== 'toggleSetting') return;
  chrome.storage.local.get(ALL_KEYS, (settings) => {
    currentSettings = settings;
    applySettings(settings);
  });
});

// ── Keep in sync with storage changes from other contexts ─────────────────
chrome.storage.onChanged.addListener(() => {
  chrome.storage.local.get(ALL_KEYS, (settings) => {
    currentSettings = settings;
    applySettings(settings);
  });
});
