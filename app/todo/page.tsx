"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Background from "../lib/components/Background";
import PomodoroOverlay from "../lib/components/PomodoroOverlay";
import { Task } from "../lib/types";
import { saveToStorage, loadFromStorage } from "../lib/storage";
import { usePomodoroStore } from "../lib/store/usePomodoroStore";

export default function TodoPage() {
  const router = useRouter();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { loadFromStorage: loadPomodoroFromStorage, theme } =
    usePomodoroStore();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");

  const uppercaseBold = "uppercase font-bold";

  useEffect(() => {
    setIsClient(true);
    setTasks(loadFromStorage<Task[]>("tasks") || []);
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: light)")
          .matches
          ? "light"
          : "dark";
        setCurrentTheme(systemTheme);
      } else {
        setCurrentTheme(theme);
      }
    };

    applyTheme();
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", applyTheme);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: light)")
        .removeEventListener("change", applyTheme);
    };
  }, [theme]);

  useEffect(() => {
    loadPomodoroFromStorage();
  }, [loadPomodoroFromStorage]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { isRunning } = usePomodoroStore.getState();
      if (isRunning) usePomodoroStore.getState().tick();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isClient) {
      saveToStorage("tasks", tasks);
    }
  }, [tasks, isClient]);

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
      setTimeout(
        () => setTasks((prev) => prev.filter((task) => task.id !== id)),
        300
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && addTask(newTaskTitle);
  const navToPomo = () => router.push("/");

  const isLight = currentTheme === "light";
  const bgColor = isLight ? "bg-white" : "bg-black";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/50" : "border-white/50";
  const placeholderColor = isLight
    ? "placeholder:text-black/40"
    : "placeholder:text-white/40";
  const buttonBg = isLight ? "bg-white/80" : "bg-black/40";
  const invertedBg = isLight ? "bg-black" : "bg-white";
  const invertedText = isLight ? "text-white" : "text-black";
  const taskBg = isLight ? "bg-white/40" : "bg-black/40";
  const taskHoverBg = isLight ? "hover:bg-white/60" : "hover:bg-black/60";
  const activeButtonBg = isLight
    ? "bg-black text-white"
    : "bg-white text-black";

  if (!isClient) {
    return (
      <div
        className={`min-h-screen w-full relative flex flex-col items-center justify-center ${bgColor} ${textColor}`}
      >
        <Background />
        <div className="flex flex-col items-center w-full max-w-xl px-4 z-20 font-mono">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ENTER NEW TASK"
            className={`w-full p-3 sm:p-4 text-lg sm:text-xl border-b-2 ${borderColor} ${uppercaseBold} bg-transparent ${textColor} ${placeholderColor} focus:outline-none focus:border-current transition-all duration-300`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full relative flex flex-col items-center ${bgColor} ${textColor}`}
    >
      <Background />

      <div
        className={`flex flex-col items-center w-full max-w-xl px-3 sm:px-4 z-20 font-mono pt-16 sm:pt-24 pb-28 sm:pb-40`}
      >
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ENTER NEW TASK"
          className={`w-full p-3 sm:p-4 text-lg sm:text-xl border-b-2 ${borderColor} ${uppercaseBold} bg-transparent ${textColor} ${placeholderColor} focus:outline-none focus:border-current transition-all duration-300 mt-8 sm:mt-12`}
        />

        <div className="mt-10 sm:mt-12 w-full max-w-xl h-[50vh] sm:h-[60vh] relative">
          <div
            className="w-full h-full overflow-y-scroll space-y-3 sm:space-y-4 pt-2 pb-2 mask-scroll-fade"
            style={{ scrollbarWidth: "none" }}
          >
            {tasks.map(({ id, title }) => (
              <div
                key={id}
                id={`task-${id}`}
                className={`task-item flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border ${borderColor} rounded-lg sm:rounded-xl ${taskBg} backdrop-blur-md shadow-md ${taskHoverBg} transition-all duration-300`}
              >
                <input
                  type="checkbox"
                  onChange={() => completeTask(id)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 border-2 ${borderColor} rounded-md bg-transparent checked:${invertedBg} checked:border-current transition-colors cursor-pointer appearance-none checked:after:content-['✔'] checked:after:${invertedText} checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs sm:checked:after:text-base`}
                />
                <span
                  className={`${uppercaseBold} ${textColor} tracking-wider text-base sm:text-lg`}
                >
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        data-nav-buttons
        className="fixed bottom-4 right-4 flex flex-col sm:flex-row gap-2 z-40 font-mono"
      >
        <button
          onClick={navToPomo}
          className={`px-6 py-3 border ${borderColor} ${buttonBg} ${textColor} hover:${invertedBg} hover:${invertedText} rounded-full ${uppercaseBold} transition-colors`}
        >
          POMODORO
        </button>
        <button
          className={`px-6 py-3 border ${borderColor} ${activeButtonBg} rounded-full ${uppercaseBold} transition-colors`}
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
