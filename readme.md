# Live CSS & JS Tester Chrome Extension

A powerful Chrome extension for web developers and designers that allows you to test CSS and JavaScript code live on any website with pin functionality and auto-apply features after page refresh.

## Features

### 🎨 CSS Tab
- **Live CSS Testing**: Write and test CSS code in real-time
- **Auto-apply on typing**: CSS changes apply automatically as you type (with debouncing)
- **Pin functionality**: Pin your CSS to auto-apply on every page refresh
- **Enable/Disable toggle**: Quickly turn CSS live mode on/off
- **Syntax highlighting**: Clean code editor with monospace font

### ⚡ JavaScript Tab
- **Live JavaScript Testing**: Execute JavaScript code on the current page
- **Console output**: See console.log, errors, and warnings in the extension
- **Pin functionality**: Pin your JavaScript to auto-execute on every page refresh
- **Enable/Disable toggle**: Control when JavaScript executes
- **Error handling**: Comprehensive error catching and display

### 🔧 General Features
- **Domain-specific settings**: Each website remembers its own code and settings
- **Persistent storage**: Your code and preferences are saved automatically
- **Visual feedback**: Status updates and timestamps for all actions
- **Clean UI**: Modern, responsive design with smooth animations
- **Badge indicators**: Extension icon shows active pinned code status

## Installation

### Option 1: Install from Chrome Web Store (Recommended)
*Coming soon - extension will be published to the Chrome Web Store*

### Option 2: Manual Installation (Developer Mode)

1. **Download the Extension Files**
   - Download all the files from this repository
   - Create a new folder called `live-css-js-tester`
   - Place all files in this folder

2. **Required Files Structure**
   ```
   live-css-js-tester/
   ├── manifest.json
   ├── popup.html
   ├── popup.css
   ├── popup.js
   ├── content.js
   ├── background.js
   ├── icons/
   │   ├── icon16.png
   │   ├── icon32.png
   │   ├── icon48.png
   │   └── icon128.png
   └── README.md
   ```

3. **Create Extension Icons**
   - Create an `icons` folder
   - Add icon files in PNG format (16x16, 32x32, 48x48, 128x128 pixels)
   - You can use any icon design tool or download free developer icons online

4. **Enable Developer Mode in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle on "Developer mode" in the top-right corner

5. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `live-css-js-tester` folder
   - The extension will be installed and appear in your extensions list

6. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Live CSS & JS Tester" and click the pin icon

## Usage Guide

### Getting Started
1. Click the extension icon in your Chrome toolbar
2. The popup will show the current website's domain
3. Choose between CSS and JavaScript tabs

### CSS Testing
1. **Switch to CSS tab**
2. **Enable live mode** (enabled by default)
3. **Write your CSS** in the editor
4. **See changes immediately** on the webpage
5. **Pin your CSS** to auto-apply after refresh
6. **Use Apply CSS button** for manual application

**Example CSS:**
```css
/* Change background color */
body {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
}

/* Highlight all links */
a {
    background-color: yellow !important;
    padding: 2px 4px !important;
    border-radius: 3px !important;
}
```

### JavaScript Testing
1. **Switch to JavaScript tab**
2. **Enable live mode** (enabled by default)
3. **Write your JavaScript** in the editor
4. **Click "Run JavaScript"** to execute
5. **Check console output** below the editor
6. **Pin your JS** to auto-execute after refresh

**Example JavaScript:**
```javascript
// Add a floating message
const message = document.createElement('div');
message.innerHTML = 'Hello from Live JS Tester!';
message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
`;
document.body.appendChild(message);

// Log to console
console.log('JavaScript executed successfully!');

// Remove message after 5 seconds
setTimeout(() => message.remove(), 5000);
```

### Pin Functionality
- **Pin your code** using the toggle switches
- **Pinned code automatically applies** when you refresh the page or navigate
- **Each domain remembers** its own pinned code
- **Badge indicator** shows which sites have pinned code (CSS, JS, or both)

### Enable/Disable Toggles
- **CSS Live**: Controls whether CSS applies as you type
- **JS Live**: Controls whether JavaScript is in live mode
- **Pin toggles**: Controls auto-application after refresh

## Tips and Best Practices

### CSS Tips
- Use `!important` to override existing styles when needed
- Test responsive designs by resizing the browser window
- Use CSS transitions for smooth effects
- Be careful with `position: fixed` elements

### JavaScript Tips
- Always test your code before pinning it
- Use `console.log()` to debug your scripts
- Be mindful of page load timing when using pinned JS
- Avoid infinite loops that could crash the browser

### Performance Tips
- Keep CSS and JS code lightweight
- Use debouncing for expensive operations
- Clear unused code to avoid memory leaks
- Test on different websites to ensure compatibility

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Apply CSS or run JavaScript
- **Tab**: Switch between CSS and JS tabs (when popup is focused)
- **Ctrl/Cmd + K**: Clear current editor

## Troubleshooting

### Common Issues

**Extension not working on some sites:**
- Some sites have strict Content Security Policy (CSP)
- Chrome extensions pages (chrome://) are restricted
- Try on different websites

**CSS not applying:**
- Check if live mode is enabled
- Verify CSS syntax is correct
- Try using `!important` for specificity
- Clear the CSS and reapply

**JavaScript not executing:**
- Check console output for errors
- Verify JavaScript syntax
- Make sure live mode is enabled
- Try simpler code first

**Pinned code not auto-applying:**
- Check if pin toggle is enabled
- Refresh the page completely
- Verify the domain settings are correct

### Reset Extension
To reset all extension data:
1. Go to `chrome://extensions/`
2. Find "Live CSS & JS Tester"
3. Click "Remove" and reinstall
4. Or clear browser storage data

## Privacy & Security

### Data Storage
- All code and settings are stored locally in your browser
- No data is sent to external servers
- Each website's settings are stored separately
- Data persists until you clear browser storage or uninstall

### Security Features
- Code execution is sandboxed within the browser
- CSS and JS are applied only to the current tab
- No access to sensitive browser data
- No network requests made by the extension

### Permissions Explained
- **activeTab**: Access current webpage to apply CSS/JS
- **storage**: Save your code and settings locally
- **scripting**: Execute CSS and JS on webpages

## Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** by creating GitHub issues
2. **Suggest features** for future updates
3. **Submit pull requests** with improvements
4. **Share feedback** on user experience

### Development Setup
1. Clone this repository
2. Make your changes
3. Test thoroughly on multiple websites
4. Submit a pull request with detailed description

## Version History

### v1.0.0 (Current)
- Initial release
- CSS and JavaScript live testing
- Pin functionality with auto-apply
- Domain-specific settings
- Console output for JavaScript
- Modern UI with animations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, bug reports, or feature requests:
- Create an issue on GitHub
- Email: [your-email@example.com]
- Documentation: [GitHub Wiki link]

---

**Happy coding! 🚀**

*Made with ❤️ for web developers and designers*