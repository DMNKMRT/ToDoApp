import html from "./start.html";
import styles from "./start.module.css";

import interpolate from "../utils/template.js";

function main(container) {
  const qs = container.querySelector.bind(container);

  const { router, todo_api } = window;

  const open_list_form = qs("#open_list_form");
  const new_list_btn = qs("#new_list_btn");
  const list_id_input = qs("#list_id");

  const open = (id) => {
    if (id) router.goto(`/todo/${id}`);
    else console.error("No todo id provided");
  };

  open_list_form.addEventListener("submit", () => {
    open(list_id_input.value);
  });

  new_list_btn.addEventListener("click", () => {
    todo_api.newList().then((id) => open(id));
  });
}

export default function render() {
  const element = document.createElement("div");
  element.innerHTML = interpolate(html, styles);
  main(element);
  return element.firstChild;
}
