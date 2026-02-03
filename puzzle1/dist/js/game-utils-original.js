// Game State Management
const GameState = {
    saveProgress(puzzleId) {
        const progress = JSON.parse(localStorage.getItem('cyberpuzzle_progress') || '{}');
        progress[puzzleId] = {
            completed: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('cyberpuzzle_progress', JSON.stringify(progress));
        localStorage.setItem('cyberpuzzle_current', puzzleId);
        
        // Announce progress save to screen readers
        Accessibility.announce(`Progress saved. Step completed.`);
    },
    
    getProgress() {
        return JSON.parse(localStorage.getItem('cyberpuzzle_progress') || '{}');
    },
    
    getCurrentPuzzle() {
        return localStorage.getItem('cyberpuzzle_current') || 'puzzle1';
    },
    
    resetProgress() {
        localStorage.removeItem('cyberpuzzle_progress');
        localStorage.removeItem('cyberpuzzle_current');
        Accessibility.announce('All progress has been reset.');
    },
    
    hasCompleted(puzzleId) {
        const progress = this.getProgress();
        return progress[puzzleId]?.completed || false;
    }
};

// Accessibility Utilities
const Accessibility = {
    // Announces message to screen readers
    announce(message, priority = 'polite') {
        const announcer = document.getElementById('announcements') || 
                          document.getElementById('error-message');
        if (announcer) {
            // Set aria-live attribute based on priority
            announcer.setAttribute('aria-live', priority);
            announcer.textContent = message;
            
            // Clear after announcement to prevent repetition
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    },
    
    // Sets focus to an element safely
    setFocus(selector) {
        const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (element && element.focus) {
            element.focus();
        }
    },
    
    // Traps focus within a modal/container
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    },
    
    // Checks if reduced motion is preferred
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    // Checks if high contrast is preferred
    prefersHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }
};

