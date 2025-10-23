"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Background from "../lib/components/Background";
import { FaPlay, FaPause, FaRedo, FaCog } from "react-icons/fa";
import SettingsOverlay from "../lib/components/SettingsOverlay";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function PomodoroPage() {
  const router = useRouter();
  const [workDuration, setWorkDuration] = useState(25 * 60);
  const [breakDuration, setBreakDuration] = useState(5 * 60);
  const [onBreak, setOnBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    const lastTimestamp = parseInt(
      localStorage.getItem("lastTimestamp") || Date.now().toString()
    );
    let updatedTimeLeft = storedTimeLeft;
    let updatedOnBreak = storedOnBreak;
    if (storedIsRunning) {
      const elapsed = Math.floor((Date.now() - lastTimestamp) / 1000);
      updatedTimeLeft -= elapsed;
      if (updatedTimeLeft <= 0) {
        if (storedOnBreak) {
          updatedOnBreak = false;
          updatedTimeLeft = storedWork - Math.abs(updatedTimeLeft);
        } else {
          updatedOnBreak = true;
          updatedTimeLeft = storedBreak - Math.abs(updatedTimeLeft);
        }
      }
    }
    setWorkDuration(storedWork);
    setBreakDuration(storedBreak);
    setOnBreak(updatedOnBreak);
    setTimeLeft(updatedTimeLeft > 0 ? updatedTimeLeft : updatedTimeLeft * -1);
    setIsRunning(storedIsRunning);
  }, []);

  useEffect(() => {
    localStorage.setItem("workDuration", workDuration.toString());
    localStorage.setItem("breakDuration", breakDuration.toString());
    localStorage.setItem("onBreak", JSON.stringify(onBreak));
    localStorage.setItem("timeLeft", timeLeft.toString());
    localStorage.setItem("isRunning", JSON.stringify(isRunning));
    if (isRunning) localStorage.setItem("lastTimestamp", Date.now().toString());
  }, [workDuration, breakDuration, onBreak, timeLeft, isRunning]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (onBreak) {
            setOnBreak(false);
            return workDuration;
          } else {
            setOnBreak(true);
            return breakDuration;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onBreak, workDuration, breakDuration]);

  const toggleTimer = () => setIsRunning((prev) => !prev);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(onBreak ? breakDuration : workDuration);
  };
  const switchToPomodoro = () => {
    if (onBreak) {
      setOnBreak(false);
      setTimeLeft(workDuration);
    }
  };
  const switchToBreak = () => {
    if (!onBreak) {
      setOnBreak(true);
      setTimeLeft(breakDuration);
    }
  };
  const navToTodo = () => router.push("/todo");
  const uppercaseBold = "uppercase font-bold";

  return (
    <div className="min-h-screen w-full relative">
      <Background />
      <div className="min-h-screen flex flex-col items-center justify-center text-white relative px-4">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className="p-3"
          >
            <FaCog size={20} className="text-white" />
          </button>
        </div>
        <div
          className={`w-[80%] max-w-2xl flex mb-10 gap-2 justify-center ${uppercaseBold}`}
        >
          <button
            onClick={switchToPomodoro}
            className={`w-[28%] py-3 border border-white rounded ${
              !onBreak
                ? "bg-transparent text-white"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            }`}
          >
            Pomodoro
          </button>
          <button
            onClick={switchToBreak}
            className={`w-[28%] py-3 border border-white rounded ${
              onBreak
                ? "bg-transparent text-white"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            }`}
          >
            Break
          </button>
          <div className="w-[28%] flex gap-2">
            <button
              onClick={toggleTimer}
              className="flex-1 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black flex items-center justify-center rounded"
            >
              {isRunning ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={resetTimer}
              className="flex-1 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black flex items-center justify-center rounded"
            >
              <FaRedo />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2
            className={`text-[12rem] font-bold mb-6 leading-none text-white ${uppercaseBold}`}
          >
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={navToTodo}
            className={`px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded ${uppercaseBold}`}
          >
            Todo
          </button>
          <button
            className={`px-4 py-2 border border-white bg-white text-black rounded ${uppercaseBold}`}
          >
            Pomodoro
          </button>
        </div>

        <SettingsOverlay
          show={showSettings}
          workDuration={workDuration}
          breakDuration={breakDuration}
          onBreak={onBreak}
          setWorkDuration={setWorkDuration}
          setBreakDuration={setBreakDuration}
          setTimeLeft={setTimeLeft}
        />
      </div>
    </div>
  );
}
