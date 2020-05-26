export default function request(url, method = "GET", data = null, headers = {}, options = {}) {
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

