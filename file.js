/* function function1() {
  console.log('hello');
  console.log(2 + 2);
  
}
function1(); */
function calculateTax(cost, taxPercent = 0.1) {
  console.log(taxPercent);
  console.log(cost * taxPercent);
}
calculateTax(2000);
calculateTax(5000);

greet();
function greet(name) {
  if (name === undefined) {
    console.log('Hi there')
  } else if (name != undefined) {
    console.log(`Hello, ${name}`);

  }
}

function convertToFahrenheit(celsius) {
  console.log(celsius * 9 / 5 + 32 );
}
convertToFahrenheit(25);

function convertToCelsius(fahrenheit) {
  console.log((fahrenheit - 32) * 5 / 9);
}
convertToCelsius(86);
