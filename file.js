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

function convertTemperature(degrees, unit, message = 'The temperature is: ') {
  if (unit === 'C') {
    const roundedFahrenheit = Math.round(degrees * 9 / 5 + 32);
    console.log(`${message}${roundedFahrenheit}°F`);
  } else if (unit === 'F') {
    const roundedCelsius = Math.round((degrees - 32) * 5 / 9);
    console.log(`${message}${roundedCelsius}°C`);
  } else {
    console.log('Invalid unit. Please use "C" for Celsius or "F" for Fahrenheit.');
  }
  return null;
}
convertTemperature(25, 'C');
convertTemperature(86, 'F');