let hrs = document.getElementById("hrs");
let mins = document.getElementById("mins");
let secs = document.getElementById("secs");
// gets the time and date
let currentTime = new Date();
// displays the local time on the page
hrs.innerHTML = currentTime.getHours();
mins.innerHTML = currentTime.getMinutes();
secs.innerHTML = currentTime.getSeconds();
