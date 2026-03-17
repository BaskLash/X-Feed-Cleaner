// Function to update the document title and favicon
function updateTitleAndFavicon() {
  // Update the document title by removing the pattern (number)
  if (/\(\d+\)/.test(document.title)) {
    document.title = document.title.replace(/\s*\(\d+\)/g, "");
  }

  // Change the favicon
  const newFaviconUrl = "favicon.ico"; // Replace with your favicon URL
  let link =
    document.querySelector("link[rel='icon']") ||
    document.createElement("link");

  link.type = "image/x-icon";
  link.rel = "icon";
  link.href = newFaviconUrl;

  // Remove the existing favicon link if it exists
  if (document.head.contains(link)) {
    document.head.removeChild(link);
  }

  // Append the link to the head
  document.head.appendChild(link);
}