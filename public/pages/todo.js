import html from "./todo.html";
import TodoItem from "../components/todo-item.js";

function main(container, id) {
  const qs = container.querySelector.bind(container);
  const qsa = container.querySelectorAll.bind(container);

  const { todo_api, router } = window;
  const todo_items = {};

  const copy_text_btn = qs("#copy_text");
  const todo_form = qs("#todo_form");
  const todo_list = qs("#todo_list");

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
      console.log("Marked as done:", new_item);
    });
  }

  function insertTodoItem(item) {
    let old_item = todo_items[item.id];
    let new_item;

    if (old_item && item.done) {
      todo_list.removeChild(old_item);
      delete todo_items[item.id];
    } else {
      new_item = TodoItem(item);
      new_item.addEventListener("click", todoOnDone);
      todo_items[item.id] = new_item;

      if (old_item) todo_list.replaceChild(new_item, old_item);
      else
        todo_list.insertBefore(new_item, todo_list.lastElementChild);
    }
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
    let items;
    try {
      items = await todo_api.getItems();
    } catch (err) {
      router.error();
    }

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
    todo_api.subscribe((todo_item) => {
      insertTodoItem(todo_item);
    });
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
