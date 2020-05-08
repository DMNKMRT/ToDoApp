const express = require('express')
const cors = require('cors')

const log = console.log.bind()

const app = express()

app.use(cors())
app.use(express.json())

let nextId = 0
const todo_items = {}

app.get('/', (req, res) => {
  res.json('Hello world')
})

app.get('/todo', (req, res) => {
  res.json(todo_items)
})

app.get('/todo/:id', (req, res) => {
  const { id } = req.params
  res.json(todo_items[id])
})

app.post('/todo', (req, res) => {
  const id = nextId++
  const todo_item = req.body.todo_item
  todo_item['id'] = id
  todo_items[id] = todo_item
  res.json(todo_item)
})

app.put('/todo/:id', (req, res) => {
  const { id } = req.params
  todo_items[id] = req.body.todo_item
  res.json(todo_items[id])
})

app.listen(5000)
