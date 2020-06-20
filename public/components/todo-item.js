import interpolate from "../utils/template.js";
import html from "./todo-item.html";
import styles from "./todo-item.module.css";

export default function render(args) {
  const data = { ...styles, ...args };
  console.log(styles);
  const element = document.createElement("div");
  element.innerHTML = interpolate(html, data);
  return element.firstChild;
}
