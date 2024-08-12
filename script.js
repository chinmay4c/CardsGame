const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const scoreDisplay = document.getElementById('score');
const modal = document.getElementById('victory-modal');
const finalStats = document.getElementById('final-stats');
const playAgainBtn = document.getElementById('play-again-btn');
const starsContainer = document.getElementById('stars-container');

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

    createStars();
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

        card1.style.animation = 'pulse 0.5s';
        card2.style.animation = 'pulse 0.5s';

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
}

function startTimer() {
    timerInterval = setInterval(() => {
        gameTime++;
        updateDisplays();
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    const finalScore = score + Math.max(0, 100 - gameTime - moves);
    finalStats.textContent = `Time: ${gameTime}s | Moves: ${moves} | Final Score: ${finalScore}`;
    modal.style.display = 'block';
}

function updateDisplays() {
    timerDisplay.textContent = `Time: ${gameTime}s`;
    movesDisplay.textContent = `Moves: ${moves}`;
    scoreDisplay.textContent = `Score: ${score}`;
}

function createStars() {
    starsContainer.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainer.appendChild(star);
    }
}

restartBtn.addEventListener('click', initializeGame);
difficultySelect.addEventListener('change', initializeGame);
playAgainBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    initializeGame();
});

initializeGame();