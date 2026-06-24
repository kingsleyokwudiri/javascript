const randomNumber = Math.random();
let result = randomNumber;
let guess = 'heads';
if (randomNumber < 0.5) {
  result = 'heads';
  console.log('heads');
} else {
  result = 'tails';
  console.log('tails');

}
console.log(result);

if (guess === result) {
  console.log('You win');
} else {
  console.log('You lose');

}





  









