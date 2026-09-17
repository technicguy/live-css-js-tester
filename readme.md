# ⚡ Live CSS & JS Tester — Chrome Extension

**Live CSS & JS Tester** is a lightweight, high-performance Chrome Extension (Manifest V3) designed for web developers, UI/UX designers, and QA engineers to test, inject, and execute custom CSS and JavaScript live on any website in real-time.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-00fff2?style=for-the-badge)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📑 Table of Contents
- [Key Features](#-key-features)
- [Architecture & Manifest V3 Specs](#-architecture--manifest-v3-specs)
- [Installation Guide](#-installation-guide)
- [How to Use](#-how-to-use)
- [Domain-Specific Memory & Storage](#-domain-specific-memory--storage)
- [Project File Structure](#-project-file-structure)
- [Permissions & Privacy](#-permissions--privacy)
- [License](#-license)

---

## ✨ Key Features

### 🎨 Live CSS Injection
- **Real-Time Style Preview:** CSS rules apply instantly as you type (debounced to prevent layout thrashing).
- **Pin & Auto-Apply:** Pin your custom CSS to automatically re-inject it whenever you refresh or revisit the domain.
- **Global Toggle Switch:** Easily disable or enable custom styles with a single click.

### ⚡ Live JavaScript Execution
- **Instant Script Runner:** Execute custom JS code within the current tab's active DOM context.
- **Embedded Console Output Log:** Captures and displays `console.log`, warnings, and runtime errors directly in the popup UI.
- **Script Pinning:** Auto-execute specific scripts on page load for particular domains.

### 🧠 Domain-Specific Memory
- **Automatic Per-Domain Saving:** Keeps separate CSS/JS snippets for `github.com`, `google.com`, `localhost`, etc.
- **Active Badge Status:** Updates the extension toolbar icon with badge indicators showing if pinned code is currently active on the site.

---

## 💻 Architecture & Manifest V3 Specs

| Specification | Value / Technology |
| :--- | :--- |
| **Manifest Version** | `Manifest V3` |
| **Service Worker** | `background.js` (Manages badge updates & storage state) |
| **Content Script** | `content.js` (Injected at `document_start` for instant style application) |
| **Popup UI** | HTML5 + CSS3 + Monospaced Code Editor (`popup.html`, `popup.css`, `popup.js`) |
| **Storage API** | `chrome.storage.local` (Syncs domain snippets locally) |

---

## 🚀 Installation Guide

### Developer Mode Installation (Unpacked Extension)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/technicguy/live-css-js-tester.git
   ```

2. **Open Chrome Extensions Page:**
   Open Google Chrome and navigate to:
   ```text
   chrome://extensions/
   ```

3. **Enable Developer Mode:**
   Toggle on the **Developer mode** switch in the top-right corner of the Chrome page.

4. **Load Unpacked Extension:**
   - Click the **"Load unpacked"** button in the top left.
   - Select the `live-css-js-tester` folder.

5. **Pin to Toolbar:**
   Click the puzzle piece icon in Chrome's top-right toolbar and click the pin icon next to **Live CSS & JS Tester**.

---

## 📖 How to Use

### 1. Injecting Live CSS
1. Navigate to any website (e.g., `https://example.com`).
2. Click the **Live CSS & JS Tester** extension icon in your browser toolbar.
3. Select the **CSS Tab**.
4. Type your CSS rules:
   ```css
   body {
     background-color: #0f141e !important;
     color: #00fff2 !important;
   }
   ```
5. Toggle **Pin CSS** to keep this style active even after page refreshes.

### 2. Executing JavaScript
1. Switch to the **JS Tab** in the extension popup.
2. Enter your script:
   ```javascript
   console.log("DOM Loaded domain:", window.location.hostname);
   document.querySelectorAll("a").forEach(el => el.style.border = "1px solid red");
   ```
3. Click **Run JS**. View live logs in the bottom console panel.

---

## 📂 Project File Structure

```text
live-css-js-tester/
├── manifest.json      # Chrome Manifest V3 configuration & permission schema
├── background.js      # Background service worker for state management & badges
├── content.js         # Content script injected into web pages
├── popup.html         # Extension popup interface structure
├── popup.css          # Dark glassmorphism styling for popup editor
├── popup.js           # Logic, tab switching, debouncing, & storage handling
├── icons/             # App icons (16x16, 32x32, 48x48, 128x128)
└── README.md          # Project documentation
```

---

## 🔒 Permissions & Privacy

- `activeTab` & `scripting`: Required to inject CSS and execute JS safely on the tab you interact with.
- `storage`: Required to store your CSS/JS code snippets locally on your computer.
- **Zero Remote Tracking:** No analytics or external network calls are made. All snippets stay 100% on your local browser storage.

---

## 🌐 Contact & Support

For support, inquiries, or collaboration, feel free to reach out across any of these channels:

- 📧 **Email:** [technicguy@gmail.com](mailto:technicguy@gmail.com)
- 🌐 **Website:** [https://esanshar.com.np/](https://esanshar.com.np/)
- 📞 **Phone:** [+977 986 445 0173](tel:+9779864450173)
- 💬 **WhatsApp:** [+977 984 470 7950](https://wa.me/9779844707950)
- 💼 **LinkedIn:** [linkedin.com/in/technicguy](https://www.linkedin.com/in/technicguy/)
- 👤 **Facebook:** [facebook.com/imakashgc](https://www.facebook.com/imakashgc)

### 📺 YouTube Channels
- 🎵 **Sound & Frequency:** [Mystic Sound Journeys](https://www.youtube.com/@MysticSoundJourneys?sub_confirmation=1)
- 👶 **Kids Content:** [MummaBaba](https://www.youtube.com/@MummaBaba?sub_confirmation=1)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.