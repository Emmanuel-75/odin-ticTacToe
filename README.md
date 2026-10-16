# Odin Tic-Tac-Toe

A browser-based Tic-Tac-Toe game built with HTML, CSS, and JavaScript as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum.

The project focuses on modular JavaScript, factory functions, closures, DOM manipulation, event handling, and separating game logic from UI logic through clear responsibilities and callback-based dependency injection.

## Features

- **Two-player gameplay:** Play locally with two players taking turns on the same device.
- **Custom player names:** Give each player a custom name through a dialog.
- **Win detection:** Automatically detects when a player completes a horizontal, vertical, or diagonal line.
- **Draw detection:** Detects when all nine cells are occupied without a winner.
- **Turn notifications:** Displays whose turn it is and announces the outcome of the game.
- **Move validation:** Prevents players from overwriting occupied cells.
- **Game reset:** Start a new game while retaining custom player names.
- **Win celebration:** Launches a confetti animation when a player wins.
- **Responsive layout:** Uses CSS Grid and flexible layouts to accommodate different screen sizes.

## Technologies Used

- **HTML5** — Semantic structure, buttons, forms, and the native dialog element.
- **CSS3** — Styling, Flexbox, CSS Grid, and custom typography.
- **JavaScript (ES6+)** — Factory functions, closures, callbacks, dependency injection, arrays, event handling, and DOM manipulation.
- **canvas-confetti** — Generates the win-celebration animation.
- **Google Fonts** — Bungee typeface.

## Getting Started

### Prerequisites

A modern web browser and Git are sufficient to run the project locally.

The project also requires the `canvas-confetti` library to be loaded correctly, whether through a CDN or a local installation.

### Installation

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd odin-ticTacToe
   ```

3. Open `index.html` in your browser.

Alternatively, open the project folder in your code editor and use a local development server.

Ensure that the confetti library is loaded before the game script executes.

## How to Play

1. Open the game in your browser.
2. Player One starts with **X**, followed by Player Two with **O**.
3. Select an empty cell to place your mark.
4. Take turns until a player gets three matching marks in a row, column, or diagonal.
5. If all nine cells are filled without a winner, the game ends in a draw.
6. When a player wins, a confetti animation celebrates the victory.
7. Use the **Reset** button to start a new game.
8. Use the custom-name option to personalize the players.

## Project Structure

```text
odin-ticTacToe/
├── index.html
├── styles.css
├── script.js
└── README.md
```

- `index.html` — Defines the game interface, board container, controls, and player-name dialog.
- `styles.css` — Handles the layout, game board, buttons, dialog, typography, and visual styling.
- `script.js` — Implements the board state, player turns, win and draw detection, win-celebration callback, and DOM updates.
- `README.md` — Documents the project and explains how to run it.

## JavaScript Architecture

The application separates responsibilities into four main factory functions.

### `Cell()`

Represents an individual cell on the board. It encapsulates the cell's value and exposes methods for adding a mark, retrieving the value, and clearing the cell.

### `GameBoard()`

Creates and manages the 3 × 3 board using a two-dimensional array of `Cell` objects. It exposes methods for retrieving the board and attempting to fill a cell, including validation of row and column indices.

### `GameController()`

Manages the game's state and rules, including:

- Tracking the active player.
- Switching turns after valid moves.
- Checking the eight possible winning combinations.
- Detecting draws.
- Preventing moves after the game ends.
- Resetting the game and updating player names.
- Invoking a supplied callback when a player wins.

The controller receives a celebration function as a dependency instead of directly calling a specific animation function.

For example:

```javascript
function GameController(celebrate) {
  // Game state and rules...

  if (checkForWin()) {
    gameStatus = "won";
    celebrate();
  }
}
```

The controller is initialized by supplying the desired celebration function:

```javascript
const game = GameController(makeItRain);
```

Here, `makeItRain` is passed as a function reference rather than executed immediately. When a player wins, calling `celebrate()` invokes the supplied function.

This is an example of **dependency injection**: a function receives a dependency from outside rather than creating or selecting that dependency internally.

As a result, the game controller does not need to know how the celebration works. The supplied behavior could be changed without rewriting the game's winning logic.

### `ScreenController()`

Connects the game logic to the browser interface. It renders the board, updates notifications, handles cell clicks through event delegation, manages the reset button, and processes the custom-name form.

It also initializes `GameController()` with the desired win-celebration function.

### `makeItRain()`

Handles the visual celebration independently of the game rules.

It uses the `canvas-confetti` library to launch particles from both sides of the screen and repeatedly schedules animation frames for a short duration.

Keeping this effect in a separate function prevents the controller from needing to manage particle counts, colors, shapes, angles, or animation timing.

## What I Learned

Through this project, I practised:

- Using factory functions to organize code into separate responsibilities.
- Applying closures to encapsulate internal state.
- Working with two-dimensional arrays and array methods such as `some()` and `every()`.
- Separating game logic from DOM manipulation.
- Using callbacks and dependency injection to reduce direct dependencies between components.
- Validating user input and handling invalid moves.
- Managing game states, player turns, winning conditions, and draws.
- Using `requestAnimationFrame()` to schedule a browser animation loop.
- Integrating a third-party JavaScript library into a browser project.

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/) — Project brief and learning curriculum.
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — Confetti animation library.
- [Google Fonts](https://fonts.google.com/) — Bungee typeface.

---

Built by **DevManolis** as part of my journey learning front-end development.
