// Initialize score with default variables if it doesn't exist.
// JSON.parse converts the string back to an object
let score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  ties: 0,
};
let guess;
let choice;
let result;
let randomNumber = Math.random();
function chance() {
  let randomNumber = Math.random();
  if (randomNumber < 0.5) {
    result = "heads";
  } else if (randomNumber > 0.5) {
    result = "tails";
  } else {
    alert("tie");
    score.ties += 1;
    localStorage.setItem("score", JSON.stringify(score)); // FIX 1: Save ties to localStorage
  }
}

function coinSide(side) {
  if (side === "heads") {
    choice = "heads";
  } else if (side === "tails") {
    choice = "tails";
  }
}
function flipCoin() {
  chance();
  if (choice != "heads" && choice != "tails") {
    alert("Please pick a choice!");
  } else {
    if (choice === "heads" && result === "heads") {
      score.wins += 1;
      localStorage.setItem("score", JSON.stringify(score)); // FIX 1: Save wins
      alert(
        `You win! \nYou picked ${choice}, Coin showed ${result}.\nWins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    } else if (choice === "heads" && result === "tails") {
      score.losses += 1;
      localStorage.setItem("score", JSON.stringify(score)); // FIX 1: Save losses
      alert(
        `You lose! \nYou picked ${choice}, Coin showed ${result}.\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    } else if (choice === "tails" && result === "tails") {
      score.wins += 1;
      localStorage.setItem("score", JSON.stringify(score)); // FIX 1: Save wins
      alert(
        `You win! \nYou picked ${choice}, Coin showed ${result}.\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    } else if (choice === "tails" && result === "heads") {
      score.losses += 1;
      localStorage.setItem("score", JSON.stringify(score)); // FIX 1: Save losses
      alert(
        `You lose! \nYou picked ${choice}, Coin showed ${result}.\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    }

    // FIX 4: Add tie handling in flipCoin
    if (choice === result) {
      score.ties += 1;
      localStorage.setItem("score", JSON.stringify(score));
      alert(
        `It's a tie! \nYou picked ${choice}, Coin showed ${result}.\nWins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    }
  }
}
function resetScores() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  alert(
    `Scores have been reset!\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
  );
  localStorage.setItem("score", JSON.stringify(score));
}
function showScores() {
  alert(`Wins: ${score.wins}\nLosses: ${score.losses} \nTies: ${score.ties}`);
}
function showSide() {
  // FIX 2 & 3: Removed coinSide() call - it's already set by button clicks
  if (choice === undefined) {
    alert("Please pick a choice!");
  } else alert(`Your Choice: ${choice}`);
}

document.querySelector(".heads-face-button").addEventListener("click", () => {
  coinSide("heads");
});

document.querySelector(".tails-face-button").addEventListener("click", () => {
  coinSide("tails");
});

document.querySelector(".coin-side-button").addEventListener("click", () => {
  showSide();
});

// FIX 5: Add event listeners for the remaining buttons
document.querySelector(".flip-button").addEventListener("click", () => {
  flipCoin();
});

document.querySelector(".reset-button").addEventListener("click", () => {
  resetScores();
});

document.querySelector(".score-button").addEventListener("click", () => {
  showScores();
});
