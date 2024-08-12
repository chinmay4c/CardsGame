const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const scoreDisplay = document.getElementById('score');
const modal = document.getElementById('victory-modal');
const finalStats = document.getElementById('final-stats');
const playAgainBtn = document.getElementById('play-again-btn');
const progressBar = document.getElementById('progress-bar');
const particlesContainer = document.getElementById('particles');

const cardSymbols = ['🚀', '🛸', '🛰️', '🪐', '🌠', '🌟', '🌙', '🌞', '👽', '👾', '🤖', '💫', '☄️', '🌈', '🌌', '🔭', '🛑', '⭐', '🌍', '🌎', '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌝', '🌛'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let score = 0;
let gameStarted = false;
let timerInterval;
let gameTime = 0;

function createCard(symbol) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="front"></div>
        <div class="back">${symbol}</div>
    `;
    card.addEventListener('click', flipCard);
    return card;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initializeGame() {
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    score = 0;
    gameTime = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    updateDisplays();

    const gridSize = parseInt(difficultySelect.value);
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const symbolsNeeded = (gridSize * gridSize) / 2;
    const gameSymbols = shuffleArray(cardSymbols).slice(0, symbolsNeeded);
    const symbols = [...gameSymbols, ...gameSymbols];
    shuffleArray(symbols);

    symbols.forEach(symbol => {
        const card = createCard(symbol);
        cards.push(card);
        gameBoard.appendChild(card);
    });

    updateProgressBar();
    createParticles();
}

function flipCard() {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.back').textContent;
    const symbol2 = card2.querySelector('.back').textContent;

    if (symbol1 === symbol2) {
        matchedPairs++;
        score += 10;
        flippedCards = [];

        card1.style.animation = 'cosmic-pulse 0.5s';
        card2.style.animation = 'cosmic-pulse 0.5s';

        setTimeout(() => {
            card1.style.animation = '';
            card2.style.animation = '';
        }, 500);

        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }

    updateDisplays();
    updateProgressBar();
}

function startTimer() {
    timerInterval = setInterval(() => {
        gameTime++;
        updateDisplays();
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    const finalScore = calculateFinalScore();
    finalStats.innerHTML = `
        <p>Time: ${gameTime}s</p>
        <p>Moves: ${moves}</p>
        <p>Final Score: ${finalScore}</p>
    `;
    modal.style.display = 'block';
}

function calculateFinalScore() {
    const timeBonus = Math.max(0, 100 - gameTime);
    const movesPenalty = Math.max(0, moves - cards.length);
    return score + timeBonus - movesPenalty;
}

function updateDisplays() {
    timerDisplay.textContent = `Time: ${gameTime}s`;
    movesDisplay.textContent = `Moves: ${moves}`;
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateProgressBar() {
    const progress = (matchedPairs / (cards.length / 2)) * 100;
    progressBar.style.width = `${progress}%`;
}

function createParticles() {
    particlesContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.backgroundColor = getRandomColor();
        particlesContainer.appendChild(particle);
    }
}

function getRandomColor() {
    const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--tertiary-color)'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function resetGame() {
    modal.style.display = 'none';
    initializeGame();
}

restartBtn.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// Initialize the game
initializeGame();

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        if (modal.style.display === 'block') {
            resetGame();
        } else {
            restartBtn.click();
        }
    }
});