// Hint System
const HintSystem = {
    hints: {
        'puzzle1b': [
            { delay: 30000, text: "💡 Hint: Look at the cipher image carefully. What type of cipher is mentioned in the text?" },
            { delay: 60000, text: "💡 Hint: The answer is two words - think about what 'transposition' means..." }
        ],
        'puzzle1c': [
            { delay: 30000, text: "💡 Hint: Look at the keyboard keys. You have C, L, U, E. What word can you make?" },
            { delay: 60000, text: "💡 Hint: It's a 4-letter word meaning 'a piece of evidence'..." }
        ],
        'puzzle1d': [
            { delay: 30000, text: "💡 Hint: Fill in the table column by column, then read row by row." },
            { delay: 60000, text: "💡 Hint: The first column starts with M, E, X, O, R, M, E, C, P..." }
        ],
        'puzzle1e': [
            { delay: 30000, text: "💡 Hint: Read the table left to right, top to bottom. Don't forget the period!" }
        ]
    },
    
    scheduleHints(puzzleId) {
        // Don't show hints if reduced motion is preferred (typically indicates cognitive accessibility needs)
        if (Accessibility.prefersReducedMotion()) {
            return;
        }
        
        const hints = this.hints[puzzleId] || [];
        hints.forEach((hint, index) => {
            setTimeout(() => {
                this.showHint(hint.text);
            }, hint.delay);
        });
    },
    
    showHint(text) {
        const hintEl = document.createElement('div');
        hintEl.className = 'hint-box';
        hintEl.setAttribute('role', 'status');
        hintEl.setAttribute('aria-live', 'polite');
        hintEl.innerHTML = text;
        hintEl.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 1px solid #0f3460;
            border-left: 4px solid #e94560;
            color: #eee;
            padding: 15px 20px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 8px;
            font-size: 14px;
            animation: slideIn 0.5s ease;
            box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
        `;
        
        const container = document.querySelector('.container') || document.body;
        container.appendChild(hintEl);
        
        // Announce hint to screen readers
        Accessibility.announce('Hint available: ' + text.replace(/💡\s*Hint:\s*/, ''));
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            hintEl.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => hintEl.remove(), 500);
        }, 30000);
    }
};

// Visual Feedback System
const Feedback = {
    showSuccess(message, duration = 2000) {
        this.showToast(message, 'success', duration);
        Accessibility.announce(message, 'polite');
    },
    
    showError(message, duration = 3000) {
        this.showToast(message, 'error', duration);
        Accessibility.announce(message, 'assertive');
    },
    
    showInfo(message, duration = 3000) {
        this.showToast(message, 'info', duration);
        Accessibility.announce(message, 'polite');
    },
    
    showToast(message, type, duration) {
        const toast = document.createElement('div');
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ'
        };
        
        toast.className = `toast-notification toast-${type}`;
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Progress Bar
const ProgressBar = {
    create(totalSteps, currentStep) {
        const progress = document.createElement('div');
        progress.className = 'progress-container';
        progress.setAttribute('role', 'progressbar');
        progress.setAttribute('aria-valuenow', currentStep);
        progress.setAttribute('aria-valuemax', totalSteps);
        progress.setAttribute('aria-label', `Progress: step ${currentStep} of ${totalSteps}`);
        progress.innerHTML = `
            <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" style="width: ${(currentStep / totalSteps) * 100}%"></div>
            </div>
            <div class="progress-text">Step ${currentStep} of ${totalSteps}</div>
        `;
        progress.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.9);
            padding: 10px;
            z-index: 1000;
            border-bottom: 1px solid #333;
        `;
        progress.querySelector('.progress-bar-wrapper').style.cssText = `
            width: 100%;
            max-width: 400px;
            height: 6px;
            background: #333;
            border-radius: 3px;
            margin: 0 auto;
            overflow: hidden;
        `;
        progress.querySelector('.progress-bar-fill').style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, #e94560, #0f3460);
            transition: width 0.5s ease;
            border-radius: 3px;
        `;
        progress.querySelector('.progress-text').style.cssText = `
            text-align: center;
            color: #fff;
            font-size: 12px;
            margin-top: 5px;
        `;
        
        document.body.insertBefore(progress, document.body.firstChild);
        
        // Adjust body padding
        document.body.style.paddingTop = '60px';
    }
};

// Keyboard Navigation
const KeyboardNav = {
    init() {
        document.addEventListener('keydown', (e) => {
            // Prevent Enter from submitting forms accidentally
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                const form = e.target.closest('form');
                if (form && !e.target.closest('input[type="submit"]')) {
                    // Allow default behavior for radio buttons
                    if (e.target.type !== 'radio') {
                        e.preventDefault();
                        form.dispatchEvent(new Event('submit'));
                    }
                }
            }
            
            // ESC to go back
            if (e.key === 'Escape') {
                const backLink = document.querySelector('a[href*=".html"]');
                if (backLink && confirm('Go back to the previous page?')) {
                    window.location.href = backLink.href;
                }
            }
            
            // Global shortcuts
            if (e.key === '?' && e.ctrlKey) {
                e.preventDefault();
                this.showShortcutsHelp();
            }
        });
    },
    
    showShortcutsHelp() {
        const helpModal = document.createElement('div');
        helpModal.id = 'keyboard-help-modal';
        helpModal.setAttribute('role', 'dialog');
        helpModal.setAttribute('aria-label', 'Keyboard shortcuts help');
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
        `;
        
        helpModal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 1px solid var(--primary-color);
                border-radius: var(--border-radius);
                padding: 30px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
            " role="document">
                <h2 style="color: var(--primary-color); margin-bottom: 20px;">⌨️ Keyboard Shortcuts</h2>
                <table style="width: 100%; color: var(--text-color);">
                    <tr><td style="padding: 8px;"><kbd>Tab</kbd></td><td>Navigate elements</td></tr>
                    <tr><td style="padding: 8px;"><kbd>Enter</kbd></td><td>Activate buttons/links</td></tr>
                    <tr><td style="padding: 8px;"><kbd>Space</kbd> / <kbd>S</kbd></td><td>Skip animation</td></tr>
                    <tr><td style="padding: 8px;"><kbd>↑↓←→</kbd></td><td>Navigate table cells</td></tr>
                    <tr><td style="padding: 8px;"><kbd>Esc</kbd></td><td>Go back / close</td></tr>
                    <tr><td style="padding: 8px;"><kbd>Ctrl + ?</kbd></td><td>Show this help</td></tr>
                </table>
                <button onclick="this.closest('#keyboard-help-modal').remove(); document.getElementById('announcements').focus();" 
                        style="margin-top: 20px; width: 100%;">Close</button>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        helpModal.querySelector('button').focus();
        Accessibility.trapFocus(helpModal);
    }
};

// Animations CSS
const injectAnimations = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(100px); }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 5px rgba(233, 69, 96, 0.5); }
            50% { box-shadow: 0 0 20px rgba(233, 69, 96, 0.8); }
        }
        .btn-pulse {
            animation: pulse 2s infinite;
        }
        .glow-effect {
            animation: glow 2s infinite;
        }
        
        /* Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
            .btn-pulse, .glow-effect {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        injectAnimations();
        KeyboardNav.init();
    });
} else {
    injectAnimations();
    KeyboardNav.init();
}

// Export for use in other scripts
window.GameState = GameState;
window.HintSystem = HintSystem;
window.Feedback = Feedback;
window.ProgressBar = ProgressBar;
window.Accessibility = Accessibility;
window.KeyboardNav = KeyboardNav;
