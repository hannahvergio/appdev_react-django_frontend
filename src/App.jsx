import { useState, useEffect } from "react";
import TodoList from "./TodoList"; 
import "./App.css";

export default function App() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        document.body.className = darkMode ? "dark" : "";
    }, [darkMode]);

    return (
        <div className="app-container">
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? "☼" : "☾"}
            </button>

            <h1>React TODO App</h1>
            <TodoList />
        </div>
    );
}
