// Simplified Content Script for Live CSS & JS Tester
(function() {
  'use strict';
  
  // Prevent duplicate loading
  if (window.liveCssJsTesterLoaded) {
    return;
  }
  window.liveCssJsTesterLoaded = true;
  
  // Configuration
  const CONFIG = {
    styleId: 'live-css-tester-style',
    scriptClass: 'live-js-tester-script'
  };

  // State
  const state = {
    ready: false
  };

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Initialize content script
  function initialize() {
    try {
      state.ready = true;
      console.log('Live CSS Tester: Content script ready');
    } catch (error) {
      console.error('Live CSS Tester: Content script initialization error:', error);
    }
  }

  // Enhanced CSS injection
  function injectCSS(css) {
    try {
      if (!css || typeof css !== 'string') {
        throw new Error('Invalid CSS provided');
      }

      // Remove existing CSS
      removeExistingCSS();
      
      // Create and inject new CSS
      const style = document.createElement('style');
      style.id = CONFIG.styleId;
      style.type = 'text/css';
      style.textContent = css;
      style.setAttribute('data-injected-by', 'live-css-tester');
      
      const target = document.head || document.documentElement;
      target.appendChild(style);
      
      return { success: true, message: 'CSS injected successfully' };
    } catch (error) {
      console.error('Live CSS Tester: CSS injection error:', error);
      throw error;
    }
  }

  // Remove existing CSS
  function removeExistingCSS() {
    const existingStyles = document.querySelectorAll(`#${CONFIG.styleId}, style[data-injected-by="live-css-tester"]`);
    existingStyles.forEach(style => {
      try {
        style.remove();
      } catch (error) {
        console.warn('Live CSS Tester: Error removing style:', error);
      }
    });
  }

  // Enhanced JavaScript execution with console capture
  function executeJavaScript(js) {
    try {
      if (!js || typeof js !== 'string') {
        throw new Error('Invalid JavaScript provided');
      }

      // Clean up previous scripts
      cleanupPreviousScripts();
      
      // Capture console output
      const logs = [];
      const originalConsole = captureConsoleOutput(logs);
      
      let executionError = null;
      
      try {
        // Create script element for execution
        const script = document.createElement('script');
        script.className = CONFIG.scriptClass;
        script.setAttribute('data-injected-by', 'live-css-tester');
        
        // Wrap user code in error handling
        script.textContent = `
          (function() {
            try {
              ${js}
            } catch (error) {
              console.error('Live CSS Tester JS Error:', error.message);
              throw error;
            }
          })();
        `;
        
        // Execute the script
        const target = document.head || document.body || document.documentElement;
        if (target) {
          target.appendChild(script);
          
          // Clean up script element
          setTimeout(() => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
          }, 100);
        } else {
          throw new Error('No suitable parent element for script execution');
        }
        
      } catch (error) {
        executionError = error.message;
      } finally {
        // Restore original console
        restoreConsoleOutput(originalConsole);
      }
      
      return { 
        success: !executionError, 
        message: executionError || 'JavaScript executed successfully',
        logs: logs,
        error: executionError
      };
      
    } catch (error) {
      console.error('Live CSS Tester: JavaScript execution error:', error);
      throw error;
    }
  }

  // Clean up previous scripts
  function cleanupPreviousScripts() {
    const existingScripts = document.querySelectorAll(`script[data-injected-by="live-css-tester"]`);
    existingScripts.forEach(script => {
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (error) {
        console.warn('Live CSS Tester: Error cleaning up script:', error);
      }
    });
  }

  // Capture console output
  function captureConsoleOutput(logs) {
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    
    console.log = (...args) => {
      logs.push({ type: 'log', message: args.join(' ') });
      originalConsole.log.apply(console, args);
    };
    
    console.error = (...args) => {
      logs.push({ type: 'error', message: args.join(' ') });
      originalConsole.error.apply(console, args);
    };
    
    console.warn = (...args) => {
      logs.push({ type: 'warn', message: args.join(' ') });
      originalConsole.warn.apply(console, args);
    };
    
    console.info = (...args) => {
      logs.push({ type: 'info', message: args.join(' ') });
      originalConsole.info.apply(console, args);
    };
    
    return originalConsole;
  }

  // Restore console output
  function restoreConsoleOutput(originalConsole) {
    Object.assign(console, originalConsole);
  }

  // Get page information
  function getPageInfo() {
    return {
      url: window.location.href,
      hostname: window.location.hostname,
      title: document.title,
      readyState: document.readyState,
      timestamp: Date.now()
    };
  }

  // Message listener
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    (async function() {
      try {
        if (!state.ready) {
          throw new Error('Content script not ready');
        }

        switch (request.action) {
          case 'injectCSS':
            if (!request.css) {
              throw new Error('No CSS provided');
            }
            const cssResult = injectCSS(request.css);
            sendResponse(cssResult);
            break;
            
          case 'removeCSS':
            removeExistingCSS();
            sendResponse({ success: true, message: 'CSS removed successfully' });
            break;
            
          case 'executeJS':
            if (!request.js) {
              throw new Error('No JavaScript provided');
            }
            const jsResult = executeJavaScript(request.js);
            sendResponse(jsResult);
            break;
            
          case 'getPageInfo':
            sendResponse(getPageInfo());
            break;
            
          case 'cleanup':
            removeExistingCSS();
            cleanupPreviousScripts();
            sendResponse({ success: true, message: 'Cleanup completed' });
            break;
            
          default:
            throw new Error(`Unknown action: ${request.action}`);
        }
      } catch (error) {
        console.error('Live CSS Tester: Message handling error:', error);
        sendResponse({ 
          success: false, 
          error: error.message
        });
      }
    })();
    
    return true; // Keep message channel open
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    try {
      // Optional cleanup - styles and scripts will be removed anyway on navigation
      // removeExistingCSS();
      // cleanupPreviousScripts();
    } catch (error) {
      console.warn('Live CSS Tester: Cleanup error:', error);
    }
  });

  console.log('Live CSS Tester: Content script loaded');

})();