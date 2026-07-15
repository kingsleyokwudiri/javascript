// const myArray = [1, 2, 3, 4, , true, { name: "John" }];
// console.log(Array.isArray(myArray)); // true
// //.PUSH() method adds a new item to the end of the array
// myArray.push("new item");
// myArray.splice(0, 1); // removes the first item from the array
// console.log(myArray);
// let i = 1;
// while (i <= 9) {
//   console.log(i);
//   i++;

// for (let i = 1; i <= 5; i++) {
//   console.log(i);
// }
// let randomNumber = 0;
// while (randomNumber < 0.5) {
//   randomNumber = Math.random();
// }
// console.log(randomNumber);

// looping through an
// i is short for index
// const todoList = ["make dinner", "wash dishes", "watch youtube"];
// for (let index = 0; index < todoList.length; i++) {
//   const value = todoList[i];
//   console.log(value);
// }
// accumulator pattern
// const numbers = [1, 1, 3];
// let total = 0;
// for (let i = 0; i < numbers.length; i++) {
//   const number = numbers[i];
//   total += number;
// }
// console.log(total);
const array1 = [1, 1, 3];
// this array is saved in the computer's memory
const array2 = array1.slice(); // creates a copy of the array
array2.push(4);
console.log(array2);
// const array3 = [
//   1, 2, 3
// ]
// destructuring assignment
const [firstValue, secondValue] = [1, 2, 3];

for (let i = 1; i < 11; i++) {
  // skips the number 3
  if (i === 3) {
    continue;
  }
  console.log(i);
  // exits the loop once i === 8
  if (i === 8) {
    break;
  }
}

for (let i = 1; i <= 18; i++) {
  // skips the numbers that are divisible by 3
  if (i % 3 === 0) {
    continue;
  }
  console.log(i);
}
let i = 1;
while (i <= 10) {
  console.log(i);
  i++;
}
// a function that doubles ALL ARRAYS IN THE FUNCTION
function doubleArray(nums) {
  const numsDoubled = [];
  for (let i = 0; i < nums.length; i++) {
    // assigns the values in the array "nums" to the variable "num"
    const num = nums[i];
    // stops the loop early if the array contains the number 0
    if (num === 0) {
      break;
    }
    // multiplies the values of num by 2, and then pushes to numsDoubled
    numsDoubled.push(num * 2);
  }
  // returns the values in numsDoubled
  return numsDoubled;
}
console.log(doubleArray([0, 2, 4, 6]));
