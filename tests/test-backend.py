import requests

url = 'http://localhost:5000'

s = requests.Session()

r = s.get(f'{url}/new')
id=r.json()
print(f'Created new todo list: {id}')

body = {
  'todo_item': {
    'title': 'Foo',
    'description': 'bar',
    'color': 'yellow',
    'done': False
  }
}
r = s.post(f'{url}/t/{id}', json=body)
print(f'Created new todo item: {r.json()}')

body = {
  'todo_item': {
    'done': True
  }
}
r = s.patch(f'{url}/t/{id}/0', json=body)
print(f'Updated todo item 0: {r.json()}')

r = s.patch(f'{url}/t/{id}/1', json=body)
print(f'Failed to update todo item 1 (expected): {r.json()}')
