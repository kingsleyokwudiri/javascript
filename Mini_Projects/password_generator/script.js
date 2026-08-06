const passwordBox = document.getElementById("password");
const length = 12;
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbols = "@#$%^&*()_+~|}{[]></-=";
const allChars = upperCase + lowerCase + number + symbols;

let password = "";

function generatePassword() {
  password += upperCase[Math.floor(Math.random() * upperCase.length)];
  password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password += number[Math.floor(Math.random() * number.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  while (length > password.length) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  passwordBox.value = password;
}

let intervalId = null;
const message = document.getElementById("password-message");
const copiedMessage = document.getElementById("copy");

// for copying the password
function copyPassword() {
  passwordBox.select();
  document.execCommand("copy");
}

function clearConfirmation() {
  if (intervalId !== null) {
    clearTimeout(intervalId);
    intervalId = null;
  }
  message.textContent = "";
}

function showConfirmation() {
  clearConfirmation();
  message.textContent = "Password has been generated.";
  intervalId = setTimeout(function () {
    message.textContent = "";
    intervalId = null;
  }, 2000);
}

function showCopiedMessage() {
  if (!password) {
    alert("No password generated.");
  } else {
    clearCopiedMessage();
    const originalText = copiedMessage.textContent;
    copiedMessage.textContent = "Copied!";
    intervalId = setTimeout(function () {
      copiedMessage.textContent = originalText;
      intervalId = null;
    }, 1000);
  }
}

function clearCopiedMessage() {
  if (intervalId !== null) {
    clearTimeout(intervalId);
    intervalId = null;
  }
  copiedMessage.textContent = "Copy";
}

document.querySelector(".password-button").addEventListener("click", () => {
  generatePassword();
});

document.querySelector(".copy-button").addEventListener("click", () => {
  copyPassword();
  showCopiedMessage();
});

document.querySelector(".password-button").addEventListener("click", () => {
  showConfirmation();
});
