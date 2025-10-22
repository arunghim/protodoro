"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Task } from "../lib/types";
import { saveToStorage, loadFromStorage } from "../lib/storage";
import { v4 as uuidv4 } from "uuid";

export default function TodoPage() {
  const router = useRouter();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>(
    () => loadFromStorage<Task[]>("tasks") || []
  );

  useEffect(() => {
    saveToStorage("tasks", tasks);
  }, [tasks]);

  function addTask(title: string) {
    if (!title.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      created: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  }

  function completeTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function navToPomo() {
    router.push("/pomo");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addTask(newTaskTitle);
  }

  return (
    <div className="p-4">
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="enter task"
      />

      <ul>
        {tasks.map(({ id, title }) => (
          <li key={id}>
            <input type="checkbox" onChange={() => completeTask(id)} />
            <span>{title}</span>
          </li>
        ))}
      </ul>
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button onClick={() => console.log("Todo clicked")}>Todo</button>
        <button onClick={navToPomo}>Pomodoro</button>
      </div>
    </div>
  );
}
