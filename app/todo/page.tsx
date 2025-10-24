"use client";

import { useRouter } from "next/navigation";
import Background from "../lib/components/Background";
import PomodoroOverlay from "../lib/components/PomodoroOverlay";
import { useState, useEffect } from "react";
import { Task } from "../lib/types";
import { saveToStorage, loadFromStorage } from "../lib/storage";
import { v4 as uuidv4 } from "uuid";
import { usePomodoroStore } from "../lib/store/usePomodoroStore";

export default function TodoPage() {
  const router = useRouter();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>(
    () => loadFromStorage<Task[]>("tasks") || []
  );

  const { loadFromStorage: loadPomodoroFromStorage } = usePomodoroStore();

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
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const completeTask = (id: string) => {
    const taskElement = document.getElementById(`task-${id}`);
    if (taskElement) {
      taskElement.classList.add("fade-out-exit");
      setTimeout(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask(newTaskTitle);
  };

  const navToPomo = () => router.push("/");
  const uppercaseBold = "uppercase font-bold";

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center">
      <Background />

      <div className="flex flex-col items-center absolute-center w-full max-w-xl px-4 z-20 font-mono">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ENTER NEW TASK"
          className="w-full p-4 text-xl border-b-2 border-white/50 uppercase font-extrabold bg-transparent text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-all duration-300"
        />

        <div className="mt-8 w-full max-w-xl h-[500px] relative">
          <div
            className="w-full h-full overflow-y-scroll space-y-4 pt-2 pb-2 mask-scroll-fade"
            style={{ scrollbarWidth: "none" }}
          >
            {tasks.map(({ id, title }) => (
              <div
                key={id}
                id={`task-${id}`}
                className="task-item flex items-center gap-4 p-4 border border-white/20 rounded-xl bg-black/40 backdrop-blur-md shadow-md hover:bg-black/60 transition-all duration-300"
              >
                <input
                  type="checkbox"
                  onChange={() => completeTask(id)}
                  className="w-6 h-6 border-2 border-white/50 rounded-md bg-transparent checked:bg-white checked:border-white transition-colors cursor-pointer appearance-none checked:after:content-['✔'] checked:after:text-black checked:after:flex checked:after:items-center checked:after:justify-center"
                />
                <span
                  className={`${uppercaseBold} text-white tracking-wider text-lg`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col sm:flex-row gap-2 z-30 font-mono">
        <button
          className={`px-6 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full ${uppercaseBold} transition-colors`}
          onClick={navToPomo}
        >
          POMODORO
        </button>

        <button
          className={`px-6 py-3 border border-white/80 bg-white text-black rounded-full ${uppercaseBold} transition-colors shadow-xl`}
        >
          TODO
        </button>
      </div>

      <PomodoroOverlay />

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }

        .task-item {
          transition: all 0.3s ease-in-out, margin 0.3s ease-in-out;
        }
        .fade-out-exit {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
          height: 0;
          padding-top: 0;
          padding-bottom: 0;
          margin-top: 0 !important;
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
}
