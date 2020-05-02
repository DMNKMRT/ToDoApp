function getTodoItems() {
  var items = [
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

  return items;
}

var todo_list = document.getElementById("todo_list");
var items = getTodoItems();

for (let i = 0; i < items.length; i++) {
  let item = items[i];
  todo_list.insertAdjacentHTML(
    "afterbegin",
    `
      <li id="todo_item" class="todo_item">
        <h1 class="todo_item_title">${item["title"]}</h1>
        <p class="todo_item_description">${item["description"]}</p>
      </li>
    `
  );
}
