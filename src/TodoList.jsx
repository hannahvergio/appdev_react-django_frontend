import { useState } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [filter, setFilter] = useState("all");

    // Add a new task
    const addTask = () => {
        if (task.trim() === "") return;
        setTasks([...tasks, { text: task, completed: false }]);
        setTask("");
    };

    // Remove a task
    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    // Toggle completion
    const toggleCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    // Start editing a task
    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingText(tasks[index].text);
    };

    // Save edited task
    const saveEdit = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].text = editingText;
        setTasks(updatedTasks);
        setEditingIndex(null);
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
