const cells = document.querySelectorAll('[data-cell]');
const status = document.querySelector('.status');
const restartButton = document.getElementById('restart');
const toggleModeButton = document.getElementById('toggle-mode');
let currentPlayer = 'x';
let gameActive = true;

const winningCombinations = [
    { cells: [0, 1, 2], type: 'row' },
    { cells: [3, 4, 5], type: 'row' },
    { cells: [6, 7, 8], type: 'row' },
    { cells: [0, 3, 6], type: 'column' },
    { cells: [1, 4, 7], type: 'column' },
    { cells: [2, 5, 8], type: 'column' },
    { cells: [0, 4, 8], type: 'diagonal-1' },
    { cells: [2, 4, 6], type: 'diagonal-2' }
];

function handleCellClick(e) {
    const cell = e.target;
    const currentClass = currentPlayer === 'x' ? 'x' : 'o';
    if (cell.classList.contains('x') || cell.classList.contains('o') || !gameActive) return;
    
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setStatusMessage();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function swapTurns() {
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

function setStatusMessage() {
    status.textContent = `${currentPlayer.toUpperCase()}'s turn`;
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        if (combination.cells.every(index => cells[index].classList.contains(currentClass))) {
            drawStrikeThrough(combination);
            return true;
        }
        return false;
    });
}

function drawStrikeThrough(combination) {
    const gameBoard = document.querySelector('.game-board');
    const strike = document.createElement('div');
    strike.classList.add('strike', `strike-${combination.type}`);
    gameBoard.appendChild(strike);

    const cellSize = cells[0].offsetWidth;
    const gapSize = 5; // The gap between cells
    const boardSize = 3 * cellSize + 2 * gapSize;

    if (combination.type === 'row') {
        const row = Math.floor(combination.cells[0] / 3);
        strike.style.top = `${row * (cellSize + gapSize) + cellSize / 2}px`;
        strike.style.left = `${gapSize / 2}px`;
        strike.style.width = '0';
        setTimeout(() => {
            strike.style.width = `${boardSize - gapSize}px`;
        }, 50);
    } else if (combination.type === 'column') {
        const col = combination.cells[0] % 3;
        strike.style.left = `${col * (cellSize + gapSize) + cellSize / 2}px`;
        strike.style.top = `${gapSize / 2}px`;
        strike.style.height = '0';
        setTimeout(() => {
            strike.style.height = `${boardSize - gapSize}px`;
        }, 50);
    } else if (combination.type === 'diagonal-1') {
        strike.style.top = `${gapSize / 2}px`;
        strike.style.left = `${gapSize / 2}px`;
        strike.style.width = '0';
        strike.style.transformOrigin = 'top left';
        setTimeout(() => {
            strike.style.width = `${Math.sqrt(2) * (boardSize - gapSize)}px`;
        }, 50);
    } else if (combination.type === 'diagonal-2') {
        strike.style.top = `${gapSize / 2}px`;
        strike.style.right = `${gapSize / 2}px`;
        strike.style.width = '0';
        strike.style.transformOrigin = 'top right';
        setTimeout(() => {
            strike.style.width = `${Math.sqrt(2) * (boardSize - gapSize)}px`;
        }, 50);
    }
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function endGame(draw) {
    if (draw) {
        showWinningMessage("It's a draw!");
    } else {
        showWinningMessage(`${currentPlayer.toUpperCase()} wins!`);
        triggerConfetti();
    }
    gameActive = false;
}

function showWinningMessage(message) {
    const winningMessage = document.createElement('div');
    winningMessage.classList.add('winning-message');
    winningMessage.textContent = message;
    document.body.appendChild(winningMessage);

    // Trigger reflow
    void winningMessage.offsetWidth;

    winningMessage.classList.add('show');

    setTimeout(() => {
        winningMessage.classList.remove('show');
        setTimeout(() => {
            winningMessage.remove();
        }, 500);
    }, 3000);

    status.textContent = message;
}

function triggerConfetti() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
        }));
    }, 250);
}

function restartGame() {
    currentPlayer = 'x';
    gameActive = true;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
    });
    const strikes = document.querySelectorAll('.strike');
    strikes.forEach(strike => strike.remove());
    const winningMessage = document.querySelector('.winning-message');
    if (winningMessage) {
        winningMessage.remove();
    }
    setStatusMessage();
}

function toggleMode() {
    const button = document.getElementById('toggle-mode');
    if (document.body.classList.toggle('light-mode')) {
        button.textContent = '☀️';
        button.setAttribute('aria-label', 'Switch to dark mode');
    } else {
        button.textContent = '🌙';
        button.setAttribute('aria-label', 'Switch to light mode');
    }
}

// Call this function on page load to set the initial icon
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('toggle-mode');
    button.textContent = '🌙';
    button.setAttribute('aria-label', 'Switch to light mode');
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
toggleModeButton.addEventListener('click', toggleMode);

setStatusMessage();