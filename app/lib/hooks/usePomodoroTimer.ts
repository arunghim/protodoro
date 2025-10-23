"use client";
import { useState, useEffect } from "react";

export function usePomodoroTimer() {
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [onBreak, setOnBreak] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const storedWork = parseInt(localStorage.getItem("workDuration") || "1500");
    const storedBreak = parseInt(
      localStorage.getItem("breakDuration") || "300"
    );
    const storedOnBreak = JSON.parse(
      localStorage.getItem("onBreak") || "false"
    );
    const storedTimeLeft = parseInt(
      localStorage.getItem("timeLeft") || storedWork.toString()
    );
    const storedIsRunning = JSON.parse(
      localStorage.getItem("isRunning") || "false"
    );
    setWorkDuration(storedWork);
    setBreakDuration(storedBreak);
    setOnBreak(storedOnBreak);
    setTimeLeft(storedTimeLeft);
    setIsRunning(storedIsRunning);
  }, []);

  useEffect(() => {
    localStorage.setItem("workDuration", workDuration.toString());
    localStorage.setItem("breakDuration", breakDuration.toString());
    localStorage.setItem("timeLeft", timeLeft.toString());
    localStorage.setItem("onBreak", JSON.stringify(onBreak));
    localStorage.setItem("isRunning", JSON.stringify(isRunning));
  }, [workDuration, breakDuration, timeLeft, onBreak, isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const nextBreak = !onBreak;
          setOnBreak(nextBreak);
          return nextBreak ? breakDuration : workDuration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onBreak, workDuration, breakDuration]);

  const reset = () => setTimeLeft(onBreak ? breakDuration : workDuration);

  return {
    workDuration,
    breakDuration,
    timeLeft,
    onBreak,
    isRunning,
    setWorkDuration,
    setBreakDuration,
    setTimeLeft,
    setOnBreak,
    setIsRunning,
    reset,
  };
}
