// Simplified Background Script for Live CSS & JS Tester
'use strict';

// Configuration
const CONFIG = {
  autoApplyDelay: 1500, // Delay before auto-applying pinned code
  maxRetryAttempts: 2,
  retryDelay: 1000
};

// Initialize extension
chrome.runtime.onInstalled.addListener(handleInstallation);
chrome.tabs.onUpdated.addListener(handleTabUpdate);
chrome.runtime.onMessage.addListener(handleMessage);

// Handle extension installation
async function handleInstallation(details) {
  console.log('Live CSS Tester: Extension installed/updated');
  
  try {
    if (details.reason === 'install') {
      await setDefaultSettings();
    }
  } catch (error) {
    console.error('Live CSS Tester: Installation error:', error);
  }
}

// Set default settings
async function setDefaultSettings() {
  const defaultSettings = {
    version: chrome.runtime.getManifest().version,
    installDate: new Date().toISOString()
  };
  
  await chrome.storage.local.set({ extensionSettings: defaultSettings });
}

// Handle tab updates for auto-apply functionality
async function handleTabUpdate(tabId, changeInfo, tab) {
  // Only process complete page loads on valid URLs
  if (changeInfo.status !== 'complete' || !tab.url || isSpecialPage(tab.url)) {
    return;
  }
  
  try {
    await processTabUpdate(tabId, tab);
  } catch (error) {
    console.error(`Live CSS Tester: Tab update error for ${tabId}:`, error);
  }
}

// Process individual tab update for auto-apply
async function processTabUpdate(tabId, tab) {
  try {
    const settings = await getTabSettings(tab.url);
    
    if (settings && hasAutoApplyCode(settings)) {
      // Delay auto-apply to ensure page is fully loaded
      setTimeout(async () => {
        try {
          await autoApplyPinnedCode(tabId, settings);
          console.log(`Live CSS Tester: Auto-applied code for tab ${tabId}`);
        } catch (error) {
          console.error(`Live CSS Tester: Auto-apply error for tab ${tabId}:`, error);
        }
      }, CONFIG.autoApplyDelay);
    }
  } catch (error) {
    console.error('Live CSS Tester: Tab processing error:', error);
  }
}

// Get settings for a specific URL
async function getTabSettings(url) {
  try {
    const hostname = new URL(url).hostname;
    const key = `settings_${hostname}`;
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  } catch (error) {
    console.error('Live CSS Tester: Error getting tab settings:', error);
    return null;
  }
}

// Check if settings have auto-apply code
function hasAutoApplyCode(settings) {
  if (!settings) return false;
  
  const hasPinnedCSS = settings.css?.pinned && settings.css?.code && settings.css?.enabled !== false;
  const hasPinnedJS = settings.js?.pinned && settings.js?.code && settings.js?.enabled !== false;
  
  return hasPinnedCSS || hasPinnedJS;
}

// Auto-apply pinned code
async function autoApplyPinnedCode(tabId, settings, retryCount = 0) {
  try {
    const results = [];
    
    // Apply pinned CSS
    if (settings.css?.pinned && settings.css?.code && settings.css?.enabled !== false) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: injectCSS,
          args: [settings.css.code]
        });
        results.push({ type: 'css', success: true });
      } catch (error) {
        console.error('Live CSS Tester: CSS auto-apply error:', error);
        results.push({ type: 'css', success: false, error: error.message });
      }
    }
    
    // Apply pinned JavaScript
    if (settings.js?.pinned && settings.js?.code && settings.js?.enabled !== false) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: executeJS,
          args: [settings.js.code]
        });
        results.push({ type: 'js', success: true });
      } catch (error) {
        console.error('Live CSS Tester: JS auto-apply error:', error);
        results.push({ type: 'js', success: false, error: error.message });
      }
    }
    
    return results;
    
  } catch (error) {
    console.error('Live CSS Tester: Auto-apply error:', error);
    
    // Simple retry logic
    if (retryCount < CONFIG.maxRetryAttempts) {
      console.log(`Live CSS Tester: Retrying auto-apply (${retryCount + 1}/${CONFIG.maxRetryAttempts})`);
      setTimeout(() => {
        autoApplyPinnedCode(tabId, settings, retryCount + 1);
      }, CONFIG.retryDelay);
    }
    
    throw error;
  }
}

// Handle messages from popup/content scripts
function handleMessage(request, sender, sendResponse) {
  (async function() {
    try {
      const response = await processMessage(request, sender);
      sendResponse(response);
    } catch (error) {
      console.error('Live CSS Tester: Message handling error:', error);
      sendResponse({ 
        success: false, 
        error: error.message 
      });
    }
  })();
  
  return true; // Keep message channel open
}

// Process individual messages
async function processMessage(request, sender) {
  switch (request.action) {
    case 'getExtensionInfo':
      return {
        version: chrome.runtime.getManifest().version,
        name: chrome.runtime.getManifest().name
      };
      
    case 'clearAllData':
      await chrome.storage.local.clear();
      return { success: true, message: 'All data cleared' };
      
    case 'getTabSettings':
      if (sender.tab?.url) {
        const settings = await getTabSettings(sender.tab.url);
        return { success: true, settings };
      }
      return { success: false, error: 'No tab URL available' };
      
    default:
      throw new Error(`Unknown action: ${request.action}`);
  }
}

// Check if URL is a special page that can't be scripted
function isSpecialPage(url) {
  const specialPatterns = [
    /^chrome:\/\//,
    /^chrome-extension:\/\//,
    /^moz-extension:\/\//,
    /^edge-extension:\/\//,
    /^about:/,
    /^data:/,
    /^file:\/\//
  ];
  
  return specialPatterns.some(pattern => pattern.test(url));
}

// CSS injection function (executed in page context)
function injectCSS(css) {
  try {
    const styleId = 'live-css-tester-style';
    
    // Remove existing style
    let style = document.getElementById(styleId);
    if (style) {
      style.remove();
    }
    
    // Create and inject new style
    style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    style.setAttribute('data-injected-by', 'live-css-tester');
    
    const target = document.head || document.documentElement;
    target.appendChild(style);
    
    return { success: true };
  } catch (error) {
    console.error('Live CSS Tester: CSS injection error:', error);
    throw error;
  }
}

// JavaScript execution function (executed in page context)
function executeJS(js) {
  try {
    // Execute the code in a safe wrapper
    const script = document.createElement('script');
    script.textContent = `
      (function() {
        try {
          ${js}
        } catch (error) {
          console.error('Live CSS Tester JS Error:', error);
        }
      })();
    `;
    script.setAttribute('data-injected-by', 'live-css-tester');
    
    const target = document.head || document.body || document.documentElement;
    target.appendChild(script);
    
    // Clean up
    setTimeout(() => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }, 100);
    
    return { success: true };
  } catch (error) {
    console.error('Live CSS Tester: JS execution error:', error);
    throw error;
  }
}

console.log('Live CSS Tester: Background service worker loaded');