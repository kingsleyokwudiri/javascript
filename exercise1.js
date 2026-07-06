let hour = 10;
let name = 'Kingsley';
if (hour >= 6 && hour <= 12) {
  console.log(`Good morning ${name}!`);
} else if (hour >= 13 && hour <= 17) {
  console.log(`Good afternoon ${name}!`);
} else {
  console.log(`Good night ${name}!`)
}

let age = 4;
const isHoliday = false;
if ((age <= 6 || age >=65) && !isHoliday) {
  console.log('Discount');
}
 