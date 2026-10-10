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
  for (let row = 0; row < rows; row++) {
    board[row] = [];
    for (let column = 0; column < columns; column++) {
      board[row].push(Cell());
    }
  }

  // This will be the method of getting the entire board that the UI will eventually need to render it.
  const getBoard = () => board;

  // In order to drop a token, i need to find if the selected cell already has no value, *then* change that cell's value to the player token or leave it
  const fillCell = (row, column, player) => {
    if (
      !Number.isInteger(row) ||
      !Number.isInteger(column) ||
      row < 0 ||
      row >= rows ||
      column < 0 ||
      column >= columns
    )
      return false;
    return board[row][column].addMark(player);
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
    if (value !== "") return false;
    value = player;
    return true;
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
  let activePlayer = players[0];
  let message = `${activePlayer.name}'s turn.`;
  let gameStatus = "playing";

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

  const getMessage = () => message;

  const getActivePlayer = () => activePlayer;

  const getBoardState = () => board.getBoard();

  const getGameStatus = () => gameStatus;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playRound = (row, column) => {
    if (gameStatus !== "playing") {
      message = "The game has ended. Reset to play again.";
      return false;
    }
    const moveAccepted = board.fillCell(row, column, getActivePlayer().token);

    if (!moveAccepted) {
      message = "That cell is unavailable. Choose an empty cell.";
      return false;
    }

    if (checkForWin()) {
      gameStatus = "won";
      message = `Hurray, ${getActivePlayer().name} wins!🥳`;
      return true;
    }

    if (checkForTie()) {
      gameStatus = "draw";
      message = "It's a draw! 🤝";
      return true;
    }
    // Switch player turn
    switchPlayerTurn();
    message = `${getActivePlayer().name}'s turn`;

    return true;
  };

  /*  This is where we would check for a winner and handle that logic, such as a win message. */

  const checkForWin = () => {
    const getCellValue = ([row, col]) => getBoardState()[row][col].getValue();
    return winningRules.some((condition) => {
      const a = getCellValue(condition.cell1);
      const b = getCellValue(condition.cell2);
      const c = getCellValue(condition.cell3);

      return a != "" && a == b && b == c;
    });
  };

  const checkForTie = () => {
    return getBoardState().every((row) =>
      row.every((cell) => cell.getValue() !== ""),
    );
  };

  const resetGame = () => {
    board = GameBoard();
    gameStatus = "playing";
    activePlayer = players[0];
    message = `${getActivePlayer().name}'s turn.`;
  };

  const changePlayerNames = (newNameOne, newNameTwo) => {
    players[0].name = newNameOne;
    players[1].name = newNameTwo;
    resetGame();
  };

  return {
    getBoardState,
    getActivePlayer,
    getMessage,
    getGameStatus,
    playRound,
    resetGame,
    changePlayerNames,
  };
}

function ScreenController() {
  const ticTacToeBoard = document.querySelector(".ticTacToeBoard");
  const notificationBar = document.querySelector(".notification");
  const resetBtn = document.querySelector("button[type='reset']");
  const customNames = document.querySelector(".customNames");
  const dialog = document.querySelector("dialog");
  const nameForm = dialog.querySelector("form");
  const nameOne = dialog.querySelector("#playerOneName");
  const nameTwo = dialog.querySelector("#playerTwoName");

  const game = GameController();

  const updateScreen = () => {
    ticTacToeBoard.replaceChildren();

    const board = game.getBoardState();
    const gameStatus = game.getGameStatus();

    notificationBar.textContent = game.getMessage();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");

        cellButton.type = "button";
        cellButton.classList.add("cell");
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = cellIndex;
        cellButton.textContent = cell.getValue();
        cellButton.setAttribute(
          "aria-label",
          `Row ${rowIndex + 1}, column ${columnIndex + 1}: ${
            cell.getValue() || "empty"
          }`,
        );
        ticTacToeBoard.appendChild(cellButton);
      });
    });
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    // Make sure I've clicked a column and not the gaps in between
    const cellButton = e.target.closest(".cell");
    if (!cellButton || !ticTacToeBoard.contains(cellButton)) return;

    const selectedColumn = Number(cellButton.dataset.column);
    const selectedRow = Number(cellButton.dataset.row);

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }

  function giveCustomNames(e) {
    e.preventDefault();
    const firstName = nameOne.value.replace(/^\s+|\s+$/g, "");
    const secondName = nameTwo.value.replace(/^\s+|\s+$/g, "");

    if (!(firstName.length < 2 && secondName.length < 2)) {
      alert("Each player's name must contain at least 2 characters.");
      return;
    }

    if (
      firstName.toLowerCase() == secondName.toLowerCase()
    ) {
      alert("Players must have different names.");
      return;
    }
    game.changePlayerNames(firstName,secondName);

    nameForm.reset();
    updateScreen();
    dialog.close();
  }

  ticTacToeBoard.addEventListener("click", clickHandlerBoard);

  resetBtn.addEventListener("click", () => {
    game.resetGame();
    updateScreen();
  });

  customNames.addEventListener("click", () => {
    if (!dialog.open){
      dialog.showModal();
    }
  });

  nameForm.addEventListener("submit", (e) => {
    giveCustomNames(e);
  });
  // Initial render
  updateScreen();
}

ScreenController();
