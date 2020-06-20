function sanitize(string) {
  const sanitizer = document.createElement("div");
  sanitizer.textContent = string;
  return sanitizer.innerHTML;
}

export default function interpolate(template, data) {
  let output = template;

  for (let [key, value] of Object.entries(data)) {
    const pattern = String.raw`\$\{${key}\}`;
    value = sanitize(value);
    output = output.replace(new RegExp(pattern, "g"), value);
  }
  return output.toString();
}
