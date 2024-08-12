const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const highScoreDisplay = document.getElementById('high-score');
const comboDisplay = document.getElementById('combo');
const muteBtn = document.getElementById('mute-btn');
const themeBtn = document.getElementById('theme-btn');
const revealBtn = document.getElementById('reveal-btn');
const freezeBtn = document.getElementById('freeze-btn');

const cardSymbols = ['🌌', '🌠', '🚀', '🛸', '🛰️', '🪐', '🌟', '🌙', '🌞', '👽', '🤖', '💫', '☄️', '🌈', '🔭', '🛑', '⭐', '🌍', '🌎', '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌝', '🌛', '🌜'];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let timerInterval;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let isMuted = false;
let isDarkTheme = true;
let combo = 1;
let revealPowerups = 3;
let freezePowerups = 1;

const flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3');
const matchSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-sparkle-shimmer-2877.mp3');
const victorySound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
const comboSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-changing-tab-206.mp3');

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
    combo = 1;
    clearInterval(timerInterval);
    updateDisplays();

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

    revealPowerups = 3;
    freezePowerups = 1;
    updatePowerupButtons();
}

function flipCard() {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if (flippedCards.length < 2 && !this.classList.contains('flipped') && !this.classList.contains('matched')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (!isMuted) flipSound.play();

        if (flippedCards.length === 2) {
            moves++;
            updateDisplays();
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

        combo++;
        if (combo > 1 && !isMuted) comboSound.play();

        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            combo = 1;
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
    if (!isMuted) victorySound.play();
    updateHighScore();
    setTimeout(() => {
        alert(`Congratulations! You won in ${gameTime} seconds with ${moves} moves!`);
    }, 500);
}

function updateHighScore() {
    const score = Math.round(10000 / (gameTime + moves));
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
}

function updateDisplays() {
    timerDisplay.textContent = `Time: ${gameTime}s`;
    movesDisplay.textContent = `Moves: ${moves}`;
    comboDisplay.textContent = `Combo: x${combo}`;
}

function updatePowerupButtons() {
    revealBtn.textContent = `Reveal (${revealPowerups})`;
    freezeBtn.textContent = `Freeze Time (${freezePowerups})`;
    revealBtn.disabled = revealPowerups === 0;
    freezeBtn.disabled = freezePowerups === 0;
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme');
    themeBtn.textContent = isDarkTheme ? 'Light Theme' : 'Dark Theme';
}

function revealCards() {
    if (revealPowerups > 0) {
        revealPowerups--;
    }
}