let gameId = null;

const currentWordEl = document.getElementById("current-word");
const emojisEl = document.getElementById("emojis");
const wittyResponseEl = document.getElementById("witty-response");
const scoreEl = document.getElementById("score");
const guessForm = document.getElementById("guess-form");
const verbInput = document.getElementById("verb-input");
const startBtn = document.getElementById("start-btn");
const gameOverEl = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");
const counterEl = document.getElementById("counter");

function updateUI(state) {
    gameId = state.gameId;
    currentWordEl.textContent = state.word || "___";
    emojisEl.textContent = state.emojis || "";
    wittyResponseEl.textContent = state.llmOutput || "";
    scoreEl.textContent = `Score: ${state.score || 0}`;
    if (state.counter && state.counter > 0) {
        counterEl.textContent = `This verb has been used ${state.counter} time(s) for this word.`;
    } else {
        counterEl.textContent = "";
    }
    if (!state.playing) {
        guessForm.classList.add("hidden");
        gameOverEl.classList.remove("hidden");
    } else {
        guessForm.classList.remove("hidden");
        gameOverEl.classList.add("hidden");
    }
}

async function startNewGame() {
    const res = await fetch("/api/verbs/newGame");
    if (res.ok) {
        const state = await res.json();
        updateUI(state);
        verbInput.value = "";
        verbInput.focus();
    } else {
        wittyResponseEl.textContent = "Failed to start a new game.";
    }
}

async function submitGuess(e) {
    e.preventDefault();
    const guess = verbInput.value.trim();
    if (!guess || !gameId) return;
    const res = await fetch("/api/verbs/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess }),
    });
    if (res.ok) {
        const state = await res.json();
        updateUI(state);
        verbInput.value = "";
        verbInput.focus();
    } else {
        wittyResponseEl.textContent = "Invalid guess or error occurred.";
    }
}

startBtn.addEventListener("click", startNewGame);
restartBtn.addEventListener("click", startNewGame);
guessForm.addEventListener("submit", submitGuess);

document.addEventListener("DOMContentLoaded", () => {
    startBtn.classList.remove("hidden");
    gameOverEl.classList.add("hidden");
    guessForm.classList.add("hidden");
});
