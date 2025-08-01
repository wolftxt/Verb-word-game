// Title Animation Words per language
const titleWordsByLanguage = {
    en: ['fish', 'bear', 'bird', 'tree', 'cloud', 'star', 'moon'],
    de: ['Fisch', 'Bär', 'Vogel', 'Baum', 'Wolke', 'Stern', 'Mond'],
    cz: ['ryba', 'medvěd', 'pták', 'strom', 'mrak', 'hvězda', 'měsíc']
};

let currentWordIndex = 0;
let isDeleting = false;
let titleText = '';
let charIndex = 0;

// Title animation function
function animateTitle() {
    const titleWordElement = document.getElementById('title-word');
    const lang = TranslationUtils.getCurrentLanguage();
    const titleWords = titleWordsByLanguage[lang] || titleWordsByLanguage.en;
    const currentWord = titleWords[currentWordIndex];
    
    if (isDeleting) {
        titleText = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        titleText = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    titleWordElement.textContent = titleText;
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at the end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % titleWords.length;
        typeSpeed = 500; // Pause before typing new word
    }
    
    setTimeout(animateTitle, typeSpeed);
}

// Tutorial animation
function animateTutorial() {
    const tutorialVerb = document.querySelector('.tutorial-verb');
    const verb = TranslationUtils.t('tutorialVerb');
    tutorialVerb.textContent = '';
    let i = 0;
    
    const typeVerb = () => {
        if (i < verb.length) {
            tutorialVerb.textContent += verb.charAt(i);
            i++;
            setTimeout(typeVerb, 150);
        }
    };
    
    setTimeout(typeVerb, 1000);
}

// Add item to used list with animation
function addToUsedList(item, listId) {
    const list = document.getElementById(listId);
    const itemElement = document.createElement('span');
    itemElement.className = 'used-item';
    itemElement.textContent = item;
    list.appendChild(itemElement);
    
    // Scroll to bottom to show new item
    list.scrollTop = list.scrollHeight;
}

// Show response with animation
function showResponse(promptCount, llmOutput) {
    const responseSection = document.getElementById('response-section');
    const promptCountElement = document.getElementById('prompt-count');
    const llmResponseElement = document.getElementById('llm-response');
    
    // Format prompt count message
    const ordinal = TranslationUtils.getOrdinal(promptCount);
    promptCountElement.textContent = TranslationUtils.formatMessage('promptCountMessage', { ordinal });
    
    // Show LLM response
    llmResponseElement.textContent = llmOutput;
    
    // Show section with animation
    responseSection.classList.remove('hidden');
}

// Get ordinal number (1st, 2nd, 3rd, etc.)
function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Shake animation for errors
function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// CSS for shake animation (add to styles.css if not present)
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`;

// Add shake animation to document if not already present
if (!document.querySelector('style[data-shake]')) {
    const style = document.createElement('style');
    style.setAttribute('data-shake', 'true');
    style.textContent = shakeKeyframes;
    document.head.appendChild(style);
}

// Export functions for use in game.js
window.AnimationUtils = {
    animateTitle,
    animateTutorial,
    addToUsedList,
    showResponse,
    shakeElement,
    resetTitleAnimation: () => {
        currentWordIndex = 0;
        isDeleting = false;
        titleText = '';
        charIndex = 0;
    }
}; 