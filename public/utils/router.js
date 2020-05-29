import pathToRegex from "./path-to-regex.js";

function defaultErrorPage() {
  const element = document.createElement("h1");
  element.innerHTML = "404 Not Found.";
  return element;
}

export default class Router {
  constructor(container) {
    this.routes = {};
    this.container = container;
    this.errorPage = defaultErrorPage;

    window.onpopstate = () => this.load(location.pathname);

    document.body.addEventListener("click", (e) => {
      const a = e.target;

      if (a.href && a.origin == location.origin) {
        e.preventDefault();
        this.goto(a.pathname);
      }
    });
  }
  add(route, render) {
    const { pattern, params } = pathToRegex(route);
    this.routes[route] = {
      pattern: pattern,
      params: params,
      render: render,
    };
  }
  goto(path) {
    history.pushState({}, "", path);
    this.load(path);
  }
  load(path) {
    const route = this._getRoute(path);
    if (!route) {
      this.error();
      return;
    }

    const { routeObj, args } = route;
    this._setElement(routeObj.render(args));
  }
  error() {
    this._setElement(this.errorPage());
  }
  setError(element) {
    this.errorPage = element;
  }
  _setElement(element) {
    this.container.innerHTML = "";
    this.container.appendChild(element);
  }
  _getArgs(routeObj, match) {
    const values = [...match].slice(1);
    const args = {};
    routeObj.params.map((k, i) => {
      args[k] = values[i];
    });
    return args;
  }
  _getRoute(path) {
    for (let route in this.routes) {
      const routeObj = this.routes[route];
      const regex = new RegExp(routeObj.pattern);
      const match = path.match(regex);

      if (match) {
        const args = this._getArgs(routeObj, match);
        return { routeObj: routeObj, args: args };
      }
    }
    return null;
  }
}
