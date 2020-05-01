
function getTodoItems() {
  var items = [
    {
      title: "Einkaufen",
      description: "Ich muss ein paar Äpfel Kaufen",
      color: "yellow";
    },
    {
      title: "Sport",
      description: "Heftiges Seix Pack workout",
      color: "red";
    },
    {
      title: "Hausaufgaben",
      description: "Physik Seite 430, Nr 1a)",
      color: "green";
    },
    {
      title: "Kino",
      description: "Mit Erich ins Kino gehen",
      color: "blue";
    },
    {
      title: "ToDo-App programmieren",
      description: "GitHub einrichten (2h), Fake-Daten schreiben (5m)",
      color: "green";
    },
    {
      title: "Einkaufen 2",
      description: "Einkaufen gehen, und Zeug kaufen / klauen",
      color: "yellow";
    },
  ];

  return items;
}

var todo_list = document.getElementById("todo_list");
