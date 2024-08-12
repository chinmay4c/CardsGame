const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const highScoreDisplay = document.getElementById('high-score');
const muteBtn = document.getElementById('mute-btn');

const cardSymbols = ['🚀', '🛸', '🛰️', '🪐', '🌠', '🌟', '🌙', '🌞', '👽', '👾', '🤖', '💫', '☄️', '🌈', '🌌', '🔭', '🛑', '⭐', '🌍', '🌎', '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌝', '🌛'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let timerInterval;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let isMuted = false;

const flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3');
const matchSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-complete-or-approved-mission-205.mp3');
const victorySound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3');

highScoreDisplay.textContent = `High Score: ${highScore}`;

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
    gameTime = 0;
    gameStarted = false;
    clearInterval(timerInterval);
    timerDisplay.textContent = 'Time: 0s';
    movesDisplay.textContent = 'Moves: 0';

    const difficulty = difficultySelect.value;
    let gridSize;
    switch (difficulty) {
        case 'easy':
            gridSize = 4;
            break;
        case 'medium':
            gridSize = 6;
            break;
        case 'hard':
            gridSize = 8;
            break;
    }

    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    const symbolsNeeded = (gridSize * gridSize) / 2;
    const gameSymbols = cardSymbols.slice(0, symbolsNeeded);
    const symbols = [...gameSymbols, ...gameSymbols];
    shuffleArray(symbols);

    symbols.forEach(symbol => {
        const card = createCard(symbol);
        cards.push(card);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (!isMuted) flipSound.play();

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = `Moves: ${moves}`;
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
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];

        if (!isMuted) matchSound.play();

        if (matchedPairs === cards.length / 2) {
            clearInterval(timerInterval);
            if (!isMuted) victorySound.play();
            updateHighScore();
            setTimeout(() => {
                alert(`Congratulations! You won in ${gameTime} seconds with ${moves} moves!`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        gameTime++;
        timerDisplay.textContent = `Time: ${gameTime}s`;
    }, 1000);
}

function updateHighScore() {
    const score = Math.round(10000 / (gameTime + moves));
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
}

restartBtn.addEventListener('click', initializeGame);
difficultySelect.addEventListener('change', initializeGame);
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? 'Unmute Sound' : 'Mute Sound';
});

initializeGame();

// Initialize particle.js
particlesJS('particles-js', {
    particles: {
        number: { value: 100 },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        move: { enable: true, speed: 1 }
    }
});