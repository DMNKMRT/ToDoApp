import request from "./request.js";

let api_url = `${location.protocol}//${location.host}`;

export default class TodoApi {
  constructor(list_id) {
    this.setListId(list_id);
  }
  setListId(list_id) {
    this.list_id = list_id;
  }
  getItems() {
    return this._request(`${api_url}/api/${this.list_id}`).then((res) => {
      const { todo_items } = res;
      return todo_items;
    });
  }
  newList() {
    return this._request(`${api_url}/api/new`).then((res) => res.list_id);
  }
  markAsDone(id) {
    return this._request(`${api_url}/api/${this.list_id}/${id}`, "patch", {
      todo_item: { done: true },
    });
  }
  addItem(item) {
    const data = { todo_item: item };
    return this._request(`${api_url}/api/${this.list_id}`, "post", data);
  }
  _request(...args) {
    return request(...args).then((res) => {
      if ("error" in res) throw Error(res.error);
      return res;
    });
  }
}
