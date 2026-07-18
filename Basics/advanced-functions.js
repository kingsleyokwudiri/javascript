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
const arrowWFunction = () => {
  console.log("hello");
};
arrowWFunction();

["make dinner", "wash dishes", "watch youtube"].forEach((value, index) => {
  if (value === "wash dishes") {
    // skips "wash dishes"
    return;
  }
  console.log(index);
  console.log(value);
});
