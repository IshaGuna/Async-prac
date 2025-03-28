import React, { useState, useEffect } from "react";
import "./style.css"; 

const API_URL = "https://jsonplaceholder.typicode.com/todos"; 

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [updateTaskId, setUpdateTaskId] = useState("");
  const [updateTaskTitle, setUpdateTaskTitle] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const data = await response.json();
        setTasks(data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask) return alert("Enter a task title!");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask, completed: false }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const task = await response.json();
      setTasks([...tasks, task]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async () => {
    if (!updateTaskId || !updateTaskTitle) return alert("Enter ID & new title!");

    try {
      const response = await fetch(`${API_URL}/${updateTaskId}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ id: updateTaskId, title: updateTaskTitle }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks(tasks.map((task) =>
          task.id.toString() === updateTaskId ? { ...task, title: updateTaskTitle } : task
        )
      );
      setUpdateTaskId("");
      setUpdateTaskTitle("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async () => {
    if (!deleteTaskId) return alert("Enter a Task ID to delete!");

    try {
      const response = await fetch(`${API_URL}/${deleteTaskId}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks(tasks.filter((task) => task.id.toString() !== deleteTaskId));
      setDeleteTaskId("");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <h2> Task Manager</h2>

      <div className="input-group">
        <input
          type="text"
          placeholder="New Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>Add Task</button>
      </div>

   
      <h3>Update Task</h3>
      <div className="input-group">
        <input
          type="number"
          placeholder="Task ID to Update"
          value={updateTaskId}
          onChange={(e) => setUpdateTaskId(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Title"
          value={updateTaskTitle}
          onChange={(e) => setUpdateTaskTitle(e.target.value)}
        />
        <button className="update-btn" onClick={updateTask}>Update Task</button>
      </div>

      <h3>Delete Task</h3>
      <div className="input-group">
        <input
          type="number"
          placeholder="Task ID to Delete"
          value={deleteTaskId}
          onChange={(e) => setDeleteTaskId(e.target.value)}
        />
        <button className="delete-btn" onClick={deleteTask}>Delete Task</button>
      </div>

      <h3>Tasks</h3>
      {tasks.map((task) => (
        <div key={task.id} className="task">
          <h4>{task.title}</h4>
          <p>Status: {task.completed ? "Completed" : "Pending"}</p>
          <small>ID: {task.id}</small>
        </div>
      ))}
    </div>
  );
}
