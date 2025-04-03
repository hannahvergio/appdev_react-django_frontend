import { useState, useEffect } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [filter, setFilter] = useState("all");

    // Fetch tasks from Django API when the component loads
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/tasks/")
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    // Add new task
    const addTask = () => {
        if (task.trim() === "") return;

        fetch("http://127.0.0.1:8000/api/tasks/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: task, completed: false })
        })
        .then(response => response.json())
        .then(newTask => setTasks([...tasks, newTask]))
        .catch(error => console.error("Error adding task:", error));

        setTask("");
    };

    // Remove task
    const removeTask = (index) => {
        const taskToDelete = tasks[index];

        fetch(`http://127.0.0.1:8000/api/tasks/${taskToDelete.id}/`, {
            method: "DELETE"
        })
        .then(() => setTasks(tasks.filter((_, i) => i !== index)))
        .catch(error => console.error("Error deleting task:", error));
    };

    // Toggle completion
    const toggleCompletion = (index) => {
        const updatedTask = { ...tasks[index], completed: !tasks[index].completed };

        fetch(`http://127.0.0.1:8000/api/tasks/${updatedTask.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        })
        .then(response => response.json())
        .then(updated => {
            const updatedTasks = [...tasks];
            updatedTasks[index] = updated;
            setTasks(updatedTasks);
        })
        .catch(error => console.error("Error updating task:", error));
    };

    // Start editing
    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingText(tasks[index].text);
    };

    // Save edited task
    const saveEdit = (index) => {
        const updatedTask = { ...tasks[index], text: editingText };

        fetch(`http://127.0.0.1:8000/api/tasks/${updatedTask.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask)
        })
        .then(response => response.json())
        .then(updated => {
            const updatedTasks = [...tasks];
            updatedTasks[index] = updated;
            setTasks(updatedTasks);
            setEditingIndex(null);
        })
        .catch(error => console.error("Error editing task:", error));
    };

    // Filter tasks
    const filteredTasks = tasks.filter((t) => {
        if (filter === "completed") return t.completed;
        if (filter === "pending") return !t.completed;
        return true;
    });

    return (
        <div className="todo-container">
            {/* Input & Add Task */}
            <div>
                <input
                    type="text"
                    placeholder="Add a new task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button onClick={addTask}>Add Task</button>
            </div>

            {/* Filter Buttons */}
            <div>
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("completed")}>Completed</button>
                <button onClick={() => setFilter("pending")}>Pending</button>
            </div>

            {/* Task List */}
            <ul>
                {filteredTasks.map((t, index) => (
                    <li key={index} style={{ textDecoration: t.completed ? "line-through" : "none" }}>
                        <input type="checkbox" checked={t.completed} onChange={() => toggleCompletion(index)} />
                        {editingIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <button onClick={() => saveEdit(index)}>Save</button>
                            </>
                        ) : (
                            <>
                                {t.text}
                                <button onClick={() => startEditing(index)}>Edit</button>
                                <button onClick={() => removeTask(index)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
