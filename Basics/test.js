// async function delay(ms, value) {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(value), ms);
//   });
// }

// async function main() {
//   try {
//     const start = await delay(300, 2);
//     const multiplied = start * 5;
//     const result = multiplied + 3;
//     console.log(result);
//   } catch (error) {
//     console.error("Error:", error.message);
//   } finally {
//     console.log("Promise has been settled.");
//   }
// }
// main();


// fetchJson, url1 and url2 are not defined, and returning a promise that resolves to an array of two values is not very useful.
//  Instead, we can use Promise.all() to run the two fetches in parallel
//  and return a promise that resolves to an array of two values.
async function getTwo() {
  const a = await fetchJson(url1);
  const b = await fetchJson(url2);
  try {
    const result = await Promise.all([a, b]);
    return result;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
getTwo()

// fetch does not trigger catch on a 404 because the fetch API considers
// any HTTP response (including 404) to be a success.
// you can fix this by manuakky checking the response.ok property.

// an async function returns a promise. An await function is only assigned under an asyncfunction