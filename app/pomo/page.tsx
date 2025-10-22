"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    localStorage.setItem("workDuration", workDuration.toString());
  }, [workDuration]);

  useEffect(() => {
    localStorage.setItem("breakDuration", breakDuration.toString());
  }, [breakDuration]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
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
    setOnBreak(false);
    setTimeLeft(workDuration);
  };
  const startBreak = () => {
    setIsRunning(false);
    setOnBreak(true);
    setTimeLeft(breakDuration);
  };
  const navToTodo = () => {
    router.push("/todo");
  };

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value) || 0;
    const newSec = newMin * 60;

    const diff = newSec - workDuration;
    setWorkDuration(newSec);

    if (!onBreak) {
      setTimeLeft((prev) => Math.max(prev + diff, 0));
    }
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value) || 0;
    const newSec = newMin * 60;

    const diff = newSec - breakDuration;
    setBreakDuration(newSec);

    if (onBreak) {
      setTimeLeft((prev) => Math.max(prev + diff, 0));
    }
  };

  return (
    <div>
      <h1>{onBreak ? "Break Time" : "Work Time"}</h1>
      <h2>{formatTime(timeLeft)}</h2>

      <button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</button>
      <button onClick={resetTimer}>Reset</button>
      <button onClick={startBreak}>Start Break</button>

      <div>
        <label>Focus : </label>
        <input
          type="number"
          value={Math.floor(workDuration / 60)}
          onChange={handleWorkChange}
        />
      </div>

      <div>
        <label>Break : </label>
        <input
          type="number"
          value={Math.floor(breakDuration / 60)}
          onChange={handleBreakChange}
        />
      </div>

      <div style={{ position: "fixed", bottom: "1rem", right: "1rem" }}>
        <button onClick={navToTodo}>Todo</button>
        <button onClick={() => null}>Pomodoro</button>
      </div>
    </div>
  );
}
