"use client";

import { useRouter } from "next/navigation";
import Background from "../lib/components/Background";
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

  const addTask = (title: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      created: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  const completeTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const navToPomo = () => router.push("/pomo");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask(newTaskTitle);
  };

  const uppercaseBold = "uppercase font-bold";

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center">
      <Background />

      <div className="flex flex-col items-center absolute-center w-full max-w-xl">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="enter task"
          className="w-full p-3 border-b-2 border-white rounded-none uppercase font-bold bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
        />

        <div
          className="mt-6 w-full max-w-xl h-[500px] overflow-y-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <ul className="flex flex-col gap-3">
            {tasks.map(({ id, title }) => (
              <li
                key={id}
                className="flex items-center gap-3 p-4 border-2 border-white rounded bg-transparent"
              >
                <input
                  type="checkbox"
                  onChange={() => completeTask(id)}
                  className="w-6 h-6 accent-pink-500"
                />
                <span className={`${uppercaseBold} text-white`}>{title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          className={`px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded ${uppercaseBold}`}
          onClick={() => console.log("Todo clicked")}
        >
          Todo
        </button>
        <button
          className={`px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded ${uppercaseBold}`}
          onClick={navToPomo}
        >
          Pomodoro
        </button>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
