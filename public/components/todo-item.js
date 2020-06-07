import interpolate from "../utils/template.js";
import html from "./todo-item.html";

export default function render(args) {
  const data = args;
  const element = document.createElement("div")
  element.innerHTML = interpolate(html, data);
  return element.firstChild;
}
