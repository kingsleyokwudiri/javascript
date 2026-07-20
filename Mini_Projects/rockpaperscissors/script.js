// Initialize score with default values if it doesn't exist in localStorage
let score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
};
let autoplayOn = false;
let intervalID;

// const autoPlay = () => {

// };

function autoPlay() {
  if (!autoplayOn) {
    // arrow function
    intervalID = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    autoplayOn = true;
  } else {
    clearInterval(intervalID);
    autoplayOn = false;
  }
}

function updateScoreElement() {
  const scoreElement = document.querySelector(".js-score");
  if (scoreElement) {
    scoreElement.innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
  }
}

function updateResultDisplay(result) {
  const resultElement = document.querySelector(".js-result");
  if (resultElement) {
    resultElement.innerHTML = result;
  }
}

// Initial score render on load
// updateScoreElement();

function pickComputerMove() {
  const randomNumber = Math.random();
  let computerMove = "";
  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    computerMove = "rock";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    computerMove = "paper";
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    computerMove = "scissors";
  }
  return computerMove;
}

function reset() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.setItem("score", JSON.stringify(score));
  updateScoreElement();
  updateResultDisplay("");
  const movesElement = document.querySelector(".js-moves");
  if (movesElement) {
    movesElement.innerHTML = "Scores have been reset!";
  }
}

// Keyboard shortcut handler
document.addEventListener("keydown", function (event) {
  if (event.key === "1") {
    playGame("rock");
  } else if (event.key === "2") {
    playGame("paper");
  } else if (event.key === "3") {
    playGame("scissors");
  }
});

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = "";

  if (playerMove === "rock") {
    if (computerMove === "rock") {
      result = "Tie.";
    } else if (computerMove === "paper") {
      result = "You lose!";
    } else if (computerMove === "scissors") {
      result = "You win!";
    }
  } else if (playerMove === "paper") {
    if (computerMove === "rock") {
      result = "You win!";
    } else if (computerMove === "paper") {
      result = "Tie.";
    } else if (computerMove === "scissors") {
      result = "You lose!";
    }
  } else if (playerMove === "scissors") {
    if (computerMove === "rock") {
      result = "You lose!";
    } else if (computerMove === "paper") {
      result = "You win!";
    } else if (computerMove === "scissors") {
      result = "Tie.";
    }
  }

  if (result === "You win!") {
    score.wins += 1;
  } else if (result === "You lose!") {
    score.losses += 1;
  } else if (result === "Tie.") {
    score.ties += 1;
  }

  localStorage.setItem("score", JSON.stringify(score));

  updateResultDisplay(result);
  updateScoreElement();

  // Injects the respective emoji elements straight into the interface
  const movesElement = document.querySelector(".js-moves");
  if (movesElement) {
    movesElement.innerHTML = `
      You 
      <img src="images/${playerMove}-emoji.png" class="move-icon" alt="${playerMove}">
      vs 
      <img src="images/${computerMove}-emoji.png" class="move-icon" alt="${computerMove}"> 
      Computer
    `;
  }
}
