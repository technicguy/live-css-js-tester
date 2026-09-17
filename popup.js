// Enhanced Live CSS & JS Tester with Auto-Complete
(function() {
    'use strict';

    // State management
    const state = {
        currentTab: 'css',
        isFloating: false,
        isDragging: false,
        dragOffset: { x: 0, y: 0 },
        cssProperties: [],
        filteredProperties: [],
        showSuggestions: false,
        selectedSuggestion: -1
    };

    // DOM elements
    const elements = {};

    // Initialize extension
    document.addEventListener('DOMContentLoaded', initialize);

    function initialize() {
        try {
            cacheElements();
            loadCSSProperties();
            setupEventListeners();
            loadSettings();
            updateUrl();
            updateStatus('Extension loaded');
        } catch (error) {
            console.error('Initialization error:', error);
            updateStatus('Initialization failed', 'error');
        }
    }

    // Cache DOM elements
    function cacheElements() {
        const selectors = {
            container: '#container',
            dragHandle: '#dragHandle',
            urlInfo: '#urlInfo',
            tabButtons: '.tab-btn',
            tabContents: '.tab-content',
            cssEditor: '#cssEditor',
            jsEditor: '#jsEditor',
            cssEnabled: '#cssEnabled',
            jsEnabled: '#jsEnabled',
            cssPinned: '#cssPinned',
            jsPinned: '#jsPinned',
            applyCss: '#applyCss',
            runJs: '#runJs',
            clearCss: '#clearCss',
            clearJs: '#clearJs',
            cssProperties: '#cssProperties',
            consoleContent: '#consoleContent',
            clearConsole: '#clearConsole',
            cssLines: '#cssLines',
            cssChars: '#cssChars',
            jsLines: '#jsLines',
            jsChars: '#jsChars',
            status: '#status',
            suggestions: '.suggestions'
        };

        Object.keys(selectors).forEach(key => {
            const selector = selectors[key];
            if (key === 'tabButtons' || key === 'tabContents') {
                // These need to be NodeLists
                elements[key] = document.querySelectorAll(selector);
            } else if (selector.startsWith('.')) {
                // For class selectors, get the first element
                elements[key] = document.querySelector(selector);
            } else {
                // For ID selectors
                elements[key] = document.querySelector(selector);
            }
        });
    }

    // Load CSS properties with enhanced auto-complete data
    function loadCSSProperties() {
        try {
            // Comprehensive CSS properties list with common values
            const cssPropertiesData = {
                'align-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'],
                'align-items': ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
                'animation': ['name duration timing-function delay iteration-count direction fill-mode play-state'],
                'animation-duration': ['0s', '0.3s', '0.5s', '1s', '2s'],
                'animation-timing-function': ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
                'background': ['transparent', 'none', '#ffffff', '#000000'],
                'background-color': ['transparent', '#ffffff', '#000000', 'red', 'blue', 'green'],
                'background-image': ['none', 'url()', 'linear-gradient()', 'radial-gradient()'],
                'background-position': ['left top', 'center', 'right bottom', '0% 0%', '50% 50%'],
                'background-repeat': ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'],
                'background-size': ['auto', 'cover', 'contain', '100%', '100% 100%'],
                'border': ['none', '1px solid #000', '2px solid #ccc'],
                'border-color': ['transparent', '#000000', '#cccccc', 'currentColor'],
                'border-radius': ['0', '4px', '8px', '50%', '10px'],
                'border-style': ['none', 'solid', 'dashed', 'dotted', 'double'],
                'border-width': ['0', '1px', '2px', '3px', 'thin', 'medium', 'thick'],
                'box-shadow': ['none', '0 2px 4px rgba(0,0,0,0.1)', '0 4px 8px rgba(0,0,0,0.2)'],
                'color': ['black', 'white', 'red', 'blue', 'green', '#000000', '#ffffff'],
                'cursor': ['pointer', 'default', 'text', 'move', 'grab', 'not-allowed'],
                'display': ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
                'flex': ['1', '0 1 auto', '1 1 0%'],
                'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
                'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
                'font-family': ['Arial, sans-serif', 'Georgia, serif', 'monospace', 'inherit'],
                'font-size': ['12px', '14px', '16px', '18px', '24px', '1rem', '1.2rem'],
                'font-weight': ['normal', 'bold', '100', '300', '400', '500', '700', '900'],
                'height': ['auto', '100%', '100vh', '50px', '100px'],
                'justify-content': ['flex-start', 'flex-end', 'center', 'space-between', 'space-around'],
                'line-height': ['normal', '1', '1.2', '1.5', '2'],
                'margin': ['0', 'auto', '10px', '20px', '10px 20px'],
                'max-width': ['none', '100%', '1200px', '800px'],
                'opacity': ['0', '0.5', '1'],
                'overflow': ['visible', 'hidden', 'scroll', 'auto'],
                'padding': ['0', '10px', '20px', '10px 20px'],
                'position': ['static', 'relative', 'absolute', 'fixed', 'sticky'],
                'text-align': ['left', 'right', 'center', 'justify'],
                'text-decoration': ['none', 'underline', 'overline', 'line-through'],
                'transform': ['none', 'translateX(10px)', 'translateY(10px)', 'scale(1.1)', 'rotate(45deg)'],
                'transition': ['none', 'all 0.3s ease', 'opacity 0.3s', 'transform 0.3s'],
                'visibility': ['visible', 'hidden'],
                'width': ['auto', '100%', '50%', '100px', '200px'],
                'z-index': ['auto', '1', '10', '100', '1000']
            };

            state.cssProperties = Object.keys(cssPropertiesData).sort();
            state.cssPropertiesData = cssPropertiesData;
            
            // Create auto-complete dropdown
            createAutoCompleteDropdown();
            
            console.log(`Loaded ${state.cssProperties.length} CSS properties`);
        } catch (error) {
            console.error('Error loading CSS properties:', error);
            // Fallback properties
            state.cssProperties = ['color', 'background', 'font-size', 'margin', 'padding'];
            state.cssPropertiesData = {};
            createAutoCompleteDropdown();
        }
    }

    // Create auto-complete dropdown
    function createAutoCompleteDropdown() {
        if (!elements.suggestions) return;
        
        // Remove the old select element
        if (elements.cssProperties) {
            elements.cssProperties.remove();
        }
        
        // Create new auto-complete structure
        elements.suggestions.innerHTML = `
            <div class="autocomplete-container" style="position: relative; display: none;">
                <div class="autocomplete-dropdown" id="autocompleteDropdown" style="
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1000;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                </div>
            </div>
        `;
        
        elements.autocompleteContainer = elements.suggestions.querySelector('.autocomplete-container');
        elements.autocompleteDropdown = elements.suggestions.querySelector('#autocompleteDropdown');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Drag functionality - only allow dragging from drag handle
        elements.dragHandle?.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', handleDragging);
        document.addEventListener('mouseup', stopDragging);

        // Tab switching
        elements.tabButtons?.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // CSS controls
        elements.applyCss?.addEventListener('click', applyCss);
        elements.clearCss?.addEventListener('click', clearCss);
        elements.cssEnabled?.addEventListener('change', saveSettings);
        elements.cssPinned?.addEventListener('change', saveSettings);

        // JavaScript controls
        elements.runJs?.addEventListener('click', runJavaScript);
        elements.clearJs?.addEventListener('click', clearJavaScript);
        elements.jsEnabled?.addEventListener('change', saveSettings);
        elements.jsPinned?.addEventListener('change', saveSettings);

        // Clear console
        elements.clearConsole?.addEventListener('click', clearConsole);

        // Enhanced CSS editor events
        elements.cssEditor?.addEventListener('input', handleCSSEditorInput);
        elements.cssEditor?.addEventListener('keydown', handleCSSEditorKeydown);
        elements.cssEditor?.addEventListener('blur', hideSuggestions);

        // JS editor events
        elements.jsEditor?.addEventListener('input', () => {
            updateStats('js');
            saveSettings();
        });

        // Auto-save on unload
        window.addEventListener('beforeunload', saveSettings);
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.cssEditor?.contains(e.target) && !elements.autocompleteContainer?.contains(e.target)) {
                hideSuggestions();
            }
        });
    }

    // Enhanced CSS editor input handler
    function handleCSSEditorInput(e) {
        updateStats('css');
        saveSettings();
        
        // Auto-apply if enabled
        if (elements.cssEnabled?.checked) {
            debounce(applyCss, 500)();
        }
        
        // Show CSS suggestions
        showCSSAutoComplete(e);
    }

    // CSS editor keydown handler
    function handleCSSEditorKeydown(e) {
        if (!state.showSuggestions || state.filteredProperties.length === 0) return;
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                state.selectedSuggestion = Math.min(state.selectedSuggestion + 1, state.filteredProperties.length - 1);
                updateSuggestionSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                state.selectedSuggestion = Math.max(state.selectedSuggestion - 1, -1);
                updateSuggestionSelection();
                break;
                
            case 'Tab':
            case 'Enter':
                if (state.selectedSuggestion >= 0) {
                    e.preventDefault();
                    insertSelectedSuggestion();
                }
                break;
                
            case 'Escape':
                e.preventDefault();
                hideSuggestions();
                break;
        }
    }

    // Show CSS auto-complete suggestions
    function showCSSAutoComplete(e) {
        const editor = elements.cssEditor;
        if (!editor) return;
        
        const cursorPos = editor.selectionStart;
        const textBeforeCursor = editor.value.substring(0, cursorPos);
        
        // Find the current word being typed
        const match = textBeforeCursor.match(/[\w-]*$/);
        if (!match) {
            hideSuggestions();
            return;
        }
        
        const currentWord = match[0];
        
        // Only show suggestions if typing at least 1 character
        if (currentWord.length < 1) {
            hideSuggestions();
            return;
        }
        
        // Filter properties based on current input
        state.filteredProperties = state.cssProperties.filter(prop => 
            prop.toLowerCase().includes(currentWord.toLowerCase())
        );
        
        if (state.filteredProperties.length === 0) {
            hideSuggestions();
            return;
        }
        
        // Show suggestions
        displaySuggestions();
        state.showSuggestions = true;
        state.selectedSuggestion = -1;
    }

    // Display suggestions dropdown
    function displaySuggestions() {
        if (!elements.autocompleteDropdown || !elements.autocompleteContainer) return;
        
        elements.autocompleteDropdown.innerHTML = '';
        
        state.filteredProperties.slice(0, 10).forEach((property, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = property;
            item.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                font-family: monospace;
                font-size: 12px;
                border-bottom: 1px solid #eee;
                transition: background-color 0.2s;
            `;
            
            item.addEventListener('mouseenter', () => {
                state.selectedSuggestion = index;
                updateSuggestionSelection();
            });
            
            item.addEventListener('click', () => {
                state.selectedSuggestion = index;
                insertSelectedSuggestion();
            });
            
            elements.autocompleteDropdown.appendChild(item);
        });
        
        // Position dropdown
        positionAutocompleteDropdown();
        elements.autocompleteContainer.style.display = 'block';
    }

    // Position autocomplete dropdown
    function positionAutocompleteDropdown() {
        if (!elements.cssEditor || !elements.autocompleteContainer) return;
        
        const editorRect = elements.cssEditor.getBoundingClientRect();
        const containerRect = elements.container.getBoundingClientRect();
        
        const relativeTop = editorRect.top - containerRect.top + elements.cssEditor.offsetHeight;
        const relativeLeft = editorRect.left - containerRect.left;
        
        elements.autocompleteContainer.style.position = 'absolute';
        elements.autocompleteContainer.style.top = relativeTop + 'px';
        elements.autocompleteContainer.style.left = relativeLeft + 'px';
        elements.autocompleteContainer.style.width = elements.cssEditor.offsetWidth + 'px';
    }

    // Update suggestion selection highlight
    function updateSuggestionSelection() {
        if (!elements.autocompleteDropdown) return;
        
        const items = elements.autocompleteDropdown.querySelectorAll('.autocomplete-item');
        items.forEach((item, index) => {
            if (index === state.selectedSuggestion) {
                item.style.backgroundColor = '#667eea';
                item.style.color = 'white';
            } else {
                item.style.backgroundColor = '';
                item.style.color = '';
            }
        });
    }

    // Insert selected suggestion
    function insertSelectedSuggestion() {
        if (state.selectedSuggestion < 0 || !elements.cssEditor) return;
        
        const selectedProperty = state.filteredProperties[state.selectedSuggestion];
        const editor = elements.cssEditor;
        const cursorPos = editor.selectionStart;
        const textBeforeCursor = editor.value.substring(0, cursorPos);
        const textAfterCursor = editor.value.substring(cursorPos);
        
        // Find the current word to replace
        const match = textBeforeCursor.match(/([\w-]*)$/);
        if (!match) return;
        
        const currentWord = match[0];
        const wordStart = cursorPos - currentWord.length;
        
        // Replace current word with selected property
        const newText = editor.value.substring(0, wordStart) + selectedProperty + ': ' + textAfterCursor;
        editor.value = newText;
        
        // Position cursor after the colon
        const newCursorPos = wordStart + selectedProperty.length + 2;
        editor.setSelectionRange(newCursorPos, newCursorPos);
        editor.focus();
        
        hideSuggestions();
        updateStats('css');
        saveSettings();
    }

    // Hide suggestions
    function hideSuggestions() {
        state.showSuggestions = false;
        state.selectedSuggestion = -1;
        if (elements.autocompleteContainer) {
            elements.autocompleteContainer.style.display = 'none';
        }
    }

    // Dragging functionality - restricted to drag handle only
    function startDragging(e) {
        // Only allow dragging from the drag handle
        if (e.target !== elements.dragHandle && !elements.dragHandle?.contains(e.target)) {
            return;
        }
        
        state.isDragging = true;
        state.isFloating = true;
        
        const rect = elements.container.getBoundingClientRect();
        state.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        elements.container.classList.add('floating');
        elements.container.style.position = 'fixed';
        elements.container.style.left = rect.left + 'px';
        elements.container.style.top = rect.top + 'px';
        elements.container.style.zIndex = '10000';
        
        e.preventDefault();
    }

    function handleDragging(e) {
        if (!state.isDragging || !state.isFloating) return;
        
        const newX = e.clientX - state.dragOffset.x;
        const newY = e.clientY - state.dragOffset.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - elements.container.offsetWidth;
        const maxY = window.innerHeight - elements.container.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        elements.container.style.left = boundedX + 'px';
        elements.container.style.top = boundedY + 'px';
    }

    function stopDragging() {
        if (!state.isDragging) return;
        state.isDragging = false;
    }

    // Tab switching
    function switchTab(tabName) {
        if (!tabName || state.currentTab === tabName) return;
        
        state.currentTab = tabName;
        hideSuggestions(); // Hide suggestions when switching tabs
        
        // Update tab buttons
        elements.tabButtons?.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Update tab content
        elements.tabContents?.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
        
        updateStatus(`Switched to ${tabName.toUpperCase()}`);
    }

    // CSS functionality
    async function applyCss() {
        const css = elements.cssEditor?.value?.trim();
        if (!css) {
            updateStatus('No CSS to apply', 'warning');
            return;
        }

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error('No active tab');

            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: injectCSS,
                args: [css]
            });

            updateStatus('CSS applied successfully', 'success');
        } catch (error) {
            console.error('CSS apply error:', error);
            updateStatus('CSS apply failed', 'error');
        }
    }

    function clearCss() {
        if (elements.cssEditor) {
            elements.cssEditor.value = '';
            updateStats('css');
        }
        hideSuggestions();
        removeCSSFromPage();
        updateStatus('CSS cleared');
        saveSettings();
    }

    async function removeCSSFromPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: removeCSS
                });
            }
        } catch (error) {
            console.error('CSS removal error:', error);
        }
    }

    // JavaScript functionality
    async function runJavaScript() {
        const js = elements.jsEditor?.value?.trim();
        if (!js) {
            updateStatus('No JavaScript to run', 'warning');
            return;
        }

        try {
            clearConsole();
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error('No active tab');

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: executeJS,
                args: [js]
            });

            if (results?.[0]?.result) {
                const { logs, error } = results[0].result;
                
                if (error) {
                    addConsoleMessage(`Error: ${error}`, 'error');
                } else if (logs?.length) {
                    logs.forEach(log => addConsoleMessage(log.message, log.type));
                } else {
                    addConsoleMessage('Code executed successfully', 'log');
                }
            }

            updateStatus('JavaScript executed', 'success');
        } catch (error) {
            console.error('JavaScript execution error:', error);
            addConsoleMessage(`Execution failed: ${error.message}`, 'error');
            updateStatus('JavaScript execution failed', 'error');
        }
    }

    function clearJavaScript() {
        if (elements.jsEditor) {
            elements.jsEditor.value = '';
            updateStats('js');
        }
        clearConsole();
        updateStatus('JavaScript cleared');
        saveSettings();
    }

    // Console functionality
    function addConsoleMessage(message, type = 'log') {
        if (!elements.consoleContent) return;
        
        const div = document.createElement('div');
        div.className = `console-${type}`;
        div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        elements.consoleContent.appendChild(div);
        elements.consoleContent.scrollTop = elements.consoleContent.scrollHeight;
        
        // Limit console messages
        const messages = elements.consoleContent.children;
        while (messages.length > 20) {
            elements.consoleContent.removeChild(messages[0]);
        }
    }

    function clearConsole() {
        if (elements.consoleContent) {
            elements.consoleContent.innerHTML = '';
        }
    }

    // Update editor statistics
    function updateStats(type) {
        const editor = type === 'css' ? elements.cssEditor : elements.jsEditor;
        const linesEl = type === 'css' ? elements.cssLines : elements.jsLines;
        const charsEl = type === 'css' ? elements.cssChars : elements.jsChars;
        
        if (!editor) return;
        
        const lines = editor.value.split('\n').length;
        const chars = editor.value.length;
        
        if (linesEl) linesEl.textContent = `Lines: ${lines}`;
        if (charsEl) charsEl.textContent = `Chars: ${chars}`;
    }

    // Settings management
    async function saveSettings() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.url) return;

            const hostname = new URL(tab.url).hostname;
            const settings = {
                css: {
                    code: elements.cssEditor?.value || '',
                    enabled: elements.cssEnabled?.checked ?? true,
                    pinned: elements.cssPinned?.checked ?? false
                },
                js: {
                    code: elements.jsEditor?.value || '',
                    enabled: elements.jsEnabled?.checked ?? true,
                    pinned: elements.jsPinned?.checked ?? false
                },
                currentTab: state.currentTab
            };

            await chrome.storage.local.set({ [`settings_${hostname}`]: settings });
        } catch (error) {
            console.error('Save settings error:', error);
        }
    }

    async function loadSettings() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.url) return;

            const hostname = new URL(tab.url).hostname;
            const result = await chrome.storage.local.get(`settings_${hostname}`);
            const settings = result[`settings_${hostname}`];

            if (settings) {
                // Load CSS settings
                if (elements.cssEditor) elements.cssEditor.value = settings.css?.code || '';
                if (elements.cssEnabled) elements.cssEnabled.checked = settings.css?.enabled ?? true;
                if (elements.cssPinned) elements.cssPinned.checked = settings.css?.pinned ?? false;

                // Load JS settings
                if (elements.jsEditor) elements.jsEditor.value = settings.js?.code || '';
                if (elements.jsEnabled) elements.jsEnabled.checked = settings.js?.enabled ?? true;
                if (elements.jsPinned) elements.jsPinned.checked = settings.js?.pinned ?? false;

                // Switch to saved tab
                if (settings.currentTab) {
                    switchTab(settings.currentTab);
                }

                // Update stats
                updateStats('css');
                updateStats('js');

                // Apply pinned code
                if (settings.css?.pinned && settings.css?.code && settings.css?.enabled) {
                    setTimeout(applyCss, 1000);
                }
                if (settings.js?.pinned && settings.js?.code && settings.js?.enabled) {
                    setTimeout(runJavaScript, 1000);
                }
            }
        } catch (error) {
            console.error('Load settings error:', error);
        }
    }

    // Update URL display
    async function updateUrl() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab?.url && elements.urlInfo) {
                const hostname = new URL(tab.url).hostname;
                
                if (isSpecialPage(tab.url)) {
                    elements.urlInfo.textContent = `${hostname || 'System Page'} (CSS/JS disabled)`;
                    elements.urlInfo.style.color = '#f56565';
                } else {
                    elements.urlInfo.textContent = hostname;
                    elements.urlInfo.style.color = '';
                }
            }
        } catch (error) {
            console.error('URL update error:', error);
            if (elements.urlInfo) {
                elements.urlInfo.textContent = 'Unknown Page';
            }
        }
    }

    // Status management
    function updateStatus(message, type = '') {
        if (!elements.status) return;
        
        elements.status.textContent = message;
        elements.status.className = `status ${type}`;
        
        // Clear status after delay
        setTimeout(() => {
            if (elements.status.textContent === message) {
                elements.status.textContent = 'Ready';
                elements.status.className = 'status';
            }
        }, 3000);
    }

    // Utility functions
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Injection functions (executed in page context)
    function injectCSS(css) {
        const styleId = 'live-css-tester-style';
        let style = document.getElementById(styleId);
        
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        
        style.textContent = css;
        return { success: true };
    }

    function removeCSS() {
        const style = document.getElementById('live-css-tester-style');
        if (style) {
            style.remove();
        }
        return { success: true };
    }

    function executeJS(js) {
        const logs = [];
        
        // Capture console output
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            logs.push({ type: 'log', message: args.join(' ') });
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            logs.push({ type: 'error', message: args.join(' ') });
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            logs.push({ type: 'warn', message: args.join(' ') });
            originalWarn.apply(console, args);
        };
        
        try {
            // Execute the user code
            eval(js);
            return { logs, success: true };
        } catch (error) {
            return { 
                logs, 
                error: error.message, 
                success: false 
            };
        } finally {
            // Restore original console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        }
    }

})();