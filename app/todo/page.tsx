"use client";

import { useRouter } from "next/navigation";
import Background from "../lib/components/Background";
import { useState, useEffect } from "react";
import { Task } from "../lib/types";
import { saveToStorage, loadFromStorage } from "../lib/storage";
import { v4 as uuidv4 } from "uuid";
import { usePomodoroStore } from "../lib/store/usePomodoroStore";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

export default function TodoPage() {
  const router = useRouter();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>(
    () => loadFromStorage<Task[]>("tasks") || []
  );

  const {
    timeLeft,
    onBreak,
    isRunning,
    toggleRunning,
    switchMode,
    reset,
    loadFromStorage: loadPomodoroFromStorage,
  } = usePomodoroStore();

  useEffect(() => {
    loadPomodoroFromStorage();
  }, [loadPomodoroFromStorage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { isRunning } = usePomodoroStore.getState();
      if (isRunning) {
        usePomodoroStore.getState().tick();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask(newTaskTitle);
  };

  const navToPomo = () => router.push("/");

  const uppercaseBold = "uppercase font-bold";

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center">
      <Background />

      <div className="flex flex-col items-center absolute-center w-full max-w-xl px-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="enter task"
          className="w-full p-3 border-b-2 border-white/80 rounded-none uppercase font-bold bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:ring-0"
        />

        <div
          className="mt-6 w-full max-w-xl h-[500px] overflow-y-scroll space-y-3"
          style={{ scrollbarWidth: "none" }}
        >
          {tasks.map(({ id, title }) => (
            <div
              key={id}
              className="flex items-center gap-3 p-4 border border-white/30 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors duration-200"
            >
              <input
                type="checkbox"
                onChange={() => completeTask(id)}
                className="w-6 h-6 accent-sky-400 cursor-pointer"
              />
              <span className={`${uppercaseBold} text-white tracking-wide`}>
                {title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          className={`px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full ${uppercaseBold}`}
          onClick={navToPomo}
        >
          Pomodoro
        </button>
        <button
          className={`px-4 py-2 border border-white/80 bg-white text-black rounded-full ${uppercaseBold}`}
        >
          Todo
        </button>
      </div>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 bg-black/70 border border-white/30 text-white rounded-full px-6 py-3 flex items-center gap-4 backdrop-blur-md shadow-lg">
        <span
          className={`${uppercaseBold} cursor-pointer select-none`}
          onClick={switchMode}
        >
          {onBreak ? "Break" : "Focus"}
        </span>
        <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRunning}
            className="p-2 border border-white/40 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            {isRunning ? <FaPause size={14} /> : <FaPlay size={14} />}
          </button>
          <button
            onClick={reset}
            className="p-2 border border-white/40 rounded-full hover:bg-white hover:text-black transition-colors"
          >
            <FaRedo size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
