import TodoApi from "./utils/todo_api.js";

const qs = document.querySelector.bind(document);
const qsa = document.querySelectorAll.bind(document);

const copy_text_btn = qs("#copy_text");
const open_list_form = qs("#open_list_form");
const new_list_btn = qs("#new_list_btn");
const todo_form = qs("#todo_form");

let todo_list = {};

const todo_api = new TodoApi();

// Funktion um neue ToDos hinzuzufügen
function addTodo(title, description, color) {
  const item = {
    title: title,
    description: description,
    color: color,
    done: false,
  };

  todo_api.addItem(item).then((new_item) => {
    console.log(`Added todo item: ${new_item}`);
    todo_list[new_item.id] = new_item;
    insertTodoItem(new_item);
  });
}

function todoOnSubmit(event) {
  const title = qs("#todo_input_title");
  const description = qs("#todo_input_description");
  let color = "";

  for (let item of qsa('input[name="color"]')) {
    if (item.checked) {
      color = item.value;
      break;
    }
  }

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
  todo_api.markAsDone(id).then((new_item) => {
    qs(`#todo-item-${id}`).remove();
    console.log("Marked as done:", new_item);
  });
}

function insertTodoItem(item) {
  qs("#todo_list").insertAdjacentHTML(
    "afterbegin",
    `
    <li class="todo_item ${item.color}" id="todo-item-${item.id}">
      <h1 class="todo_item_title">
        ${item.title}
        <button data-todo-id="${item.id}" class="todo_done_button"></button>
      </h1>
      <p class="todo_item_description">${item.description}</p>
    </li>
    `
  );
  qs(`[data-todo-id="${item.id}"`).addEventListener("click", todoOnDone);
}

function displayListId() {
  qs("#list_id_output").textContent = todo_api.list_id;
}

function main() {
  if (!todo_api.list_id) return;

  todo_api.getItems().then((items) => {
    Object.assign(todo_list, items);
    // Schleife um Items in die Liste hinzuzufügen
    for (i in items) {
      let item = items[i];
      if (item.done) continue;
      insertTodoItem(item);
    }

    displayListId();
    qs("#start-page").classList.remove("page-active");
    qs("#todo-page").classList.add("page-active");
  });
}

copy_text_btn.addEventListener("click", (e) => {
  navigator.clipboard.writeText(todo_api.list_id).then(() => {
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
  todo_api.setListId(qs("#list_id").value);
  main();
});

new_list_btn.addEventListener("click", (e) => {
  todo_api.newList().then((id) => {
    todo_api.setListId(id);
    main();
  });
});

todo_form.addEventListener("submit", todoOnSubmit);

if (module.hot) module.hot.accept();
