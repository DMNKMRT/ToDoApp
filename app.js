const path = require("path");

const express = require("express");
const expressStaticGzip = require("express-static-gzip");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const mongoose = require("mongoose");

const utils = require("./utils.js");
const status = require("./status_codes.js");
const httpsRedirectMiddleware = require("./https-redirect-middleware.js");
const { sseMiddleware, sseSend } = require("./sse.js");
const { TodoList, TodoItem } = require("./models/todo.js");

const log = console.log.bind();

const port = process.env.PORT || 3000;
const node_env = process.env.NODE_ENV;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/todo";
const MONGOOSE_OPTS = { useNewUrlParser: true, useUnifiedTopology: true };

const app = express();

if (node_env == "production") app.use(httpsRedirectMiddleware());
app.use(cors());
app.use(history({ htmlAcceptHeaders: ["text/html", "application/xhtml+xml"] }));
app.use(
  expressStaticGzip(path.resolve(__dirname, "dist"), {
    enableBrotli: true,
    customCompressions: [
      {
        encodingName: "deflate",
        fileExtension: "zz",
      },
    ],
    orderPreference: ["br"],
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
      if (/\.html(\.(br|gz|zz))?$/.test(path)) {
        res.setHeader("Cache-Control", "no-cache");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);
app.use(express.json());

const subscribers = {};

async function get_todo_list(req, res, next) {
  const { list_id } = req.params;

  const todo_list = await TodoList.findOne({ public_id: list_id });

  if (!todo_list) return res.status(404).send(status.list_not_found);

  req.todo_list = todo_list;

  next();
}

function sendNewTodo(list_id, todo_item) {
  for (let res of subscribers[list_id])
    sseSend(res, "new-todo", { todo_item: todo_item });
}

app.get("/api/new", (req, res) => {
  const todo_list = new TodoList();
  todo_list.save();

  res.json({ list_id: todo_list.public_id });
});

app.get("/api/subscribe/:list_id", sseMiddleware, (req, res) => {
  const { list_id } = req.params;
  if (!subscribers[list_id]) subscribers[list_id] = [];
  subscribers[list_id].push(res);
});

app
  .route("/api/:list_id")
  .get(get_todo_list, async (req, res) => {
    // Returns the todo list at :list_id
    res.json(req.todo_list);
  })
  .post(get_todo_list, async (req, res) => {
    // Create a new todo item in list :list_id, returns the new todo item
    const { list_id } = req.params;
    const { todo_item } = req.body;
    const { todo_list } = req;

    todo_item.public_id = todo_list.todo_items.length;

    todo_list.todo_items.push(todo_item);
    todo_list.save();

    sendNewTodo(list_id, todo_item);

    res.json(todo_item);
  });

app.patch("/api/:list_id/:todo_id", get_todo_list, async (req, res) => {
  const { list_id, todo_id } = req.params;
  const { todo_item } = req.body;
  const { todo_list } = req;
  const { todo_items } = todo_list;

  const new_item = Object.assign(todo_items[todo_id], todo_item);
  todo_list.save();

  sendNewTodo(list_id, new_item);

  res.json(new_item);
});

mongoose.connect(MONGODB_URI, MONGOOSE_OPTS);
log("Listening on port", port);
app.listen(port);
