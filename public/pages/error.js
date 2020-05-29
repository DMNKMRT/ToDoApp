import html from "./error.html";
import "./error.css";

export default function render() {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element;
}
