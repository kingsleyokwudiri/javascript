let todoList = [
  {
    name: "make dinner",
    dueDate: "2022-12-22",
  },
  {
    name: "wash dishes",
    dueDate: "2022-12-22",
  },
];

function renderTodoList() {
  let todoListHTML = "";
  for (let i = 0; i < todoList.length; i++) {
    const todoObject = todoList[i];
    // const { name, dueDate } = todoObject; // Destructuring assignment (optional)
    const name = todoObject.name;
    const dueDate = todoObject.dueDate;
    const html = `<p>${name} ${dueDate} <button onclick="todoList.splice(${i}, 1); renderTodoList();">Delete</button></p>`;
    todoListHTML += html;
  }
  // Moved outside the loop so it clears correctly when the list is empty
  document.querySelector(".js-todo-list").innerHTML = todoListHTML;
}

function addTodo() {
  const inputElement = document.querySelector(".js-name-input");
  const name = inputElement.value;
  const dateInputElement = document.querySelector(".js-date-input");
  const dueDate = dateInputElement.value;
  if (name === "") {
    alert("Please enter a task!");
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

// Initial render to display the default tasks
renderTodoList();
