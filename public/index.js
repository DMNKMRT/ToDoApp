const qs = document.querySelector.bind(document);

let api_url = "http://localhost:8080";
let list_id;
let todo_list = {};

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
    insertTodoItem(res);
  });
}

function todoOnSubmit(event) {
  const title = qs("#todo_input_title");
  const description = qs("#todo_input_description");
  const color = qs("#color_select");

  try {
    if (!title.value) return false;
    addTodo(title.value, description.value, color.value);
  } finally {
    title.value = "";
    description.value = "";
    color.value = "";
    return false;
  }
}

function todoOnDone(event) {
  event.target.classList.toggle("checked");
  const id = event.target.attributes["data-todo-id"].value;
  console.log("id:", id);
  console.log(todo_list);
  const item = todo_list[id];

  qs(`#todo-item-${id}`).remove();
}

function insertTodoItem(item) {
  qs("#todo_list").insertAdjacentHTML(
    "afterbegin",
    `
    <li class="todo_item" id="todo-item-${item.id}">
      <h1 class="todo_item_title">
        ${item.title}
        <button data-todo-id="${item.id}" class="todo_done_button"
        onclick="return todoOnDone(event);"></button>
      </h1>
      <p class="todo_item_description">${item.description}</p>
    </li>
    `
  );
}

function main() {
  if (!list_id) return;

  request(`${api_url}/t/${list_id}`).then((res) => {
    if ("error" in res) return;
    const { todo_items } = res;
    Object.assign(todo_list, todo_items);

    // Schleife um Items in die Liste hinzuzufügen
    for (i in todo_items) {
      let item = todo_items[i];
      if (item.done) continue;
      insertTodoItem(item);
    }

    qs("#start-page").classList.remove("page-active");
    qs("#todo-page").classList.add("page-active");
  });
}

qs("#open_list_form").addEventListener("submit", (e) => {
  // TODO: Error handling
  list_id = qs("#list_id").value;
  main();
});

qs("#new_list_btn").addEventListener("click", (e) => {
  request(`${api_url}/new`).then((res) => {
    list_id = res;
    main();
  });
});
