const qs = document.querySelector.bind(document);

let api_url = "http://localhost:8080";
let list_id;

function request(url, method = "GET", data = null, headers = {}, options = {}) {
  headers = Object.assign({ "Content-Type": "application/json" }, headers);
  options = Object.assign(
    {
      method: method.toUpperCase(),
      headers: headers,
    },
    data ? { body: JSON.stringify(data) } : {},
    options
  );

  return fetch(url, options).then((res) => res.json());
}

//Funktion um neue ToDos hinzuzufügen
function addTodo(title, description, color) {
  const new_todo = {
    todo_item: {
      title: title,
      description: description,
      color: color,
      done: false,
    },
  };

  request(`${api_url}/t/${list_id}`, "post", new_todo).then((res) => {
    console.log(`Added todo item: ${res}`);
    updateTodo();
  });
}

function todoOnSubmit(event) {
  const title = qs("#todo_input_title").value;
  const description = qs("#todo_input_description").value;
  const color = qs("#color_select").value;

  if (!title) return false;

  addTodo(title, description, color);

  return false;
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
  if (!list_id) return;

  var todo_list = qs("#todo_list");

  request(`${api_url}/t/${list_id}`).then(({ todo_items }) => {
    console.log(todo_items);
    // Schleife um Items in die Liste hinzuzufügen
    for (i in todo_items) {
      let item = todo_items[i];
      console.log(item);
      if (item.done) continue;

      todo_list.insertAdjacentHTML(
        "afterbegin",
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
  });
}

function main() {
  qs("#start-page").classList.remove("page-active");
  qs("#todo-page").classList.add("page-active");

  updateTodo();
}

qs("#open_list_btn").addEventListener("click", (e) => {
  list_id = qs("#list_id").value;
  main();
});

qs("#new_list_btn").addEventListener("click", (e) => {
  request(`${api_url}/new`).then((res) => {
    list_id = res;
    main();
  });
});
