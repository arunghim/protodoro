"use client";
import { Dispatch, SetStateAction, useState } from "react";

interface SettingsOverlayProps {
  show: boolean;
  workDuration: number;
  breakDuration: number;
  onBreak: boolean;
  setWorkDuration: Dispatch<SetStateAction<number>>;
  setBreakDuration: Dispatch<SetStateAction<number>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
}

export default function SettingsOverlay({
  show,
  workDuration,
  breakDuration,
  onBreak,
  setWorkDuration,
  setBreakDuration,
  setTimeLeft,
}: SettingsOverlayProps) {
  const [activeTab, setActiveTab] = useState("timer");
  if (!show) return null;

  const formatMinutes = (seconds: number) => Math.floor(seconds / 60);

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, parseInt(e.target.value) || 1) * 60;
    setWorkDuration(val);
    localStorage.setItem("workDuration", val.toString());
    if (!onBreak) {
      setTimeLeft(val);
      localStorage.setItem("timeLeft", val.toString());
    }
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, parseInt(e.target.value) || 1) * 60;
    setBreakDuration(val);
    localStorage.setItem("breakDuration", val.toString());
    if (onBreak) {
      setTimeLeft(val);
      localStorage.setItem("timeLeft", val.toString());
    }
  };

  const tabs = ["timer", "sound", "theme"];

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[400px] flex z-50 border border-white rounded bg-transparent p-1">
      <div className="flex flex-col w-1/3 gap-2 p-2 bg-transparent rounded">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-2 rounded text-sm font-bold text-white transition-colors duration-200 border border-transparent ${
              activeTab === tab
                ? "border-b-2 border-white"
                : "hover:border-b-2 hover:border-white hover:border-opacity-50"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex-1 p-4 bg-transparent rounded flex flex-col gap-4">
        {activeTab === "timer" && (
          <>
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-white font-bold">
                Pomodoro
              </label>
              <input
                type="number"
                value={formatMinutes(workDuration) || 25}
                onChange={handleWorkChange}
                className="w-full text-white rounded px-3 py-2 bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                min={1}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1 text-white font-bold">Break</label>
              <input
                type="number"
                value={formatMinutes(breakDuration) || 5}
                onChange={handleBreakChange}
                className="w-full text-white rounded px-3 py-2 bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                min={1}
              />
            </div>
          </>
        )}
        {activeTab === "sound" && (
          <div className="text-sm text-white opacity-80">Sound settings</div>
        )}
        {activeTab === "theme" && (
          <div className="text-sm text-white opacity-80">Theme settings</div>
        )}
      </div>
    </div>
  );
}
