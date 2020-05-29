import html from "./todo.html";

function main(container, id) {
  const qs = container.querySelector.bind(container);
  const qsa = container.querySelectorAll.bind(container);

  const { todo_api, router } = window;
  const todo_list = {};

  const copy_text_btn = qs("#copy_text");
  const todo_form = qs("#todo_form");

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

  function todoOnSubmit() {
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
      if (!title.value) return;
      addTodo(title.value, description.value, color);
    } finally {
      title.value = "";
      description.value = "";
      qs("#color-blue").checked = true;
    }
  }

  function todoOnDone(event) {
    event.target.classList.toggle("checked");
    const id = event.target.attributes["data-todo-id"].value;
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

  copy_text_btn.addEventListener("click", () => {
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

  todo_form.addEventListener("submit", todoOnSubmit);

  async function updateItems() {
    try {
      const items = await todo_api.getItems();
    } catch (err) {
      router.error();
    }

    Object.assign(todo_list, items);

    // Schleife um Items in die Liste hinzuzufügen
    for (let i in items) {
      let item = items[i];
      if (item.done) continue;
      insertTodoItem(item);
    }
  }

  function init() {
    todo_api.setListId(id);
    displayListId();
    updateItems();
  }

  init();
}

export default function render(args) {
  console.log(args);
  const element = document.createElement("div");
  element.innerHTML = html;
  main(element, args.id);
  return element;
}
