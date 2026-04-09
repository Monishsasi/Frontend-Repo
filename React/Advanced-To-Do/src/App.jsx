import { useState } from 'react'
import './App.css'
import ToDoList from './ToDoList'

function App() {

  const [toDo, setTodo] = useState('');
  const [toDoList, setToDoList] = useState([]);
  const [filter, setFilter] = useState('all')

  function updateList(value) {
    if (value.trim() === '') return;
    setToDoList([...toDoList, { id: Date.now(), text: value, completed: false }]);
    setTodo('')
  }

  function toggle(id) {
    setToDoList(
      toDoList.map((item) => {
        return item.id === id ? { ...item, completed: !item.completed } : item
      }
      )
    )
  }

  function deleteTask(id) {
    setToDoList(
      toDoList.filter((item) => item.id != id)
    )
  }

  function editTask(id) {
    const tasktoedit = (toDoList.find((item) => item.id === id)).text

    setTodo(tasktoedit)

    setToDoList(
      toDoList.filter((item) => {
        return item.id != id
      })
    )
  }

  const filteredList = toDoList.filter((item) => {
    if (filter == 'pending') {
      return !item.completed
    }

    if (filter == 'completed'){
      return item.completed
    }

    return true
  })

return (
  <>
    <div className="app-container">
      <div className="task-input">
        <input type="text" className="task-input" onChange={(e) => setTodo(e.target.value)} value={toDo} />
        <button className="add-btn" onClick={() => updateList(toDo)}>Add</button>

        <select className="dropdown" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

      </div>
      <div className="task-card-container">
        <ul className="task-list">
          {filteredList.map((task, index) => (
            <li key={task.id} className="list"
              onClick={() => toggle(task.id)}
              style={{
                cursor: 'pointer',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'black'
              }}
            >
              <ToDoList task={task} index={index} deleteTask={deleteTask} editTask={editTask} />
            </li>
          ))}
        </ul>
      </div>
    </div>


  </>
);
};

export default App
