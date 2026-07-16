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
  for (let i = 0; i < todoList.length; i++) {
    const todoObject = todoList[i];
    // const { name, dueDate } = todoObject; // Destructuring assignment (optional)
    const name = todoObject.name;
    const dueDate = todoObject.dueDate;
    const html = `
    <div>${name}</div> 
    <div>${dueDate}</div> 
    <button class="delete-button" onclick="
    todoList.splice(${i}, 1); renderTodoList();
    ">Delete</button>`;
    todoListHTML += html;
  }
  // Moved outside the loop so it clears correctly when the list is empty
  document.querySelector(".js-todo-list").innerHTML = todoListHTML;
  saveTodoList();
}

function addTodo() {
  const inputElement = document.querySelector(".js-name-input");
  const name = inputElement.value;
  const dateInputElement = document.querySelector(".js-date-input");
  const dueDate = dateInputElement.value;
  if (name === "") {
    alert("Please enter a task!");
    inputElement.focus(); // Set focus back to the input field
    return;
  } else if (dueDate === "") {
    alert("Please enter a date!");
    dateInputElement.focus(); // Set focus back to the date input field
    return;
  } else {
    // Fixed: Now pushes an object structure to match the initial list array
    todoList.push({
      // shorthand property names can be used here since the variable names match the object keys
      // instead of writing name: name, dueDate: dueDate, we can just write name, dueDate
      name,
      dueDate,
    });
  }

  inputElement.value = "";
  renderTodoList();
}

function calculationkeyDown(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

// Load tasks from localStorage and render them
loadTodoList();
renderTodoList();
