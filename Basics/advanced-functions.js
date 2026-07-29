/*function greeting() {
  console.log("hello");
}
greeting();
const num = 2;
// function1 contains a function
const function1 = function () {
  // anonymous function
  console.log("hello");
};

function1(); // cannot be accessed before initialization (cannot be hoisted)
console.log(function1);
// a function is just another type of value
console.log(typeof function1);
// a method is a function that's saved in an object

const object1 = {
  num: 2,
  fun: function greeting() {
    console.log("hello");
  },
};
// using dot notation to call the function
object1.fun();
// passing a function into another function
function run(param) {
  param();
}
run(function () {
  console.log("hello");
});
*/
// activates a function after a set time in milliseconds
// 1000ms = 1 second
// only activates once
// setTimeout(function () {
//   console.log("timeout");
// }, 1000);
// console.log("next line");
// // activates a function after a set time
// // activates more than once
// setInterval(function () {
//   console.log("interval");
// }, 3000);

// forEach  method is used to loop through an array
// saves the values of the array in the param "value"
// return in "forEach" is the same as continue
// ["make dinner", "wash dishes", "watch youtube"].forEach(
//   function (value, index) {
//     if (value === "wash dishes") {
//       // skips "wash dishes"
//       return;
//     }
//     console.log(index);
//     console.log(value);
//   },
// );
// setTimeout(function start() {
//   const buttonElement = document.querySelector(".start-button");
//   if (buttonElement.innerHTML === "Start") {
//     buttonElement.innerHTML = "Finished";
//     buttonElement.classList.add("started");
//   } else {
//     buttonElement.innerHTML = "Start";
//     buttonElement.classList.remove("started");
//   }
// }, 1000);
// setInterval(function () {
//   console.log("time");
// }, 1000);

// arrow function
// works like a regular function
// const arrowWFunction = () => {
//   console.log("hello");
// };
// arrowWFunction();

// ["make dinner", "wash dishes", "watch youtube"].forEach((value, index) => {
//   if (value === "wash dishes") {
//     // skips "wash dishes"
//     return;
//   }
//   console.log(index);
//   console.log(value);
// });

// const buttonElement = document.querySelector(".js-button");

// .filter() returns the values in an array that meet a condition
// specified in a callback function
// it carries 2 parameters
console.log(
  [1, -3, 5].filter((value, index) => {
    // if (value >= 0) {
    //   return true
    // } else {
    //   return true;
    // }
    // returns the values that are greater than/equal to 1
    return value >= 0;
  }),
);

// Calls a defined callback function on each element of an array, and returns an array that contains the results.
console.log(
  [1, 1, 3].map((value, index) => {
    return value * 2;
  }),
);

// a shorter method
console.log([1, 1, 3].map((value) => value * 2));
console.log([4, 6, 2].map((index) => index * 2));


const multiply = (value1, value2) => {console.log(value1 * value2)}
multiply(2, 3)

// todoList.forEach(function (todoObject, index) {

