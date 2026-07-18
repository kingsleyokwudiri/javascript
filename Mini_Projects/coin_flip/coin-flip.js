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
      alert(
        `You win! \nYou picked ${choice}, Coin showed ${result}.\nWins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    } else if (choice === "heads" && result === "tails") {
      score.losses += 1;
      alert(
        `You lose! \nYou picked ${choice}, Coin showed ${result}.\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    } else if (choice === "tails" && result === "tails") {
      score.wins += 1;
      alert(
        `You win! \nYou picked ${choice}, Coin showed ${result}.\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
      );
    } else if (choice === "tails" && result === "heads") {
      score.losses += 1;

      // localStorage only supports strings, use JSON.stringify() to convert
      localStorage.setItem("score", JSON.stringify(score));
      alert(
        `You lose! \nYou picked ${choice}, Coin showed ${result}.\n Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`,
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
  coinSide();
  if (choice === undefined) {
    alert("Please pick a choice!");
  } else alert(`Your Choice: ${choice}`);
}
