const mongoose = require("mongoose");
const { generateId } = require("../utils.js");

const { Schema, model } = mongoose;

const TodoItemSchema = new Schema({
  public_id: { type: Number, required: true, index: true },
  title: String,
  description: String,
  color: String,
  done: Boolean,
});

const TodoListSchema = new Schema({
  public_id: { type: String, required: true, default: generateId, index: true },
  todo_items: [TodoItemSchema],
});

const TodoList = model("TodoList", TodoListSchema);
const TodoItem = model("TodoItem", TodoItemSchema);

module.exports = { TodoList: TodoList, TodoItem: TodoItem };
