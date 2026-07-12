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
    const name = todoObject.name;
    const dueDate = todoObject.dueDate;
    const html = `<p>${name} ${dueDate} <button onclick="todoList.splice(${i}, 1); renderTodoList();">Delete</button></p>`;
    todoListHTML += html;
    document.querySelector(".js-todo-list").innerHTML = todoListHTML;
  }
}

function addTodo() {
  const inputElement = document.querySelector(".js-name-input");
  const name = inputElement.value;
  if (name === "") {
    alert("Please enter a task!");
  } else {
    todoList.push(name);
  }

  inputElement.value = "";
  renderTodoList();
}

function calculationkeyDown(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}
