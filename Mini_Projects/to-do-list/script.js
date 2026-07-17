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
  let todoListHTML = "";

  if (todoList.length === 0) {
    todoListHTML =
      '<div class="empty-message">No tasks yet. Add one above!</div>';
  } else {
    todoList.forEach(function (todoObject, index) {
      for (let i = 0; i < todoList.length; i++) {
        const name = todoObject.name;
        const dueDate = todoObject.dueDate;
        // or const { name, dueDate} = todoObject;
        const html = `
      <div>${name}</div> 
      <div>${dueDate}</div> 
      <button class="delete-button" onclick="
      todoList.splice(${i}, 1); renderTodoList(); saveTodoList();
      ">Delete</button>`;
        todoListHTML += html;
      }
    });
  }

  document.querySelector(".js-todo-list").innerHTML = todoListHTML;
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
  } else if (dueDate === "") {
    alert("Please enter a date!");
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
  todoList = [];
  saveTodoList();
  renderTodoList();
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

// Load tasks from localStorage and render them
loadTodoList();
renderTodoList();
