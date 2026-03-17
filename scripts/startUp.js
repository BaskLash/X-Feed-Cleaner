function startUp() {
  // Start - Remove stuff from navigation
  const blueDot = document.querySelector(
    "div[aria-label='undefined unread items']"
  );
  if (blueDot) {
    blueDot.style.display = "none";
  }
  const grok = document.querySelector(
    'a[href="/i/grok"][aria-label="Grok"][role="link"]'
  );
  if (grok) {
    grok.style.display = "none";
  }
  const premium = document.querySelector(
    'a[href="/i/premium_sign_up"][aria-label="Premium"][role="link"]'
  );
  if (premium) {
    premium.style.display = "none";
  }
  const verifiedOrgs = document.querySelector(
    'a[href="/i/verified-orgs-signup"][aria-label="Verified Orgs"][role="link"]'
  );
  if (verifiedOrgs) {
    verifiedOrgs.style.display = "none";
  }
  const notifications = document.querySelector(
    'a[href="/notifications"][aria-label="Notifications"][role="link"]'
  );
  if (notifications) {
    notifications.style.display = "none";
  }
}
