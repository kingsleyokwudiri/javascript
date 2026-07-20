let todoList = [];

function loadTodoList() {
  const storedTodos = localStorage.getItem("todoList");
  if (storedTodos) {
    try {
      todoList = JSON.parse(storedTodos) || [];
    } catch (error) {
      todoList = [];
      console.error("Failed to load todo list from localStorage:", error);
    }
  }
}

function saveTodoList() {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function renderTodoList() {
  const container = document.querySelector(".js-todo-list");

  if (todoList.length === 0) {
    container.innerHTML =
      '<div class="empty-message">✅ No tasks yet. Add one above!</div>';
    return;
  }

  let todoListHTML = "";
  todoList.forEach(function (todoObject, index) {
    const name = todoObject.name || "Untitled";
    const dueDate = todoObject.dueDate || "No date";
    const html = `
      <div>${name}</div> 
      <div>${dueDate}</div> 
      <button class="delete-button" data-index="${index}">Delete</button>
    `;
    todoListHTML += html;
  });

  container.innerHTML = todoListHTML;
}

function addTodo() {
  const inputElement = document.querySelector(".js-name-input");
  const name = inputElement.value.trim();
  const dateInputElement = document.querySelector(".js-date-input");
  const dueDate = dateInputElement.value;

  if (name === "") {
    alert("Please enter a task!");
    inputElement.focus();
    return;
  }

  if (dueDate === "") {
    alert("Please select a date!");
    dateInputElement.focus();
    return;
  }

  todoList.push({ name, dueDate });
  inputElement.value = "";
  dateInputElement.value = "";
  saveTodoList();
  renderTodoList();
}

function clearList() {
  if (todoList.length === 0) {
    alert("Your list is already empty!");
    return;
  }

  if (confirm("Are you sure you want to delete all tasks?")) {
    todoList = [];
    saveTodoList();
    renderTodoList();
  }
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

// Event delegation for delete buttons
document.querySelector(".js-todo-list").addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    const index = parseInt(event.target.dataset.index);
    if (!isNaN(index)) {
      todoList.splice(index, 1);
      saveTodoList();
      renderTodoList();
    }
  }
});

// Event listeners for buttons
document.querySelector(".add-button").addEventListener("click", addTodo);
document.querySelector(".clear-button").addEventListener("click", clearList);

// Keyboard support for inputs
document
  .querySelector(".js-name-input")
  .addEventListener("keydown", handleKeyDown);
document
  .querySelector(".js-date-input")
  .addEventListener("keydown", handleKeyDown);

// Load tasks from localStorage and render them
loadTodoList();
renderTodoList();
