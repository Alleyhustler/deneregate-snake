const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

const boxSize = 20;  // Size of each square in the grid
const boardSize = 20;  // Number of squares on each side of the board
canvas.width = boxSize * boardSize;
canvas.height = boxSize * boardSize;

let score = 0;
let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let food = getRandomPosition();
let speed = 200;  // Initial speed
let gameInterval;

// Control snake direction with keyboard (Arrow keys + WASD)
document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp" || event.key === "w") {
    if (direction !== "DOWN") direction = "UP";
  } else if (event.key === "ArrowDown" || event.key === "s") {
    if (direction !== "UP") direction = "DOWN";
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    if (direction !== "RIGHT") direction = "LEFT";
  } else if (event.key === "ArrowRight" || event.key === "d") {
    if (direction !== "LEFT") direction = "RIGHT";
  }
});

// Start the game when the page loads
window.onload = () => {
  startGame();
};

// Start the game loop
function startGame() {
  gameInterval = setInterval(gameLoop, speed);
}

// Game loop
function gameLoop() {
  moveSnake();
  if (isGameOver()) {
    stopGame();  // Stop the game
  } else {
    drawBoard();
    drawSnake();
    drawFood();
    updateScore();
  }
}

// Move snake based on direction
function moveSnake() {
  const head = { ...snake[0] };

  if (direction === "UP") head.y -= 1;
  if (direction === "DOWN") head.y += 1;
  if (direction === "LEFT") head.x -= 1;
  if (direction === "RIGHT") head.x += 1;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = getRandomPosition();
    adjustSpeed();  // Adjust speed as snake eats food
  } else {
    snake.pop(); // Remove last segment if no food eaten
  }
}

// Check if the game is over
function isGameOver() {
  const head = snake[0];
  return (
    head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  );
}

// Stop the game (clear interval)
function stopGame() {
  clearInterval(gameInterval); // Stop the game loop
  // The game will now wait for a restart without showing a message
}

// Reset game state
function resetGame() {
  score = 0;
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  food = getRandomPosition();
  speed = 200; // Reset speed to initial value
  startGame();  // Restart game loop with initial speed
}

// Draw the game board
function drawBoard() {
  ctx.fillStyle = "#2b2b2b"; // Background color of the board
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Drawing grid lines
  ctx.strokeStyle = "#444"; // Grid line color
  ctx.lineWidth = 1;
  for (let i = 0; i < boardSize; i++) {
    ctx.beginPath();
    // Draw vertical grid lines
    ctx.moveTo(i * boxSize, 0);
    ctx.lineTo(i * boxSize, canvas.height);
    // Draw horizontal grid lines
    ctx.moveTo(0, i * boxSize);
    ctx.lineTo(canvas.width, i * boxSize);
    ctx.stroke();
  }
}

// Draw the snake
function drawSnake() {
  ctx.fillStyle = "#0f0";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
  });
}

// Draw the food
function drawFood() {
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);
}

// Generate a random position for food
function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize)
  };
}

// Update the score display
function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
}

// Adjust game speed based on the snake's length
function adjustSpeed() {
  // Slow increase in speed as the snake grows
  if (speed > 100) {  // Set minimum speed limit to 100ms
    speed -= 3;
    clearInterval(gameInterval);
    startGame();  // Restart game loop with new speed
  }
}
