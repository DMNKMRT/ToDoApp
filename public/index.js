/* global module */

import "typeface-roboto";

import TodoApi from "./utils/todo_api.js";
import Router from "./utils/router.js";

import StartPage from "./pages/start.js";
import TodoPage from "./pages/todo.js";
import ErrorPage from "./pages/error.js";

if (typeof module != "undefined" && module.hot) module.hot.accept();

const root = document.querySelector("#root");

window.todo_api = new TodoApi(API_URL, null);
window.todo_api.ping();

const router = (window.router = new Router(root));

router.add("/", StartPage);
router.add("/todo/:id", TodoPage);

router.setError(ErrorPage);

router.load(location.pathname);
