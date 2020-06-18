import request from "./request.js";

export default class TodoApi {
  constructor(api_url, list_id) {
    this.api_url = api_url || "";
    this.setListId(list_id);
  }
  setListId(list_id) {
    this.list_id = list_id;
  }
  getItems() {
    return this._request(`${this.api_url}/api/${this.list_id}`).then((res) => {
      const { todo_items } = res;
      return todo_items;
    });
  }
  newList() {
    return this._request(`${this.api_url}/api/new`).then((res) => res.list_id);
  }
  markAsDone(id) {
    return this._request(`${this.api_url}/api/${this.list_id}/${id}`, "patch", {
      todo_item: { done: true },
    });
  }
  addItem(item) {
    const data = { todo_item: item };
    return this._request(`${this.api_url}/api/${this.list_id}`, "post", data);
  }
  subscribe(callback) {
    const evtSource = new EventSource(
      `${this.api_url}/api/subscribe/${this.list_id}`
    );
    evtSource.addEventListener("new-todo", (e) => {
      const { todo_item } = JSON.parse(e.data);
      callback(todo_item);
    });
  }
  _request(...args) {
    return request(...args).then((res) => {
      if ("error" in res) throw Error(res.error);
      return res;
    });
  }
}
