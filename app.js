const express = require("express");
const cors = require("cors");
const utils = require("./utils.js");
const status = require("./status_codes.js");

const log = console.log.bind();

const app = express();

app.use(cors());
app.use(express.json());

const todo_lists = {};

function validate_list_id(req, res, next) {
  const { list_id } = req.params;
  if (!(list_id in todo_lists))
    return res.status(404).send(status.list_not_found);
  next();
}

function validate_todo_id(req, res, next) {
  const { list_id, todo_id } = req.params;
  if (!(todo_id in todo_lists[list_id].todo_items))
    return res.status(404).send(status.item_not_found);
  next();
}

app.get("/new", (req, res) => {
  const list_id = utils.generateId();
  todo_lists[list_id] = { todo_items: {}, next_id: 0 };
  res.json(list_id);
});

app
  .route("/t/:list_id")
  .get(validate_list_id, (req, res) => {
    // Returns the todo list at :list_id
    const { list_id } = req.params;

    res.json(todo_lists[list_id]);
  })
  .post(validate_list_id, (req, res) => {
    // Create a new todo item in list :list_id, returns the new todo item
    const { list_id } = req.params;
    const { todo_item } = req.body;

    const item_id = todo_lists[list_id]["next_id"]++;
    todo_item["id"] = item_id;
    todo_lists[list_id].todo_items[item_id] = todo_item;
    res.json(todo_item);
  });

app.patch(
  "/t/:list_id/:todo_id",
  validate_list_id,
  validate_todo_id,
  (req, res) => {
    const { list_id, todo_id } = req.params;
    const item = todo_lists[list_id].todo_items[todo_id];
    Object.assign(item, req.body.todo_item);
    res.json(item);
  }
);

app.listen(5000);
