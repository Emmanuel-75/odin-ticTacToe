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

  /* This method will be used to print the board to the console.
  It is helpful to see what the board looks like after each turn as we play, but it won't be needed it after the UI is built
  */
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue()),
    );
    console.log(boardWithCellValues);
  };

  // Here, interface for the rest of our application to interact with the board is presented
  return { getBoard, fillCell, printBoard };
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

  return { addMark, getValue };
}

/*
 The GameController will be responsible for controlling the flow and state of the game's turns, as well as whether anybody has won the game
 */
function GameController() {
  const board = GameBoard();
  const gamingBoard = board.getBoard();
  let gameEnded = false;
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

  const getActivePlayer = () => activePlayer;

  const getBoardState = () => board.printBoard();

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
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

  const checkForWin = function () {
    const gameResult = winningRules.some(
      (condition) =>
        (gamingBoard[condition.cell1[0]][condition.cell1[1]].getValue() ==
          "x" &&
          gamingBoard[condition.cell2[0]][condition.cell2[1]].getValue() ==
            "x" &&
          gamingBoard[condition.cell3[0]][condition.cell3[1]].getValue() ==
            "x") ||
        (gamingBoard[condition.cell1[0]][condition.cell1[1]].getValue() ==
          "o" &&
          gamingBoard[condition.cell2[0]][condition.cell2[1]].getValue() ==
            "o" &&
          gamingBoard[condition.cell3[0]][condition.cell3[1]].getValue() ==
            "o"),
    );

    if (gameResult) {
      gameEnded = true;
      return "game ended";
    }
  };

  const checkForTie = function () {
    const gameResult = gamingBoard.every(row => row.every(cell => cell.getValue() != ''))
    if (gameResult){
      gameEnded = true;
      return 'game draw'
    }
  };

  const playRound = (row, column) => {
    if (gameEnded) {
      console.log("The last game has ended, reset the game");
      return;
    }
    const stat = board.fillCell(row, column, getActivePlayer().token);
    if (stat == "cell filling failed") return;
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row ${row} column ${column}...`,
    );

    if (checkForWin() == "game ended") {
      console.log(`Hurray, ${getActivePlayer().name} won!!!!🥳`);
      return;
    }else if (checkForTie() == 'game draw'){
      console.log('Oh my, the game ends with a tie😓');
      return;
    }
    // Switch player turn
    switchPlayerTurn();
    printNewRound();
  };

  /*  This is where we would check for a winner and handle that logic, such as a win message. */

  // Initial play game message
  printNewRound();


  return {
    getBoardState,
    playRound,
    getActivePlayer,
  };
}

const game = GameController();
