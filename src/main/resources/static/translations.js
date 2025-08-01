// Translation system
const translations = {
    en: {
        title: "What does a ___ do?",
        tutorialTitle: 'Welcome to "What does a ___ do?"',
        tutorialText1: "Think of a verb that describes what the given noun does!",
        tutorialText2: "The AI will respond with a creative story and give you a new word.",
        tutorialText3: "Try to keep the chain going as long as possible!",
        startButton: "Start Playing",
        verbPlaceholder: "Enter a verb...",
        submitButton: "Submit",
        scoreLabel: "Score",
        usedWordsTitle: "Used Words",
        usedVerbsTitle: "Used Verbs",
        gameOverTitle: "Game Over!",
        finalScoreLabel: "Final Score",
        newGameButton: "New Game",
        loadingText: "Loading...",
        errors: {
            tooLong: "Verb is too long! Please keep it under 50 characters.",
            alreadyUsed: "This verb has already been used! Try another one.",
            submitFailed: "Failed to submit verb. Please try again.",
            newGameFailed: "Failed to start new game. Please try again."
        },
        gameOverMessages: {
            zero: "Better luck next time! The chain broke on the first word.",
            low: "Not bad! You kept the chain going for {score} {rounds}.",
            medium: "Great job! You maintained the chain for {score} rounds!",
            high: "Amazing! You're a verb master with {score} successful rounds!"
        },
        promptCountMessage: "You are the {ordinal} person to say that!",
        tutorialWord: "Rabbit",
        tutorialVerb: "jumps"
    },
    de: {
        title: "Was macht ein/e ___ ?",
        tutorialTitle: 'Willkommen bei "Was macht ein/e ___ ?"',
        tutorialText1: "Denke dir ein Verb aus, das beschreibt, was das Nomen tut!",
        tutorialText2: "Die KI antwortet mit einer kreativen Geschichte und gibt dir ein neues Wort.",
        tutorialText3: "Versuche, die Kette so lange wie möglich aufrechtzuerhalten!",
        startButton: "Spiel starten",
        verbPlaceholder: "Verb eingeben...",
        submitButton: "Absenden",
        scoreLabel: "Punkte",
        usedWordsTitle: "Verwendete Wörter",
        usedVerbsTitle: "Verwendete Verben",
        gameOverTitle: "Spiel vorbei!",
        finalScoreLabel: "Endpunktzahl",
        newGameButton: "Neues Spiel",
        loadingText: "Lädt...",
        errors: {
            tooLong: "Das Verb ist zu lang! Bitte maximal 50 Zeichen verwenden.",
            alreadyUsed: "Dieses Verb wurde bereits verwendet! Versuche ein anderes.",
            submitFailed: "Fehler beim Absenden. Bitte erneut versuchen.",
            newGameFailed: "Fehler beim Starten eines neuen Spiels. Bitte erneut versuchen."
        },
        gameOverMessages: {
            zero: "Mehr Glück beim nächsten Mal! Die Kette brach beim ersten Wort.",
            low: "Nicht schlecht! Du hast die Kette {score} {rounds} lang gehalten.",
            medium: "Gut gemacht! Du hast die Kette {score} Runden lang aufrechterhalten!",
            high: "Fantastisch! Du bist ein Verb-Meister mit {score} erfolgreichen Runden!"
        },
        promptCountMessage: "Du bist die {ordinal} Person, die das gesagt hat!",
        tutorialWord: "Hase",
        tutorialVerb: "hüpft"
    },
    cz: {
        title: "Co dělá ___?",
        tutorialTitle: 'Vítejte ve hře "Co dělá ___?"',
        tutorialText1: "Vymyslete sloveso, které popisuje, co dané podstatné jméno dělá!",
        tutorialText2: "AI odpoví kreativním příběhem a dá vám nové slovo.",
        tutorialText3: "Snažte se udržet řetězec co nejdéle!",
        startButton: "Začít hrát",
        verbPlaceholder: "Zadejte sloveso...",
        submitButton: "Odeslat",
        scoreLabel: "Skóre",
        usedWordsTitle: "Použitá slova",
        usedVerbsTitle: "Použitá slovesa",
        gameOverTitle: "Konec hry!",
        finalScoreLabel: "Konečné skóre",
        newGameButton: "Nová hra",
        loadingText: "Načítání...",
        errors: {
            tooLong: "Sloveso je příliš dlouhé! Použijte maximálně 50 znaků.",
            alreadyUsed: "Toto sloveso již bylo použito! Zkuste jiné.",
            submitFailed: "Nepodařilo se odeslat sloveso. Zkuste to znovu.",
            newGameFailed: "Nepodařilo se začít novou hru. Zkuste to znovu."
        },
        gameOverMessages: {
            zero: "Příště více štěstí! Řetězec se přerušil u prvního slova.",
            low: "Není to špatné! Udrželi jste řetězec {score} {rounds}.",
            medium: "Skvělá práce! Udrželi jste řetězec {score} kol!",
            high: "Úžasné! Jste mistr sloves s {score} úspěšnými koly!"
        },
        promptCountMessage: "Jste {ordinal} osoba, která to řekla!",
        tutorialWord: "Králík",
        tutorialVerb: "skáče"
    }
};

