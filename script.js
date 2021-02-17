//I create a factory function to create player objects.
function myObj(name) {
  let obj = Object.create(myObj.prototype);
  obj.name = name;
  return obj;
}

//I store some html elements in their respective variables on the global scope to be used later.
const displayStatus = document.querySelector(".game-title");
const body = document.querySelector("#backdrop");
const game = document.querySelector(".game-div");
const select = document.querySelector(".home");
const scoreDisplay = document.querySelector(".game-status");

//The game object in a module script to be unpacked by an IIFE.
const MyGame = (function() {
  //I initialize some variable properties to be used in  private/public scope.
  let gameOn = true;
  let currentPlayer = '';
  let playerOne = {};
  let playerTwo = {};
  let playerOneScore = 0;
  let playerTwoScore = 0;
  //This is the array to help check for winning sequences and hold cell indices.
  let gameState = ['', '', '', '', '', '', '', '', ''];
  //This is an array containing the winning sequences.
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

  //This function uses the random selection to initiate the marker of the current player. Either "X" or "O".
  const randomize = () => Math.floor(Math.random() * 2) === 0 ? currentPlayer = 'X': currentPlayer = 'O';

  //This function opens up the game board whenever the appropriate option is selected. The "VS. Player"
  const open = function() {
  let newPlayer = prompt(`Select a name for player "X".`, "");
  playerOne = myObj(newPlayer || "Player One");
  newPlayer = prompt(`Select a name for player "O".`, "");
  playerTwo = myObj(newPlayer || "Player Two");
  randomize();
  displayStatus.innerHTML = currentPlayerTurn();
  scoreDisplay.innerHTML = `${playerOne.name}: ${playerOneScore} ||| ${playerTwo.name}: ${playerTwoScore}`;
  body.style.opacity = 0.5;
  select.style.transform = "scale(0)";
  game.style.transform = "scale(1)";
};

//This function closes the game board whenever the CLOSE button is clicked.
//It resets game parameters and reopens the home menu.
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
  select.style.transform = "scale(1)";
};

//I created functions to display messages in specific html element based on outcome of game and player turn.
const winningMessage = function() {
  if (currentPlayer === 'X') {
      //This increments the player scores at the end of each win.
      playerOneScore++;
      return `${playerOne.name} has won the game.`;
  } else {
      playerTwoScore++;
      return `${playerTwo.name} has won the game.`;
  }
};

const drawMessage = () => `Game ended in a draw!`;

const currentPlayerTurn = function() {
  if (currentPlayer === "X") {
      return `It's ${playerOne.name}'s turn.`;
  } else {
      return `It's ${playerTwo.name}'s turn.`;
  }
};

//This function defines what happens when a cell is clicked. It populates the cell display with the appropriate marker.
const handleCellPlayed = (cellClick, cellIndex) => {
  gameState[cellIndex] = currentPlayer;
  cellClick.innerHTML = currentPlayer;
};

//This function switches the player turns after each play and displays which player is to play.
const playerSwitch = function() {
  currentPlayer = currentPlayer === "X" ? "O": "X";
  displayStatus.innerHTML = currentPlayerTurn();
};

//This function defines what happens each time a cell is clicked. It also calls other functions that'll populate the cell display and check game status.
const handleCellClick = e => {
  const cellClick = e.target;
  const cellIndex = parseInt(cellClick.getAttribute("data-cell-index"));
  if (gameState[cellIndex] !== '' || !gameOn) {
      return;
  }
  handleCellPlayed(cellClick, cellIndex);
  handleResultValidation();
};

//This function defines the main game logic.
const handleResultValidation = function() {
  let roundWon = false;
  for (let i=0; i<=7; i++) {
      //Each sequence is stored in a variable and each sequence's elements are in turn stored in their own variables
      const winSequence = winningConditions[i];
      let a = gameState[winSequence[0]];
      let b = gameState[winSequence[1]];
      let c = gameState[winSequence[2]];

      //Conditional to check if a winning sequence is complete. 
//First checks for incomplete sequence after each click and continues play.
  if (a === '' || b === '' || c === '') {
      continue;
  }

  //Second checks for complete sequence. If found, the variable is reinitialized.
  if (a === b && b === c) {
  roundWon = true; 
  break;
  }
}
//Conditional to use reinitialized variable to output winning messages and restart game flow.
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

//This conditional checks for when all game cells are filled up without a win. It outputs a draw message to the screen and restarts game flow.
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
//A call for the function that switches player markers after each game status has been checked.
playerSwitch();
};

//This function resets game parameters for whenever the RESTART button is clicked.
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
//I returned the important functions that will be needed as properties of the game object.
return { open, close, handleCellClick, handleRestartGame };
})();

//We then attach the functions to their appropriate buttons to ensure a smooth game flow.
document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", MyGame.handleCellClick));
document.querySelector(".game-restart").addEventListener("click", MyGame.handleRestartGame);
document.querySelector("#vs-player").addEventListener("click", MyGame.open);
document.querySelector(".game-close").addEventListener("click", MyGame.close);