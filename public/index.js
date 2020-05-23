const qs = document.querySelector.bind(document);

const copy_text_btn = qs("#copy_text");
const open_list_form = qs("#open_list_form");
const new_list_btn = qs("#new_list_btn");

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

  return fetch(url, options).then((res) => {
    console.log("<", res);
    return res.json();
  });
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

  request(`${api_url}/api/${list_id}`, "post", new_todo).then((res) => {
    console.log(`Added todo item: ${res}`);
    todo_list[res.id] = res;
    insertTodoItem(res);
  });
}

function todoOnSubmit(event) {
  const title = qs("#todo_input_title");
  const description = qs("#todo_input_description");
  let color = "";

  document.querySelectorAll('input[name="color"]').forEach((item, i) => {
    if (item.checked) {
      color = item.value;
      return;
    }
  });

  console.log("Color:", color);

  try {
    if (!title.value) return false;
    addTodo(title.value, description.value, color);
  } finally {
    title.value = "";
    description.value = "";
    qs("#color-blue").checked = true;
    return false;
  }
}

function todoOnDone(event) {
  event.target.classList.toggle("checked");
  const id = event.target.attributes["data-todo-id"].value;
  const item = todo_list[id];
  request(`${api_url}/api/${list_id}/${id}`, "patch", {
    todo_item: { done: true },
  }).then((res) => {
    qs(`#todo-item-${id}`).remove();
    console.log("Marked as done:", res);
  });
}

function insertTodoItem(item) {
  qs("#todo_list").insertAdjacentHTML(
    "afterbegin",
    `
    <li class="todo_item ${item.color}" id="todo-item-${item.id}">
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

function displayListId() {
  qs("#list_id_output").textContent = list_id;
  history.pushState({}, "", `/t/${list_id}`);
}

function main() {
  if (!list_id) return;

  request(`${api_url}/api/${list_id}`).then((res) => {
    if ("error" in res) return;
    const { todo_items } = res;
    Object.assign(todo_list, todo_items);
    // Schleife um Items in die Liste hinzuzufügen
    for (i in todo_items) {
      let item = todo_items[i];
      if (item.done) continue;
      insertTodoItem(item);
    }

    displayListId();
    qs("#start-page").classList.remove("page-active");
    qs("#todo-page").classList.add("page-active");
  });
}

copy_text_btn.addEventListener("click", (e) => {
  navigator.clipboard.writeText(list_id).then(() => {
    const save_text = copy_text_btn.innerText;
    copy_text_btn.innerText = "Copied!";
    copy_text_btn.disabled = true;
    setTimeout(() => {
      copy_text_btn.innerText = save_text;
      copy_text_btn.disabled = false;
    }, 1000);
  });
});

open_list_form.addEventListener("submit", (e) => {
  // TODO: Error handling
  list_id = qs("#list_id").value;
  main();
});

new_list_btn.addEventListener("click", (e) => {
  request(`${api_url}/api/new`).then((res) => {
    list_id = res;
    main();
  });
});
