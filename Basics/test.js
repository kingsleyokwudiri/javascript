/* the three stages of a Promise are settled, pending and rejected */

/* it logs 
  B Boom
  C
  it logs that because the code is set to throw a new Error at the beginning
*/

// fixed code
Promise.resolve(5)
  .then((n) => console.log("A"))
  .catch((err) => console.log("B", err.message))
  .finally(() => console.log("C"))

// the code fails because c is not settled. Id pick Promise.allSettled([...]) when all three tasks are settled



