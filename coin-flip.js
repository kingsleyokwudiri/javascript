let randomNumber;
let guess = 'heads';
let result;
function chance() {
  let randomNumber = Math.random();
  let result = randomNumber;
  if (randomNumber < 0.5) {
    result = 'heads';
    console.log('less than');
  } else if (randomNumber > 0.5) {
    result = 'tails';
    console.log('bigger than');

  } else {
    alert('tie');
  }
}
function playGame() {
  chance();
  result = "";
  if (guess === result) {
    console.log('You win');
  } else if (!(guess === result)) {
    console.log('You lose');
  }
} 
playGame();
console.log(randomNumber);










