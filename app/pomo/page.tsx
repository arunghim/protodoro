"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const getStoredValue = (key: string, fallback: number) => {
  if (typeof window === "undefined") return fallback;
  const val = localStorage.getItem(key);
  return val ? parseInt(val) : fallback;
};

export default function PomodoroPage() {
  const router = useRouter();

  const [workDuration, setWorkDuration] = useState(() =>
    getStoredValue("workDuration", 25 * 60)
  );
  const [breakDuration, setBreakDuration] = useState(() =>
    getStoredValue("breakDuration", 10 * 60)
  );
  const [onBreak, setOnBreak] = useState(() =>
    JSON.parse(localStorage.getItem("onBreak") || "false")
  );
  const [timeLeft, setTimeLeft] = useState(() =>
    getStoredValue("timeLeft", 25 * 60)
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("workDuration", workDuration.toString());
    localStorage.setItem("breakDuration", breakDuration.toString());
    localStorage.setItem("onBreak", JSON.stringify(onBreak));
    localStorage.setItem("timeLeft", timeLeft.toString());
  }, [workDuration, breakDuration, onBreak, timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      if (onBreak) {
        setTimeLeft(workDuration);
        setOnBreak(false);
      } else {
        setTimeLeft(breakDuration);
        setOnBreak(true);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onBreak, workDuration, breakDuration]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(onBreak ? breakDuration : workDuration);
  };

  const switchToPomodoro = () => {
    setOnBreak(false);
    setIsRunning(false);
    setTimeLeft(workDuration);
  };

  const switchToBreak = () => {
    setOnBreak(true);
    setIsRunning(false);
    setTimeLeft(breakDuration);
  };

  const navToTodo = () => router.push("/todo");

  const increaseTime = () => {
    if (onBreak) {
      setBreakDuration((prev) => prev + 60);
      setTimeLeft((prev) => (onBreak ? prev + 60 : prev));
    } else {
      setWorkDuration((prev) => prev + 60);
      setTimeLeft((prev) => (!onBreak ? prev + 60 : prev));
    }
  };

  const decreaseTime = () => {
    if (onBreak) {
      setBreakDuration((prev) => Math.max(prev - 60, 60));
      setTimeLeft((prev) => (onBreak ? Math.max(prev - 60, 60) : prev));
    } else {
      setWorkDuration((prev) => Math.max(prev - 60, 60));
      setTimeLeft((prev) => (!onBreak ? Math.max(prev - 60, 60) : prev));
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black relative px-4">
      <div className="w-[80%] max-w-2xl flex mb-10 gap-2 justify-center">
        <button
          onClick={switchToPomodoro}
          className={`w-[28%] py-3 border border-black rounded ${
            !onBreak
              ? "bg-transparent text-black"
              : "bg-transparent text-black hover:bg-black hover:text-white"
          }`}
        >
          Pomodoro
        </button>

        <button
          onClick={switchToBreak}
          className={`w-[28%] py-3 border border-black rounded ${
            onBreak
              ? "bg-transparent text-black"
              : "bg-transparent text-black hover:bg-black hover:text-white"
          }`}
        >
          Break
        </button>

        <div className="w-[28%] flex gap-2">
          <button
            onClick={toggleTimer}
            className="flex-1 py-3 border border-black bg-transparent text-black hover:bg-black hover:text-white flex items-center justify-center rounded"
          >
            {isRunning ? <FaPause /> : <FaPlay />}
          </button>

          <button
            onClick={resetTimer}
            className="flex-1 py-3 border border-black bg-transparent text-black hover:bg-black hover:text-white flex items-center justify-center rounded"
          >
            <FaRedo />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h2 className="text-[12rem] font-bold mb-6 leading-none">
          {formatTime(timeLeft)}
        </h2>

        <div className="flex justify-end w-full max-w-md gap-3">
          <button
            onClick={increaseTime}
            className="border border-black bg-transparent text-black hover:bg-black hover:text-white p-3 rounded"
          >
            <FaArrowUp />
          </button>
          <button
            onClick={decreaseTime}
            className="border border-black bg-transparent text-black hover:bg-black hover:text-white p-3 rounded"
          >
            <FaArrowDown />
          </button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 flex gap-2">
        <button
          onClick={navToTodo}
          className="px-4 py-2 border border-black bg-transparent text-black hover:bg-black hover:text-white w-28 rounded"
        >
          Todo
        </button>
        <button className="px-4 py-2 border border-black bg-transparent text-black hover:bg-black hover:text-white w-28 rounded">
          Pomodoro
        </button>
      </div>
    </div>
  );
}
