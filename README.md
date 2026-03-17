<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="github.com/olivier.luethy/TackPad.git">
    <img src="logo.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">X-Feed-Cleaner</h3>
  <h4 align="center">Google Extension to make X Feed look cleaner</h4>

  <p align="center">
    Here'll I explain everything
    <br />
    <a href="github.com/olivierluethy/X-Feed-Cleaner/blob/master/README.md"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/olivierluethy/X-Feed-Cleaner/">View Demo</a>
    ·
    <a href="https://github.com/olivierluethy/X-Feed-Cleaner/issues">Report Bug</a>
    ·
    <a href="https://github.com/olivierluethy/X-Feed-Cleaner/issues">Request Feature</a>
  </p>
</p>

X-Feed-Cleaner is a lightweight Google Chrome extension designed to provide a clean and distraction-free experience on X.com (formerly Twitter). It allows users to hide unwanted elements like the home feed, trends, premium subscriptions, and "Live on X" sections, enhancing focus and reducing distractions.

---

## Table of Contents
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#Introduction">Introduction</a>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#installation">Installation</a>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li>
      <a href="#development">Development</a>
    </li>
    <li>
      <a href="#license">License</a>
    </li>
    <li>
      <a href="#contributing">Contributing</a>
    </li>
    <li>
      <a href="#support">Support</a>
    </li>
    <li>
      <a href="#changelog">Changelog</a>
    </li>
  </ol>
</details>

---

## Introduction

**X-Feed-Cleaner** is a Google Chrome extension that helps users customize their experience on X.com by hiding distracting or irrelevant sections from their view. Whether you're browsing your feed, viewing trends, or checking live updates, this extension ensures that you only see the content that matters to you.

---

## Features

- Hide the main feed (Home Timeline)
- Remove "Subscribe to Premium" advertisements
- Disable the "Live on X" section
- Eliminate "Trends for you" from the sidebar
- Dynamic observation to ensure elements remain hidden even when the page updates

---

## Installation

Follow these steps to install the **X-Feed-Cleaner** extension in Google Chrome:

1. **Download the extension:**
   - Clone the repository or download the ZIP file and extract it.
   ```bash
   git clone https://github.com/olivierluethy/X-Feed-Cleaner.git

2. **Open Chrome Extensions:**
Navigate to chrome://extensions/ in your Chrome browser.
3. **Enable Developer Mode:**
In the top right corner of the extensions page, toggle on "Developer mode."
4. **Load Unpacked Extension:**
Click on "Load unpacked" and select the folder where you downloaded/extracted the extension.
5. **Activate the Extension:**
Once loaded, ensure the extension is active and ready to clean your X.com feed.

## Usage
Once installed, X-Feed-Cleaner runs automatically when you visit X.com. The extension dynamically hides the following elements:

| Element | Path Condition  | Action Taken                      |
|------------------------------------|-----------------|-----------------------------------|
| Home Feed (Timeline)               | `/home`         | Hidden                            |
| Subscribe to Premium Section       | `/home`         | Hidden                            |
| Live on X Section                  | Any page        | Hidden                            |
| Trends for You                     | Any page        | Hidden                            |

### How It Works
- The extension checks the page path to determine which elements to hide.
- It utilizes DOM selectors to identify and hide sections based on their `aria-label`, `data-testid`, and other attributes.
- A `MutationObserver` is implemented to monitor dynamic changes and hide newly loaded elements in real-time.

### To Temporarily Disable:
1. Navigate to `chrome://extensions/`.
2. Locate **X-Feed-Cleaner** and toggle it off.

## Development

If you are interested in contributing to the development of **X-Feed-Cleaner**, follow these steps:

### Prerequisites:
- Ensure you have **Node.js** and **npm** installed.
- Install **Chrome Extensions APIs** if you're building advanced features.

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/olivierluethy/X-Feed-Cleaner.git

2. Open the project in your preferred code editor.

3. Modify the `content.js` file to add or adjust the hiding behavior for specific elements on X.com.

4. Load the unpacked extension (as detailed in the [Installation](#installation) section).

5. Test the extension on X.com to ensure your changes are working as intended.

---

**License**

**X-Feed-Cleaner** is licensed under the permissive [MIT License](./LICENSE). This license grants you the freedom to use, modify, and distribute the software for any purpose, commercial or non-commercial. 

**Contributing**

We encourage contributions to improve **X-Feed-Cleaner**! Here's how to get involved:

1. **Fork the repository:** Create your own copy of the project on GitHub.
2. **Create a branch:** This isolates your changes from the main project code. 
   ```bash
   git checkout -b main
   ```
3. **Make your changes:** Implement your feature or fix the bug.
4. **Commit your changes:** Use a clear commit message describing your work.
   ```bash
   git commit -m "Add feature: Description of your feature"
   ```
5. **Push your branch:** Share your changes with the project.
   ```bash
   git push origin main
   ```
6. **Open a Pull Request:** This lets the maintainers review your contribution.

**Remember to:**

* Follow the project's coding style for consistency.
* Write unit tests to ensure your changes don't break existing functionality.

**Getting Help**

If you encounter issues or have questions, feel free to:

* Open a new issue on the GitHub repository. 
* Reach out to the project maintainers directly.

**Changelog**

**v1.0.0 (Initial Release)**

* This is the first official release of **X-Feed-Cleaner**.
* Key features include:
    * Hiding the main feed (Home Timeline)
    * Removing "Subscribe to Premium" ads
    * Disabling "Live on X" notifications
    * Eliminating "Trends for you"

**Improvements**

* The license information is concise and informative.
* The contributing section guides users with clear steps and best practices.
* The getting help section provides multiple options for users to reach support.
* The changelog follows a clear format with version number and key features.


---

### Explanation:
1. **Table of Contents**: Provides a structured overview for easy navigation.
2. **Installation**: Step-by-step guide for installing the Chrome extension.
3. **Features**: Lists the primary features with a table detailing what elements are hidden.
4. **Development**: Instructions for developers to contribute or modify the code.
5. **License**: MIT License for open-source usage.
6. **Contributing**: Guidelines for contributors, including git commands.
7. **Support and Changelog**: Information for user support and version tracking.

### Used Links
1. Die Map wurde mittels mapbox.com erstellt.
https://api.mapbox.com/styles/v1/mapbox/dark-v11.html?title=true&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA#9.79/47.0252/8.3531
<br>

2. Notification icon
https://www.freepik.com/free-photo/chat-message-blue-speech-bubble-icon-with-bell-notification-alert-notice-reminder-symbol-conversation-button-icon-symbol-background-3d-illustration_33175351.htm#fromView=search&page=1&position=14&uuid=ab4a27bf-3ebf-4bfd-9350-3930fe658c2d
<br>

3. Wurde als URL Redirect Icon genutzt
https://images.app.goo.gl/i1kKj5UBJLrdfEHC9
<br>

4. Hat zum Thank You Part beim Update dazu beigetragen
https://images.app.goo.gl/XrtuwbS3wkdPUDgX6
<br>

5. Wurde für das Bild bei Thank You Part beim Update dazu beigetragen 
https://www.shutterstock.com/image-photo/happy-man-standing-sunrise-lifting-260nw-2079258889.jpg
<br>

6. Um dem Bild die genaue Grösse zu geben und herunterzuladen
https://imageresizer.com/
<br>

7. HTML und CSS Template das für Update und Installation genutzt wurde
https://www.free-css.com/free-css-templates/page288/global