// Language configuration
const languageConfig = {
    en: { 
        flag: 'https://flagcdn.com/24x18/gb.png', 
        name: 'English',
        ordinalSuffix: (n) => {
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        },
        pluralRounds: (n) => n === 1 ? 'round' : 'rounds'
    },
    de: { 
        flag: 'https://flagcdn.com/24x18/de.png', 
        name: 'Deutsch',
        ordinalSuffix: (n) => n + '.',
        pluralRounds: (n) => n === 1 ? 'Runde' : 'Runden'
    },
    cz: { 
        flag: 'https://flagcdn.com/24x18/cz.png', 
        name: 'Čeština',
        ordinalSuffix: (n) => n + '.',
        pluralRounds: (n) => {
            if (n === 1) return 'kolo';
            if (n >= 2 && n <= 4) return 'kola';
            return 'kol';
        }
    }
};

// Get current language from localStorage or default to 'en'
function getCurrentLanguage() {
    return localStorage.getItem('verbsGameLanguage') || 'en';
}

// Set current language
function setCurrentLanguage(lang) {
    localStorage.setItem('verbsGameLanguage', lang);
}

// Get translation for a key
function t(key) {
    const lang = getCurrentLanguage();
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        value = value[k];
        if (!value) return key; // Return key if translation not found
    }
    
    return value;
}

// Get formatted message with placeholders
function formatMessage(key, params = {}) {
    let message = t(key);
    
    for (const [param, value] of Object.entries(params)) {
        message = message.replace(`{${param}}`, value);
    }
    
    return message;
}

// Get ordinal number for current language
function getOrdinal(n) {
    const lang = getCurrentLanguage();
    return languageConfig[lang].ordinalSuffix(n);
}

// Get plural form for rounds
function getPluralRounds(n) {
    const lang = getCurrentLanguage();
    return languageConfig[lang].pluralRounds(n);
}

// Update UI with translations
function updateUITranslations() {
    const lang = getCurrentLanguage();
    
    // Update all elements with translations
    document.getElementById('tutorial-title').textContent = t('tutorialTitle');
    document.getElementById('tutorial-text-1').textContent = t('tutorialText1');
    document.getElementById('tutorial-text-2').textContent = t('tutorialText2');
    document.getElementById('tutorial-text-3').textContent = t('tutorialText3');
    document.getElementById('start-game-btn').textContent = t('startButton');
    document.getElementById('verb-input').placeholder = t('verbPlaceholder');
    document.getElementById('submit-btn').textContent = t('submitButton');
    document.getElementById('score-label').textContent = t('scoreLabel');
    document.getElementById('used-words-title').textContent = t('usedWordsTitle');
    document.getElementById('used-verbs-title').textContent = t('usedVerbsTitle');
    document.getElementById('game-over-title').textContent = t('gameOverTitle');
    document.getElementById('final-score-label').textContent = t('finalScoreLabel');
    document.getElementById('new-game-btn').textContent = t('newGameButton');
    
    // Update tutorial word
    document.getElementById('tutorial-word').textContent = t('tutorialWord');
    
    // Update current language flag
    const currentFlag = document.getElementById('current-flag');
    currentFlag.src = languageConfig[lang].flag;
    currentFlag.alt = languageConfig[lang].name;
}

// Export functions
window.TranslationUtils = {
    getCurrentLanguage,
    setCurrentLanguage,
    t,
    formatMessage,
    getOrdinal,
    getPluralRounds,
    updateUITranslations,
    languageConfig
};
