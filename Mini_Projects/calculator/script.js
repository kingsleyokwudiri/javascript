// Get display elements
const displayResult = document.getElementById("displayText");
const displayExpression = document.getElementById("displayExpression");

// Function to update display
function updateDisplay(value, expression = "") {
  if (displayResult) {
    displayResult.textContent = value || "0";
  }
  if (displayExpression) {
    displayExpression.textContent = expression || "";
  }
}

let currentInput = "";
let firstNumber = 0;
let activeAction = "";
let savedResult = null;

// Proper localStorage parsing
const storedData = localStorage.getItem("result");
if (storedData) {
  savedResult = parseFloat(JSON.parse(storedData));
}

function pressAction(action) {
  if (currentInput === "") {
    alert("Please enter a number");
    return;
  }
  firstNumber = parseFloat(currentInput);
  activeAction = action;
  currentInput = "";

  // Show the full expression with first number and operator
  const symbol = getOperatorSymbol(action);
  updateDisplay(firstNumber + " " + symbol + " ", firstNumber + " " + symbol);
}

// Helper function for display symbols
function getOperatorSymbol(action) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };
  return symbols[action] || action;
}

function pressNumber(num) {
  // Prevent multiple leading zeros
  if (currentInput === "0" && num === 0) {
    return;
  }
  // If current input is "0" and we press a non-zero number, replace it
  if (currentInput === "0" && num !== ".") {
    currentInput = num.toString();
  } else {
    currentInput += num.toString();
  }

  // Show current input in result area, keep expression if it exists
  const expression = displayExpression.textContent || "";
  const exprParts = expression.split(" ");
  if (exprParts.length > 1) {
    // We have an operator, show expression + current input
    updateDisplay(currentInput, exprParts[0] + " " + exprParts[1] + " ");
  } else {
    updateDisplay(currentInput);
  }
}

function pressDecimal() {
  // If current input is empty, start with "0."
  if (currentInput === "") {
    currentInput = "0.";
    const expression = displayExpression.textContent || "";
    const exprParts = expression.split(" ");
    if (exprParts.length > 1) {
      updateDisplay(currentInput, exprParts[0] + " " + exprParts[1] + " ");
    } else {
      updateDisplay(currentInput);
    }
    return;
  }

  // If current input already has a decimal, ignore
  if (currentInput.includes(".")) {
    return;
  }

  // Add decimal point
  currentInput += ".";
  const expression = displayExpression.textContent || "";
  const exprParts = expression.split(" ");
  if (exprParts.length > 1) {
    updateDisplay(currentInput, exprParts[0] + " " + exprParts[1] + " ");
  } else {
    updateDisplay(currentInput);
  }
}

function showResult() {
  if (savedResult !== null && savedResult !== undefined) {
    alert("Saved result: " + savedResult);
    updateDisplay(savedResult, "");
    // Set currentInput to saved result for continued calculations
    currentInput = savedResult.toString();
  } else {
    alert("No saved result found");
    updateDisplay("0", "");
  }
}

function pressEquals() {
  if (currentInput === "") {
    alert("Please enter a number");
    return;
  }

  let secondNumber = parseFloat(currentInput);

  // Check if secondNumber is NaN (invalid number)
  if (isNaN(secondNumber)) {
    alert("Invalid number");
    return;
  }

  let result = 0;
  let expression = "";

  if (activeAction === "+") {
    result = firstNumber + secondNumber;
    expression = firstNumber + " + " + secondNumber + " =";
  } else if (activeAction === "-") {
    result = firstNumber - secondNumber;
    expression = firstNumber + " − " + secondNumber + " =";
  } else if (activeAction === "*") {
    result = firstNumber * secondNumber;
    expression = firstNumber + " × " + secondNumber + " =";
  } else if (activeAction === "/") {
    if (secondNumber === 0) {
      alert("Error: Division by zero is not allowed.");
      updateDisplay("Error", "");
      return;
    }
    result = firstNumber / secondNumber;
    expression = firstNumber + " ÷ " + secondNumber + " =";
  } else {
    alert("Please select an action first.");
    return;
  }

  // Round to avoid floating point issues
  result = Math.round(result * 1000000) / 1000000;

  currentInput = result.toString();
  savedResult = result;
  localStorage.setItem("result", JSON.stringify(result));
  activeAction = "";
  firstNumber = 0;

  // Show full calculation and result
  updateDisplay(result, expression);
}

function resetCalculator() {
  currentInput = "";
  firstNumber = 0;
  activeAction = "";
  savedResult = null;
  localStorage.removeItem("result");
  updateDisplay("0", "");
}

// Initialize display
if (savedResult !== null) {
  updateDisplay(savedResult, "");
  currentInput = savedResult.toString();
} else {
  updateDisplay("0", "");
}
