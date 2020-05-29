import Router from "./router.js";

const container = document.createElement("div");
document.body.appendChild(container);

const router = new Router(container);

const render_root = () => {
  const element = document.createElement("html");
  element.innerHTML = `<div id="test">root loaded</div>`;
  return element;
};

const render_todo = (args) => {
  const element = document.createElement("html");
  element.innerHTML = `<div id="todo_id">${args.todo_id}</div>`;
  return element;
};

const render_todo_item = (args) => {
  const element = document.createElement("html");
  element.innerHTML = `<div id="todo_id">${args.todo_id}</div>
                       <div id="id">${args.id}</div>`;
  return element;
};

router.add("/", render_root);
router.add("/todo/:todo_id", render_todo);
router.add("/todo/:todo_id/:id", render_todo_item);

test('twice: _getRoute("/todo/1234")', () => {
  expect(router._getRoute("/todo/1234/").routeObj.render).toBe(render_todo);
  expect(router._getRoute("/todo/1234/").routeObj.render).toBe(render_todo);
});

test('twice: _getRoute("/")', () => {
  expect(router._getRoute("/").routeObj.render).toBe(render_root);
  expect(router._getRoute("/").routeObj.render).toBe(render_root);
});

test('twice: _getRoute("/todo/1234/321")', () => {
  expect(router._getRoute("/todo/1234/321").routeObj.render).toBe(
    render_todo_item
  );
  expect(router._getRoute("/todo/1234/321").routeObj.render).toBe(
    render_todo_item
  );
});

test("_getArgs() from /todo/1234", () => {
  const path = "/todo/1234";
  const routeObj = router.routes["/todo/:todo_id"];

  const regex = new RegExp(routeObj.pattern);
  const match = path.match(regex);

  const args = router._getArgs(routeObj, match);
  expect(args).toEqual({ todo_id: "1234" });
});

test("_getArgs() from /todo/1234/321", () => {
  const path = "/todo/1234/321";
  const routeObj = router.routes["/todo/:todo_id/:id"];

  const regex = new RegExp(routeObj.pattern);
  const match = path.match(regex);

  const args = router._getArgs(routeObj, match);
  expect(args).toEqual({ todo_id: "1234", id: "321" });
});

test('load("/todo/1234")', () => {
  router.load("/todo/1234");
  const div = container.querySelector("#todo_id");
  expect(div).toBeDefined();
  expect(div.textContent).toEqual("1234");
});

test('load("/todo/1234/321")', () => {
  router.load("/todo/1234/321");

  const todo_id = container.querySelector("#todo_id");
  const id = container.querySelector("#id");

  expect(todo_id).toBeDefined();
  expect(id).toBeDefined();

  expect(todo_id.textContent).toEqual("1234");
  expect(id.textContent).toEqual("321");
});

test("load non-existing route: /path/to/void", () => {
  router.load("/path/to/void");
  expect(container.innerHTML).toEqual("<h1>404 Not Found.</h1>");
});
