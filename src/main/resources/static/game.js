// Game State
let currentGame = null;
let isProcessing = false;

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
    loading: document.getElementById('loading')
};

// Initialize the game
function init() {
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
}

// Start a new game
async function startNewGame() {
    try {
        showLoading(true);
        
        // Delete previous game if exists
        if (currentGame && currentGame.gameId) {
            await VerbsAPI.deleteGame(currentGame.gameId);
        }
        
        // Get new game from server
        currentGame = await VerbsAPI.newGame();
        
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
        alert('Failed to start new game. Please try again.');
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
        alert('Verb is too long! Please keep it under 50 characters.');
        return;
    }
    
    // Check if verb was already used
    if (currentGame.usedVerbs.includes(verb.replace(' ', '_'))) {
        alert('This verb has already been used! Try another one.');
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
            alert('This verb has already been used! Try another one.');
        } else {
            alert('Failed to submit verb. Please try again.');
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
    if (currentGame.score === 0) {
        message = "Better luck next time! The chain broke on the first word.";
    } else if (currentGame.score < 5) {
        message = `Not bad! You kept the chain going for ${currentGame.score} ${currentGame.score === 1 ? 'round' : 'rounds'}.`;
    } else if (currentGame.score < 10) {
        message = `Great job! You maintained the chain for ${currentGame.score} rounds!`;
    } else {
        message = `Amazing! You're a verb master with ${currentGame.score} successful rounds!`;
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
