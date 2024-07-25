document.addEventListener('DOMContentLoaded', () => {
  const X_CLASS = 'x';
  const O_CLASS = 'o';
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const board = document.getElementById('board');
  const statusMessage = document.getElementById('status-message');
  const restartButton = document.getElementById('restart-button');
  const cells = document.querySelectorAll('[data-cell]');
  const selectXButton = document.getElementById('select-x');
  const selectOButton = document.getElementById('select-o');
  const menu = document.querySelector('.menu');
  const container = document.querySelector('.container');
  const scoreX = document.getElementById('score-x');
  const scoreO = document.getElementById('score-o');
  const playerXNameInput = document.getElementById('player-x-name');
  const playerONameInput = document.getElementById('player-o-name');
  const timerElement = document.getElementById('time-left');

  let currentPlayer;
  let gameActive = true;
  let scoreXValue = 0;
  let scoreOValue = 0;
  let timeLeft;
  let timerInterval;

  console.log('Script loaded');

  selectXButton.addEventListener('click', () => {
    console.log('X selected');
    startGame(X_CLASS);
  });

  selectOButton.addEventListener('click', () => {
    console.log('O selected');
    startGame(O_CLASS);
  });

  restartButton.addEventListener('click', () => {
    console.log('Restart button clicked');
    startGame(currentPlayer); // Restart with the current player
  });

  function startGame(startingPlayer) {
    console.log('Starting game with', startingPlayer);
    currentPlayer = startingPlayer;
    gameActive = true;
    const playerName = startingPlayer === X_CLASS ? playerXNameInput.value || 'Player X' : playerONameInput.value || 'Player O';
    statusMessage.innerText = `${playerName}'s turn`;
    menu.classList.add('hidden');
    container.classList.remove('hidden');
    statusMessage.classList.remove('fade-in');
    setTimeout(() => {
      statusMessage.classList.add('fade-in');
    }, 300);
    cells.forEach(cell => {
      cell.classList.remove(X_CLASS, O_CLASS, 'winning-cell');
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick, { once: true });
      cell.textContent = '';
    });
    resetTimer();
  }

  function handleClick(event) {
    const cell = event.target;
    if (!gameActive) return;
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
      const winningCombination = getWinningCombination(currentPlayer);
      if (winningCombination) {
        highlightWinningCells(winningCombination);
      }
      endGame(currentPlayer);
    } else if (isDraw()) {
      endGame(null);
    } else {
      swapTurns();
    }
  }

  function endGame(winningClass) {
    gameActive = false;
    clearInterval(timerInterval);
    const playerName = winningClass === X_CLASS ? playerXNameInput.value || 'Player X' : playerONameInput.value || 'Player O';
    if (winningClass) {
      statusMessage.innerText = `${playerName} wins!`;
      updateScore(winningClass);
    } else {
      statusMessage.innerText = 'Draw!';
    }
    statusMessage.classList.remove('fade-in');
    setTimeout(() => {
      statusMessage.classList.add('fade-in');
    }, 300);
  }

  function isDraw() {
    return [...cells].every(cell => {
      return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
  }

  function placeMark(cell, currentClass) {
    cell.textContent = currentClass.toUpperCase();
    cell.classList.add(currentClass);
    resetTimer();
  }

  function swapTurns() {
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
    const playerName = currentPlayer === X_CLASS ? playerXNameInput.value || 'Player X' : playerONameInput.value || 'Player O';
    statusMessage.innerText = `${playerName}'s turn`;
    statusMessage.classList.remove('fade-in');
    setTimeout(() => {
      statusMessage.classList.add('fade-in');
    }, 300);
    resetTimer();
  }

  function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
      return combination.every(index => {
        return cells[index].classList.contains(currentClass);
      });
    });
  }

  function getWinningCombination(currentClass) {
    return WINNING_COMBINATIONS.find(combination => {
      return combination.every(index => {
        return cells[index].classList.contains(currentClass);
      });
    });
  }

  function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
      cells[index].classList.add('winning-cell');
    });
  }

  function updateScore(winningClass) {
    if (winningClass === X_CLASS) {
      scoreXValue++;
      scoreX.innerText = `${scoreXValue}`;
    } else if (winningClass === O_CLASS) {
      scoreOValue++;
      scoreO.innerText = `${scoreOValue}`;
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 10; // Set the time limit for each turn (in seconds)
    timerElement.innerText = timeLeft;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.innerText = timeLeft;
      if (timeLeft <= 0) {
        swapTurns();
      }
    }, 1000);
  }
});
