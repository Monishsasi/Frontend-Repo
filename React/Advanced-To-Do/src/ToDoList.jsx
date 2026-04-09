
function ToDoList({ task, index, deleteTask, editTask }) {

    return (
        <>
            <div className="show-task-container">
                <span>{task.text}</span>
                <button className="del-btn" onClick={(e)=>{e.stopPropagation();deleteTask(task.id)}}>Delete</button>
                <button className="edit-btn" onClick={(e)=>{e.stopPropagation();editTask(task.id)}}>Edit</button>
            </div>
        </>

    )
}

export default ToDoList