import html from "./error.html";
import styles from "./error.module.css";

import interpolate from "../utils/template.js";

export default function render() {
  const element = document.createElement("div");
  element.innerHTML = interpolate(html, styles);
  return element;
}
