let next_id = 0;
class TodoItem {
  constructor(title, description, color, done = false) {
    this.id = next_id++;
    this.title = title;
    this.description = description;
    this.color = color;
    this.done = done;
  }
}

const todo_items = {
  "0": new TodoItem("Irgendwas 1", "blablabla", "red"),
  "1": new TodoItem("Irgendwas 2", "blablabla", "red"),
  "2": new TodoItem("Irgendwas 3", "blablabla", "red"),
  "3": new TodoItem("Irgendwas 4", "blablabla", "red"),
  "4": new TodoItem("Irgendwas 5", "blablabla", "red"),
  "5": new TodoItem("Irgendwas 6", "blablabla", "red"),
};

function getTodoItems() {
  return todo_items;
}

//Funktion um neue ToDos hinzuzufügen
function addTodo(title, description, color) {
  const new_todo = new TodoItem(title, description, color);
  todo_items[new_todo.id] = new_todo;
  console.log(`added ${new_todo} to todo list`);
  updateTodo();
}

function todoOnSubmit(event) {
  const title = document.getElementById("todo_input_title").value;
  const description = document.getElementById("todo_input_description").value;
  const color = document.getElementById("color_select").value;

  if (!title) return false;

  console.log(title);
  console.log(description);
  console.log(color);

  addTodo(title, description, color);
}

function todoOnDone(event) {
  event.target.classList.toggle("checked");
  const id = event.target.attributes["data-todo-id"].value;
  const item = todo_items[id];
  console.log(`${item} was clicked`);

  item.done = true;
  updateTodo();
}

function updateTodo() {
  var todo_list = document.getElementById("todo_list");
  var items = getTodoItems();

  todo_list.innerHTML = "";
  // Schleife um Items in die Liste hinzuzufügen
  for (i in items) {
    const item = items[i];
    if (item.done) continue;

    todo_list.insertAdjacentHTML(
      "beforeend",
      // ToDo Item (HTML)
      `<li class="todo_item">
          <h1 class="todo_item_title">${item.title}
            <button
            data-todo-id="${item.id}"
            class="todo_done_button"
            onclick="todoOnDone(event);"></button>
          </h1>
          <p class="todo_item_description">${item.description}</p>
        </li>`
    );
  }
  //Form Item, Da wo man seine ToDos erstellt
  todo_list.insertAdjacentHTML(
    "beforeend",
    `
    <li id="todo_item" class="todo_item">
      <form id="todo_form" action="#" onsubmit="return todoOnSubmit(event)">
        <h1 class="todo_item_title">
          <input type="text" class="todo_input" id="todo_input_title" value="" placeholder="Enter a title">
        </h1>
        <p class="todo_item_description">
          <input type="text" class="todo_input" id="todo_input_description" value="" placeholder="Enter a description">
        </p>
          <select name="colors" id="color_select">
            <option id="color_option" value="">please select a color</option>
            <option id="color_option" value="red">red</option>
            <option id="color_option" value="green">green</option>
            <option id="color_option" value="yellow">yellow</option>
          </select>
          <button>Submit</button>
      </form>
    </li>
    `
  );
}
updateTodo();
