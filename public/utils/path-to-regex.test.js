import pathToRegex from "./path-to-regex.js";

test('pathToRegex("/todo/:id")', () => {
  const route = "/todo/:id";
  const test_regex = /^\/todo\/([^/]+)\/?$/;
  const { pattern } = pathToRegex(route);
  expect(String(new RegExp(pattern))).toEqual(String(test_regex));
});

test('pathToRegex("/")', () => {
  const route = "/";
  const test_regex = /^\/?$/;
  const { pattern } = pathToRegex(route);
  expect(String(new RegExp(pattern))).toEqual(String(test_regex));
});

test("match /todo/:id -> /todo/1234", () => {
  const { pattern } = pathToRegex("/todo/:id");
  const path = "/todo/1234";
  expect(path.match(pattern)).toBeTruthy();
});

test("don't match: /todo/:id -> /api/1234", () => {
  const { pattern } = pathToRegex("/todo/:id");
  const wrongPath = "/api/1234";
  expect(wrongPath.match(pattern)).toBeFalsy();
});

test("don't match: / -> /todo/1234", () => {
  const { pattern } = pathToRegex("/todo/:id");
  const wrongPath = "/";
  expect(wrongPath.match(pattern)).toBeFalsy();
});

test("don't match: /todo/:id -> /", () => {
  const { pattern } = pathToRegex("/");
  const wrongPath = "/todo/1234";
  expect(wrongPath.match(pattern)).toBeFalsy();
});

test("get parameter names and order: /todo/:id/:todo_id", () => {
  const { params } = pathToRegex("/todo/:id/:todo_id");
  expect(params).toEqual(["id", "todo_id"]);
});
