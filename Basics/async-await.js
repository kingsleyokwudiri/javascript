function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} for ${url}`);
  }
  return response.json();
}

async function main() {
  try {
    console.log("Loading...");
    await wait(1000);

    const [user, posts] = await Promise.all([
      fetchJson("https://jsonplaceholder.typicode.com/users/1"),
      fetchJson("https://jsonplaceholder.typicode.com/posts?userId=1"),
    ]);

    console.log(`${user.name} wrote ${posts.length} posts`);
    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
