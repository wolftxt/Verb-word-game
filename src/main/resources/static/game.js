// Game State
let currentGame = null;
let isProcessing = false;
let currentLanguage = 'en';
let supportedLanguages = ['en', 'de', 'cz'];

// DOM Elements
const elements = {
    tutorialOverlay: document.getElementById('tutorial-overlay'),
    startGameBtn: document.getElementById('start-game-btn'),
    gameArea: document.getElementById('game-area'),
    wordDisplay: document.getElementById('word-display'),
    emojiDisplay: document.getElementById('emoji-display'),
    verbInput: document.getElementById('verb-input'),
    submitBtn: document.getElementById('submit-btn'),
    responseSection: document.getElementById('response-section'),
    score: document.getElementById('score'),
    usedWords: document.getElementById('used-words'),
    usedVerbs: document.getElementById('used-verbs'),
    gameOver: document.getElementById('game-over'),
    finalScore: document.getElementById('final-score'),
    gameOverMessage: document.getElementById('game-over-message'),
    newGameBtn: document.getElementById('new-game-btn'),
    loading: document.getElementById('loading'),
    currentLanguage: document.getElementById('current-language'),
    currentFlag: document.getElementById('current-flag'),
    languageDropdown: document.getElementById('language-dropdown')
};

// Initialize the game
async function init() {
    // Load current language
    currentLanguage = TranslationUtils.getCurrentLanguage();
    
    // Update UI translations
    TranslationUtils.updateUITranslations();
    
    // Fetch supported languages
    try {
        supportedLanguages = await VerbsAPI.getSupportedLanguages();
        updateLanguageDropdown();
    } catch (error) {
        console.error('Failed to fetch supported languages:', error);
    }
    
    // Check if first time user
    const hasPlayedBefore = localStorage.getItem('hasPlayedVerbsGame');
    
    if (!hasPlayedBefore) {
        // Show tutorial
        elements.tutorialOverlay.classList.remove('hidden');
        AnimationUtils.animateTutorial();
    } else {
        // Start game directly
        elements.tutorialOverlay.classList.add('hidden');
        startNewGame();
    }
    
    // Start title animation
    AnimationUtils.animateTitle();
    
    // Set up event listeners
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    elements.startGameBtn.addEventListener('click', () => {
        localStorage.setItem('hasPlayedVerbsGame', 'true');
        elements.tutorialOverlay.classList.add('hidden');
        startNewGame();
    });
    
    elements.submitBtn.addEventListener('click', submitVerb);
    elements.verbInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isProcessing) {
            submitVerb();
        }
    });
    
    elements.newGameBtn.addEventListener('click', startNewGame);
    
    // Language switcher events
    elements.currentLanguage.addEventListener('click', toggleLanguageDropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-switcher')) {
            elements.languageDropdown.classList.add('hidden');
        }
    });
}

// Toggle language dropdown
function toggleLanguageDropdown(e) {
    e.stopPropagation();
    elements.languageDropdown.classList.toggle('hidden');
}

// Update language dropdown with supported languages
function updateLanguageDropdown() {
    elements.languageDropdown.innerHTML = '';
    
    supportedLanguages.forEach(lang => {
        const button = document.createElement('button');
        button.className = 'language-option';
        button.dataset.lang = lang;
        
        const flag = document.createElement('img');
        flag.src = TranslationUtils.languageConfig[lang].flag;
        flag.alt = TranslationUtils.languageConfig[lang].name;
        flag.className = 'flag-icon';
        
        const name = document.createElement('span');
        name.textContent = TranslationUtils.languageConfig[lang].name;
        
        button.appendChild(flag);
        button.appendChild(name);
        
        button.addEventListener('click', () => changeLanguage(lang));
        
        elements.languageDropdown.appendChild(button);
    });
}

// Change language
async function changeLanguage(lang) {
    if (lang === currentLanguage) {
        elements.languageDropdown.classList.add('hidden');
        return;
    }
    
    currentLanguage = lang;
    TranslationUtils.setCurrentLanguage(lang);
    TranslationUtils.updateUITranslations();
    
    // Update current flag
    elements.currentFlag.src = TranslationUtils.languageConfig[lang].flag;
    elements.currentFlag.alt = TranslationUtils.languageConfig[lang].name;
    
    // Hide dropdown
    elements.languageDropdown.classList.add('hidden');
    
    // Reset title animation for new language
    AnimationUtils.resetTitleAnimation();
    
    // Start new game with new language
    await startNewGame();
}

