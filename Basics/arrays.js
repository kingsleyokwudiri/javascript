const nums = [10, 20, 30];
nums[2] = 99;
console.log(nums);
function getLastValue(array) {
  lastindex = array[array.length - 1];
  console.log(lastindex);
}
getLastValue([4, 6, 9, 3]);
function arraySwap(array) {
  lastindex = array[array.length - 1];
  let firstItem = array[0];
  array[0] = array[array.length - 1];
  array[array.length - 1] = firstItem;
  console.log(array);
}
arraySwap([7, 9, 33]);
for (let i = 0; i <= 10; i = i + 2) {
  console.log(i);
}
for (let i = 5; i >= 0; i = i - 1) {
  console.log(i);
}

let i = 0;
while (i <= 10) {
  console.log(i);
  i = i + 2;
}
const array = [1, 2, 3];
const newArray = [];
for (let i = 0; i < array.length; i++) {
  newArray.push(array[i] + 1);
}
console.log(newArray);
