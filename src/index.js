import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

function playerObj(name) {
  let obj = Object.create(playerObj.prototype);
  obj.name = name;
  return obj;
}

const displayStatus = document.querySelector(".game-title");
const body = document.querySelector("#backdrop");
const game = document.querySelector(".game-div");
const gameType = document.querySelector(".home");
const scoreDisplay = document.querySelector(".game-status");

const MyGame = (function() {
  let gameOn = true;
  let currentPlayer = '';
  let playerOne = {};
  let playerTwo = {};
  let playerOneScore = 0;
  let playerTwoScore = 0;
  let gameState = ['', '', '', '', '', '', '', '', ''];
  let winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
  ];

  const randomize = () => Math.floor(Math.random() * 2) === 0 ? currentPlayer = 'X': currentPlayer = 'O';

  const open = function() {
  let newPlayer = prompt(`Select a name for player "X".`, "");
  playerOne = playerObj(newPlayer || "Player One");
  newPlayer = prompt(`Select a name for player "O".`, "");
  playerTwo = playerObj(newPlayer || "Player Two");
  randomize();
  displayStatus.innerHTML = currentPlayerTurn();
  scoreDisplay.innerHTML = `${playerOne.name}: ${playerOneScore} ||| ${playerTwo.name}: ${playerTwoScore}`;
  body.style.opacity = 0.4;
  gameType.style.transform = "scale(0)";
  game.style.transform = "scale(1)";
};

const close = function () {
  gameOn = true;
  currentPlayer = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  playerOneScore = 0;
  playerTwoScore = 0;
  playerOne = {};
  playerTwo = {};
  displayStatus.innerHTML = "";
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
  game.style.transform = "scale(0)";
  body.style.opacity = 0;
  gameType.style.transform = "scale(1)";
};

const winningMessage = function() {
  if (currentPlayer === 'X') {
      playerOneScore++;
      return `${playerOne.name} has won the game.`;
  } else {
      playerTwoScore++;
      return `${playerTwo.name} has won the game.`;
  }
};

const drawMessage = () => `Game ended in a draw!`;

const currentPlayerTurn = () => currentPlayer === 'X' ? `It's ${playerOne.name}'s turn.` : `It's ${playerTwo.name}'s turn.`;

const playerSwitch = function() {
  currentPlayer = currentPlayer === "X" ? "O": "X";
  displayStatus.innerHTML = currentPlayerTurn();
};

const handleCellPlayed = (cellClick, cellIndex) => {
  gameState[cellIndex] = currentPlayer;
  cellClick.innerHTML = currentPlayer;
};

const handleCellClick = e => {
  const cellClick = e.target;
  const cellIndex = parseInt(cellClick.getAttribute("data-cell-index"));
  if (gameState[cellIndex] !== '' || !gameOn) {
      return;
  }
  handleCellPlayed(cellClick, cellIndex);
  handleResultValidation();
};

const handleResultValidation = function() {
  let roundWon = false;
  for (let i=0; i<=7; i++) {
      //Each sequence is stored in a variable and each sequence's elements are in turn stored in their own variables
      const winSequence = winningConditions[i];
      let a = gameState[winSequence[0]];
      let b = gameState[winSequence[1]];
      let c = gameState[winSequence[2]];

  if (a === '' || b === '' || c === '') {
      continue;
  }

  if (a === b && b === c) {
  roundWon = true; 
  break;
  }
}

if(roundWon) {
  displayStatus.innerHTML = winningMessage();
  gameOn = false;
  scoreDisplay.innerHTML = `${playerOne.name}: ${playerOneScore} ||| ${playerTwo.name}: ${playerTwoScore}`;
  setTimeout(function() {
  gameOn = true;
  randomize();
  gameState = ["", "", "", "", "", "", "", "", ""];
  displayStatus.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}, 1500);
return;
}

let roundDraw = !gameState.includes("");
if (roundDraw) {
  displayStatus.innerHTML = drawMessage();
  gameOn = false;
  scoreDisplay.innerHTML = `${playerOne.name}: ${playerOneScore} ||| ${playerTwo.name}: ${playerTwoScore}`;
  setTimeout(function() {
  gameOn = true;
  randomize();
  gameState = ["", "", "", "", "", "", "", "", ""];
  displayStatus.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}, 1500);
return;
}
playerSwitch();
};

const handleRestartGame = function() {
  gameOn = true;
  randomize();
  gameState = ["", "", "", "", "", "", "", "", ""];
  playerOneScore = 0;
  playerTwoScore = 0;
  scoreDisplay.innerHTML = `${playerOne.name}: ${playerOneScore} ||| ${playerTwo.name}: ${playerTwoScore}`;
  displayStatus.innerHTML = currentPlayerTurn();
  document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
};

return { open, close, handleCellClick, handleRestartGame };
})();


document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", MyGame.handleCellClick));
document.querySelector(".game-restart").addEventListener("click", MyGame.handleRestartGame);
document.querySelector("#vs-player").addEventListener("click", MyGame.open);
document.querySelector(".game-close").addEventListener("click", MyGame.close);