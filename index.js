const todo_items = [
  {
    title: "Einkaufen",
    description: "Ich muss ein paar Äpfel Kaufen",
    color: "yellow",
  },
  {
    title: "Einkaufen",
    description: "Ich muss ein paar Äpfel Kaufen",
    color: "yellow",
  },
  {
    title: "Einkaufen",
    description: "Ich muss ein paar Äpfel Kaufen",
    color: "yellow",
  },
  {
    title: "Einkaufen",
    description: "Ich muss ein paar Äpfel Kaufen",
    color: "yellow",
  },
  {
    title: "Einkaufen",
    description: "Ich muss ein paar Äpfel Kaufen",
    color: "yellow",
  },
  {
    title: "Sport",
    description: "Heftiges Six Pack workout",
    color: "red",
  },
  {
    title: "Hausaufgaben",
    description: "Physik Seite 430, Nr 1a)",
    color: "green",
  },
  {
    title: "Kino",
    description: "Mit Erich ins Kino gehen",
    color: "blue",
  },
  {
    title: "ToDo-App programmieren",
    description: "GitHub einrichten (2h), Fake-Daten schreiben (5m)",
    color: "green",
  },
  {
    title: "Einkaufen 2",
    description: "Einkaufen gehen, und Zeug kaufen / klauen",
    color: "yellow",
  },
];

function getTodoItems() {
  return todo_items;
}

//Funktion um neue ToDos hinzuzufügen
function addTodo(title, description, color) {
  todo_items.push({ title: title, description: description, color: color });
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

function updateTodo() {
  var todo_list = document.getElementById("todo_list");
  var items = getTodoItems();

  todo_list.innerHTML = "";
  //Schleife um Items in die Liste hinzuzufügen
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    todo_list.insertAdjacentHTML(
      "beforeend",
      `
        <li id="todo_item" class="todo_item">
          <h1 class="todo_item_title">${item["title"]}</h1>
          <p class="todo_item_description">${item["description"]}</p>
        </li>
      `
    );
  }
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
