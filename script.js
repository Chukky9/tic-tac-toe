//I create a factory function to create player objects.
function myObj(name) {
  let obj = Object.create(myObj.prototype);
  obj.name = name;
  obj.getData = function() {
      return `Your name is ${this.name} amd your marker is ${this.indicator}.`;
  }
  return obj;
}

//I store some html elements in their respective variables on the global scope to be used later.
const displayStatus = document.querySelector(".game-title");
const body = document.querySelector("#backdrop");
const game = document.querySelector(".game-div");
const select = document.querySelector(".home");
const scoreDisplay = document.querySelector(".game-status");

//The game object.
let MyGame = {
  //I initialize some variable properties to be used in  private/public scope.
  gameOn: true,
  currentPlayer: '',
  playerOne: {},
  playerTwo: {},
  playerOneScore: 0,
  playerTwoScore: 0,
  //This is the array to help check for winning sequences and hold cell indices.
  gameState: ['', '', '', '', '', '', '', '', ''],
  //This is an array containing the winning sequences.
  winningConditions: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],

  //This function uses the random selection to initiate the marker of the current player. Either "X" or "O".
  randomize: function() {
    if (Math.floor(Math.random() * 2) === 0) {
      MyGame.currentPlayer = "X";
    } else {
      MyGame.currentPlayer = "O";
    }
  },

  //This function opens up the game board whenever the appropriate option is selected. The "VS. Player"
  open: function() {
    //It takes input from two prompt messages to create the player one and two objects.
    let newPlayer = prompt(`Select a name for player "X".`, "");
    MyGame.playerOne = myObj(newPlayer);
    newPlayer = prompt(`Select a name for player "O".`, "");
    MyGame.playerTwo = myObj(newPlayer);
    MyGame.randomize();
    displayStatus.innerHTML = MyGame.currentPlayerTurn();
    scoreDisplay.innerHTML = `${MyGame.playerOne.name}: ${MyGame.playerOneScore} ||| ${MyGame.playerTwo.name}: ${MyGame.playerTwoScore}`;
    body.style.opacity = 0.5;
    select.style.transform = "scale(0)";
    game.style.transform = "scale(1)";
  },

  //This function closes the game board whenever the CLOSE button is clicked.
  //It resets game parameters and reopens the home menu.
  close: function() {
    MyGame.gameOn = true;
    MyGame.currentPlayer = "";
    MyGame.gameState = ["", "", "", "", "", "", "", "", ""];
    MyGame.playerOneScore = 0;
    MyGame.playerTwoScore = 0;
    MyGame.playerOne = {};
    MyGame.playerTwo = {};
    displayStatus.innerHTML = "";
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
    game.style.transform = "scale(0)";
    body.style.opacity = 0;
    select.style.transform = "scale(1)";
  },

  //I created functions to display messages in specific html element based on outcome of game and player turn.
  winningMessage: function() {
    if (MyGame.currentPlayer === "X") {
      //This increments the player scores at the end of each win.
      MyGame.playerOneScore++;
      return `${MyGame.playerOne.name} has won the game.`;
    } else {
      MyGame.playerTwoScore++;
      return `${MyGame.playerTwo.name} has won the game.`;
    }
  },
  drawMessage: () => `Game ended in a draw!`,
  currentPlayerTurn: function() {
    if (MyGame.currentPlayer === "X") {
      return `It's ${MyGame.playerOne.name}'s turn.`;
    } else {
      return `It's ${MyGame.playerTwo.name}'s turn.`;
    }
  },
  
  //This function defines what happens when a cell is clicked. It populates the cell display with the appropriate marker.
  handleCellPlayed: function(cellClick, cellIndex) {
    MyGame.gameState[cellIndex] = MyGame.currentPlayer;
    cellClick.innerHTML = MyGame.currentPlayer;
  },

    //This function switches the player turns after each play and displays which player is to play.
  playerSwitch: function() {
    MyGame.currentPlayer = MyGame.currentPlayer === "X" ? "O": "X";
    displayStatus.innerHTML = MyGame.currentPlayerTurn();
  },

    //This function defines what happens each time a cell is clicked. It also calls other functions that'll populate the cell display and check game status.
  handleCellClick: function(e) {
    const cellClick = e.target;
    const cellIndex = parseInt(cellClick.getAttribute("data-cell-index"));
    if (MyGame.gameState[cellIndex] !== '' || !MyGame.gameOn) {
        return;
    }
    MyGame.handleCellPlayed(cellClick, cellIndex);
    MyGame.handleResultValidation();
  },

  //This function defines the main game logic.
  handleResultValidation: function() {
    let roundWon = false;
    for (let i=0; i<=7; i++) {
      //Each sequence is stored in a variable and each sequence's elements are in turn stored in their own variables
      const winSequence = MyGame.winningConditions[i];
      let a = MyGame.gameState[winSequence[0]];
      let b = MyGame.gameState[winSequence[1]];
      let c = MyGame.gameState[winSequence[2]];
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
    if (roundWon) {

      displayStatus.innerHTML = MyGame.winningMessage();
      MyGame.gameOn = false;
      scoreDisplay.innerHTML = `${MyGame.playerOne.name}: ${MyGame.playerOneScore} ||| ${MyGame.playerTwo.name}: ${MyGame.playerTwoScore}`;
      setTimeout(function() {
        MyGame.gameOn = true;
        MyGame.randomize();
        MyGame.gameState = ["", "", "", "", "", "", "", "", ""];
        displayStatus.innerHTML = MyGame.currentPlayerTurn();
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
      }, 1500);
      return;
    }


    //This conditional checks for when all game cells are filled up without a win. It outputs a draw message to the screen and restarts game flow.
    let roundDraw = !MyGame.gameState.includes("");
    if (roundDraw) {
      displayStatus.innerHTML = MyGame.drawMessage();
      MyGame.gameOn = false;
      scoreDisplay.innerHTML = `${MyGame.playerOne.name}: ${MyGame.playerOneScore} ||| ${MyGame.playerTwo.name}: ${MyGame.playerTwoScore}`;
      setTimeout(function() {
        MyGame.gameOn = true;
        MyGame.randomize();
        MyGame.gameState = ["", "", "", "", "", "", "", "", ""];
        displayStatus.innerHTML = MyGame.currentPlayerTurn();
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
      }, 1500);
      return;
    }
    //A call for the function that switches player markers after each game status has been checked.
    MyGame.playerSwitch();
  },

  //This function resets game parameters for whenever the RESTART button is clicked.
  handleRestartGame: function() {
    MyGame.gameOn = true;
    MyGame.currentPlayer = "X";
    MyGame.gameState = ["", "", "", "", "", "", "", "", ""];
    MyGame.playerOneScore = 0;
    MyGame.playerTwoScore = 0;
    scoreDisplay.innerHTML = `${MyGame.playerOne.name}: ${MyGame.playerOneScore} ||| ${MyGame.playerTwo.name}: ${MyGame.playerTwoScore}`;
    displayStatus.innerHTML = MyGame.currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
  }
};

//We then attach the functions to their appropriate buttons to ensure a smooth game flow.
document.querySelectorAll(".cell").forEach(cell => cell.addEventListener("click", MyGame.handleCellClick));
document.querySelector(".game-restart").addEventListener("click", MyGame.handleRestartGame);
document.querySelector("#vs-player").addEventListener("click", MyGame.open);
document.querySelector(".game-close").addEventListener("click", MyGame.close);