/*
 ** The Gameboard represents the state of the board
 ** Each square holds a Cell (defined later) and i expose a fillCell method to be able to add Cells to squares
 */

function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  /* Create a 2d array that will represent the state of the game board.
  For this 2d array, row 0 will represent the top row and column 0 will represent the left-most column.
  This nested-loop technique is a simple and common way to create a 2d array.
*/
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  // This will be the method of getting the entire board that the UI will eventually need to render it.
  const getBoard = () => board;

  // In order to drop a token, i need to find if the selected cell already has no value, *then* change that cell's value to the player token or leave it
  const fillCell = (row, column, player) => {
    if (board[row][column].getValue() != "") {
      console.log("space taken dummy");
      return "cell filling failed";
    }
    board[row][column].addMark(player);
    return "cell filling success";
  };

  // Here, interface for the rest of our application to interact with the board is presented
  return { getBoard, fillCell };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** '': no token is in the square,
 ** 'x': Player One's token,
 ** 'o': Player Two's token
 */
function Cell() {
  let value = "";

  // Accept a player's token to change the value of the cell
  const addMark = (player) => {
    value = player;
  };

  // Retrieve the current value of this cell through closure
  const getValue = () => value;

  const clearCell = function () {
    value = "";
  };

  return { addMark, getValue, clearCell };
}

/*
 The GameController will be responsible for controlling the flow and state of the game's turns, as well as whether anybody has won the game
 */
function GameController() {
  let board = GameBoard();
  let gameEnded = false;
  let message;
  const players = [
    {
      name: "Player One",
      token: "x",
    },
    {
      name: "Player Two",
      token: "o",
    },
  ];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getMessage = () => message;

  const getActivePlayer = () => activePlayer;

  const getBoardState = () => board.getBoard();

  const printNewRound = () => {
    message = `${getActivePlayer().name}'s turn.`;
  };

  const playRound = (row, column) => {
    if (gameEnded) {
      message = "The last game has ended, reset the game";
      return;
    }
    const stat = board.fillCell(row, column, getActivePlayer().token);
    if (stat == "cell filling failed") return;
    message = `Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}...`;

    if (checkForWin() == "game ended") {
      message = `Hurray, ${getActivePlayer().name} won!!!!🥳`;
      return;
    } else if (checkForTie() == "game draw") {
      message = "Oh my, the game ends with a tie😓";
      return;
    }
    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };
  const winningRules = [
    { cell1: [0, 0], cell2: [0, 1], cell3: [0, 2] },
    { cell1: [1, 0], cell2: [1, 1], cell3: [1, 2] },
    { cell1: [2, 0], cell2: [2, 1], cell3: [2, 2] },
    { cell1: [0, 0], cell2: [1, 0], cell3: [2, 0] },
    { cell1: [0, 1], cell2: [1, 1], cell3: [2, 1] },
    { cell1: [0, 2], cell2: [1, 2], cell3: [2, 2] },
    { cell1: [0, 0], cell2: [1, 1], cell3: [2, 2] },
    { cell1: [0, 2], cell2: [1, 1], cell3: [2, 0] },
  ];

  /*  This is where we would check for a winner and handle that logic, such as a win message. */

  const checkForWin = function () {
    const getCellValue = ([row, col]) => getBoardState()[row][col];
    const gameResult = winningRules.some((condition) => {
      const a = getCellValue(condition.cell1);
      const b = getCellValue(condition.cell2);
      const c = getCellValue(condition.cell3);

      return a != "" && a == b && b == c;
    });

    if (gameResult) {
      gameEnded = true;
      return "game ended";
    }
  };

  const checkForTie = function () {
    const gameResult = getBoardState().every((row) =>
      row.every((cell) => cell.getValue() != ""),
    );
    if (gameResult) {
      gameEnded = true;
      return "game draw";
    }
  };

  const resetGame = function () {
    board = GameBoard();
    gameEnded = false;
    activePlayer = players[0];
    printNewRound();
  };

  // Initial play game message
  printNewRound();

  return {
    resetGame,
    getMessage,
    getBoardState,
    playRound,
    getActivePlayer,
  };
}

function ScreenController() {
  const ticTacToeBoard = document.querySelector(".ticTacToeBoard");
  const notificationBar = document.querySelector(".notification");
  const resetBtn = document.querySelector("button[type='reset']");

  const game = GameController();

  const updateScreen = () => {
    ticTacToeBoard.innerHTML = "";

    const board = game.getBoardState();

    notificationBar.textContent = game.getMessage();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = cellIndex;
        cellButton.textContent = cell.getValue();
        ticTacToeBoard.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    // Make sure I've clicked a column and not the gaps in between
    if (!e.target.closest(".cell")) return;

    const selectedColumn = Number(e.target.dataset.column);
    const selectedRow = Number(e.target.dataset.row);

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  ticTacToeBoard.addEventListener("click", clickHandlerBoard);
  resetBtn.addEventListener("click", () => {
    game.resetGame();
    updateScreen();
  });
  // Initial render
  updateScreen();
}

ScreenController();
