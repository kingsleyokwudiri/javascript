// creates a new HTTP request for the backend
const xhr = new XMLHttpRequest();

xhr.addEventListener("load", () => {
  xhr.response;
});
xhr.open("GET", "https://supersimplebackend.dev");

// asynchronous code
xhr.send();

xhr.response;
