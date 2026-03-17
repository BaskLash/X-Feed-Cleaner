function cheatBlocker() {
  if (window.location.pathname.startsWith("/notifications")) {
    window.location.href = "https://x.com/home";
  } else if (window.location.pathname.startsWith("/i/grok")) {
    window.location.href = "https://x.com/home";
  } else if (window.location.pathname.startsWith("/i/premium_sign_up")) {
    window.location.href = "https://x.com/home";
  } else if (window.location.pathname.startsWith("/i/verified-orgs-signup")) {
    window.location.href = "https://x.com/home";
  }
}
