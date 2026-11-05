const BASE = "https://jsonplaceholder.typicode.com";
/* GET

async function getExamples() {
  const listRes = await fetch(`${BASE}/posts?_limit=3`);
  const posts = await listRes.json();
  console.log(posts.length);       // 3

  const oneRes = await fetch(`${BASE}/posts/1`);
  const post = await oneRes.json();
  console.log(post.title);
}
*/

/* POST 
async function createPost() {
  const response = await fetch(`${BASE}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Hello", body: "My first post", userId: 1 }),
  });

  console.log(response.status);    // 201
  const created = await response.json();
  console.log(created);            // your data plus an id (101)
}
*/

/* PUT AND PATCH
async function updatePost() {
  // PUT: send the whole object
  const putRes = await fetch(`${BASE}/posts/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: 1, title: "New title", body: "New body", userId: 1 }),
  });
  console.log(await putRes.json());

  // PATCH: send only what changes
  const patchRes = await fetch(`${BASE}/posts/1`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Only the title changed" }),
  });
  console.log(await patchRes.json());
}
*/

/* DELETE 
async function deletePost() {
  const response = await fetch(`${BASE}/posts/1`, { method: "DELETE" });
  console.log(response.status);    // 200
  console.log(await response.json()); // {} (nothing useful comes back)
}
*/


async function request(path, method = "GET", data) {
  const options = { method, headers: {} };

  if (data !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE}${path}`, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${method} ${path}`);
  }
  return { status: response.status, data: await response.json() };
}

// Usage
async function main() {
  try {
    const patched = await request("/posts/1", "PATCH", { title: "Only the title changed" });
    console.log(patched.data.title, patched.status);

    const deleted = await request("/posts/1", "DELETE");
    console.log(deleted.status, deleted.data);

    await request("/posts/99999"); // 404, throws, caught below
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();


// async function createPost() {
//   const response = await fetch(`${BASE}/posts`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ title: "Hi", body: "My post", userId: 1 }),
//   });
//   console.log(response.status);    // 201
//   const result = await response.json();
//   console.log(result.data.userId);
//   return response.json();
// }
// createPost();

// request("/posts", "POST", { title: "Hi", body: "My post", userId: 1 }).then(
//   (result) => console.log(result.status, result.data.id),
// );
