// const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     const success = false;
//     if (success) {
//       resolve("It worked");
//     } else {
//       reject(new Error("It failed"));
//     }
//   }, 1000);
// });

// promise
//   .then((message) => console.log("Resolved:", message))
//   .catch((error) => console.error("Rejected:", error.message))
//   .finally(() => console.log("Promise has been settled."));

/* function delay(ms, value) {
  return new Promise((resolve) =>
    setTimeout(() => {
      (resolve(value), ms);
    }),
  );
}

delay(500, 1)
  .then((n) => {
    console.log(n);
    return n + 1;
  })
  .then((n) => {
    console.log(n);
    return delay(500, n * 10);
  })
  .then((n) => console.log(n)) // 20
  .catch((err) => console.error("Caught:", err)); */

// function delay(ms, value) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       (resolve(value), ms);
//     }, ms);
//   });
// }

// delay(1000, "hello")
//   .then((message) => console.log(message))
//   .catch((error) => console.error("Rejected:", error.message))
//   .finally(() => console.log("Promise has been settled."));

function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, ms);
  });
}

async function main() {
  try {
    const start = await delay(300, 2);
    const multiplied = start * 5;
    const result = multiplied + 3;
    console.log(result);
  } catch (err) {
    console.error("Caught:", err);
  } finally {
    console.log("Promise has been settled.");
  }
}
