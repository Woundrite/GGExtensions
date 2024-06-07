import { layout } from './layout.js';

document.addEventListener("DOMContentLoaded", () => {
  const scoreDisplay = document.getElementById("score")
  const width = 28
  let score = 0
  const grid = document.querySelector(".grid")
  
  const squares = []

  // Function to show the popup with a message
  function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    popupMessage.textContent = message;
    popup.style.display = "block";
  }
  
  // Function to hide the popup
  function hidePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
  }
  
  // Event listener for Play Again button
  document.getElementById("play-again-btn").addEventListener("click", resetGame);
  
  function resetGame() {
    // Clear the grid
    grid.innerHTML = '';
    squares.length = 0;
  
    // Reset score
    score = 0;
    scoreDisplay.innerHTML = score;
  
    // Recreate the board
    createBoard();
  
    // Reset Pac-Man position
    pacmanCurrentIndex = 490;
    squares[pacmanCurrentIndex].classList.add("pac-man");
  
    // Reset ghost positions and behaviors
    ghosts.forEach(ghost => {
      clearInterval(ghost.timerId);
      ghost.currentIndex = ghost.startIndex;
      squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      moveGhost(ghost);
    });
  
    // Hide the popup
    hidePopup();
  
    // Add event listener back
    document.addEventListener("keyup", movePacman);
  }


  //create your board
  function createBoard() {
    for (let i = 0; i < layout.length; i++) {
      const square = document.createElement("div")
      square.id = i
      grid.appendChild(square)
      squares.push(square)

      //add layout to the board
      if (layout[i] === 0) {
        squares[i].classList.add("pac-dot")
      }
      if (layout[i] === 1) {
        squares[i].classList.add("wall")
      }
      if (layout[i] === 2) {
        squares[i].classList.add("ghost-lair")
      }
      if (layout[i] === 3) {
        squares[i].classList.add("power-pellet")
      }
    }
  }
  createBoard()

  //create Characters
  // draw pac-man onto the board
  let pacmanCurrentIndex = 490
  squares[pacmanCurrentIndex].classList.add("pac-man")

  //move pacman
  function movePacman(e) {
    squares[pacmanCurrentIndex].classList.remove("pac-man")
    // switch (e.keyCode) { deprecated
    switch (e.key) {
      // case 37:
      case "ArrowLeft":
        if (
          pacmanCurrentIndex % width !== 0 &&
          !squares[pacmanCurrentIndex - 1].classList.contains("wall") &&
          !squares[pacmanCurrentIndex - 1].classList.contains("ghost-lair")
        ) {
          pacmanCurrentIndex -= 1
        }
        if ((pacmanCurrentIndex - 1) === 363) {
          pacmanCurrentIndex = 391
        }
        break
      case "ArrowUp":
        // case 38:
        if (
          pacmanCurrentIndex - width >= 0 &&
          !squares[pacmanCurrentIndex - width].classList.contains("wall") &&
          !squares[pacmanCurrentIndex - width].classList.contains("ghost-lair")

        ) {
          pacmanCurrentIndex -= width
        }
        break
      case "ArrowRight":
        // case 39:
        if (
          pacmanCurrentIndex % width < width - 1 &&
          !squares[pacmanCurrentIndex + 1].classList.contains("wall") &&
          !squares[pacmanCurrentIndex + 1].classList.contains("ghost-lair")
        ) {
          pacmanCurrentIndex += 1
        }
        if (
          (pacmanCurrentIndex + 1) === 392
        ) {
          pacmanCurrentIndex = 364
        }
        break
      case "ArrowDown":
        // case 40:
        if (
          pacmanCurrentIndex + width < width * width &&
          !squares[pacmanCurrentIndex + width].classList.contains("wall") &&
          !squares[pacmanCurrentIndex + width].classList.contains("ghost-lair")
        ) {
          pacmanCurrentIndex += width
        }
        break
    }
    squares[pacmanCurrentIndex].classList.add("pac-man")
    pacDotEaten()
    powerPelletEaten()
    checkForGameOver()
    checkForWin()
  }

  document.addEventListener("keyup", movePacman)

  //what happens when you eat a pac-dot
  function pacDotEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
      score++
      scoreDisplay.innerHTML = score
      squares[pacmanCurrentIndex].classList.remove("pac-dot")
    }
  }

  //what happens when you eat a power-pellet
  function powerPelletEaten() {
    if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
      score += 10
      scoreDisplay.innerHTML = score
      ghosts.forEach(ghost => ghost.isScared = true)
      setTimeout(unScareGhosts, 10000)
      squares[pacmanCurrentIndex].classList.remove("power-pellet")
    }
  }

  //make the ghosts stop flashing
  function unScareGhosts() {
    ghosts.forEach(ghost => ghost.isScared = false)
  }

  //create ghosts using Constructor
  class Ghost {
    constructor(className, startIndex, speed) {
      this.className = className
      this.startIndex = startIndex
      this.speed = speed
      this.currentIndex = startIndex
      this.isScared = false
      this.timerId = NaN

    }
  }

  //all my ghosts
  const ghosts = [
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("inky", 351, 300),
    new Ghost("clyde", 379, 500),
  ]

  //draw my ghosts onto the grid
  ghosts.forEach(ghost =>
    squares[ghost.currentIndex].classList.add(ghost.className, "ghost"))

  //move ghosts randomly
  ghosts.forEach(ghost => moveGhost(ghost))

  function moveGhost(ghost) {
    const directions = [-1, 1, width, -width]
    let direction = directions[Math.floor(Math.random() * directions.length)]

    ghost.timerId = setInterval(function () {
      //if next square your ghost is going to go to does not have a ghost and does not have a wall
      if (
        !squares[ghost.currentIndex + direction].classList.contains("ghost") &&
        !squares[ghost.currentIndex + direction].classList.contains("wall")
      ) {
        squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost")
        ghost.currentIndex += direction
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost")
        // else find a new random direction to go in
      } else direction = directions[Math.floor(Math.random() * directions.length)]
      // if the ghost is currently scared
      if (ghost.isScared) {
        squares[ghost.currentIndex].classList.add("scared-ghost")
      }

      //if the ghost is currently scared and pacman is on it
      if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man")) {
        ghost.isScared = false
        squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost")
        ghost.currentIndex = ghost.startIndex
        score += 100
        scoreDisplay.innerHTML = score
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost")
      }
      checkForGameOver()
    }, ghost.speed)
  }

  // Modify your checkForGameOver and checkForWin functions to show the popup
  function checkForGameOver() {
    if (
      squares[pacmanCurrentIndex].classList.contains("ghost") &&
      !squares[pacmanCurrentIndex].classList.contains("scared-ghost")
    ) {
      ghosts.forEach(ghost => clearInterval(ghost.timerId));
      document.removeEventListener("keyup", movePacman);
      showPopup("Game Over. Try again!");
    }
  }
  
  function checkForWin() {
    if (score >= 274) {
      ghosts.forEach(ghost => clearInterval(ghost.timerId));
      document.removeEventListener("keyup", movePacman);
      showPopup("Congratulations! You have won!");
    }
  }
})