// Start a new game
async function startNewGame() {
    try {
        showLoading(true);
        
        // Delete previous game if exists
        if (currentGame && currentGame.gameId) {
            await VerbsAPI.deleteGame(currentGame.gameId);
        }
        
        // Get new game from server with current language
        currentGame = await VerbsAPI.newGame(currentLanguage);
        
        // Reset UI
        resetGameUI();
        
        // Show game area
        elements.gameArea.classList.remove('hidden');
        elements.gameOver.classList.add('hidden');
        
        // Update display
        updateGameDisplay();
        
        showLoading(false);
    } catch (error) {
        showLoading(false);
        alert(TranslationUtils.t('errors.newGameFailed'));
        console.error(error);
    }
}

// Reset game UI
function resetGameUI() {
    elements.verbInput.value = '';
    elements.responseSection.classList.add('hidden');
    elements.usedWords.innerHTML = '';
    elements.usedVerbs.innerHTML = '';
    elements.score.textContent = '0';
    isProcessing = false;
}

// Update game display
function updateGameDisplay() {
    if (!currentGame) return;
    
    // Update word and emoji
    elements.wordDisplay.textContent = currentGame.word;
    elements.emojiDisplay.textContent = currentGame.emojis || '❓';
    
    // Update score
    elements.score.textContent = currentGame.score;
    
    // Update used words and verbs
    elements.usedWords.innerHTML = '';
    elements.usedVerbs.innerHTML = '';
    
    currentGame.usedWords.forEach(word => {
        AnimationUtils.addToUsedList(word, 'used-words');
    });
    
    currentGame.usedVerbs.forEach(verb => {
        AnimationUtils.addToUsedList(verb, 'used-verbs');
    });
}

// Submit a verb
async function submitVerb() {
    const verb = elements.verbInput.value.trim().toLowerCase();
    
    // Validation
    if (!verb) {
        AnimationUtils.shakeElement(elements.verbInput);
        return;
    }
    
    if (verb.length > 50) {
        alert(TranslationUtils.t('errors.tooLong'));
        return;
    }
    
    // Check if verb was already used
    if (currentGame.usedVerbs.includes(verb.replace(' ', '_'))) {
        alert(TranslationUtils.t('errors.alreadyUsed'));
        AnimationUtils.shakeElement(elements.verbInput);
        return;
    }
    
    // Disable input during processing
    isProcessing = true;
    elements.submitBtn.disabled = true;
    elements.verbInput.disabled = true;
    showLoading(true);
    
    try {
        // Submit guess to server
        const response = await VerbsAPI.guessVerb(currentGame.gameId, verb);
        
        // Update game state
        currentGame = response;
        
        // Show response
        AnimationUtils.showResponse(response.promptCount, response.llmOutput);
        
        // Clear input
        elements.verbInput.value = '';
        
        // Check if game is over
        if (!response.playing) {
            setTimeout(() => showGameOver(), 2000);
        } else {
            // Update display for next round
            updateGameDisplay();
        }
        
    } catch (error) {
        console.error('Error submitting verb:', error);
        
        if (error.message.includes('already')) {
            alert(TranslationUtils.t('errors.alreadyUsed'));
        } else {
            alert(TranslationUtils.t('errors.submitFailed'));
        }
        
        AnimationUtils.shakeElement(elements.verbInput);
    } finally {
        // Re-enable input
        isProcessing = false;
        elements.submitBtn.disabled = false;
        elements.verbInput.disabled = false;
        showLoading(false);
        elements.verbInput.focus();
    }
}

// Show game over screen
function showGameOver() {
    elements.gameArea.classList.add('hidden');
    elements.gameOver.classList.remove('hidden');
    
    elements.finalScore.textContent = currentGame.score;
    
    // Create game over message
    let message = '';
    const score = currentGame.score;
    
    if (score === 0) {
        message = TranslationUtils.t('gameOverMessages.zero');
    } else if (score < 5) {
        message = TranslationUtils.formatMessage('gameOverMessages.low', {
            score: score,
            rounds: TranslationUtils.getPluralRounds(score)
        });
    } else if (score < 10) {
        message = TranslationUtils.formatMessage('gameOverMessages.medium', { score });
    } else {
        message = TranslationUtils.formatMessage('gameOverMessages.high', { score });
    }
    
    elements.gameOverMessage.textContent = message;
}

// Show/hide loading spinner
function showLoading(show) {
    if (show) {
        elements.loading.classList.remove('hidden');
    } else {
        elements.loading.classList.add('hidden');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);