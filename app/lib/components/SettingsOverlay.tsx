"use client";

import { useEffect, useRef, useState } from "react";
import { usePomodoroStore } from "../store/usePomodoroStore";

interface SettingsOverlayProps {
  show: boolean;
  onClose: () => void;
}

export default function SettingsOverlay({
  show,
  onClose,
}: SettingsOverlayProps) {
  const {
    workDuration,
    breakDuration,
    onBreak,
    setWorkDuration,
    setBreakDuration,
    timeLeft,
    setTimeLeft,
  } = usePomodoroStore();

  const [activeTab, setActiveTab] = useState("timer");
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  if (!show) return null;

  const formatMinutes = (seconds: number) => Math.floor(seconds / 60);

  const handleWorkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Math.max(1, parseInt(e.target.value) || 1);
    const newDuration = newMinutes * 60;
    const diff = newDuration - workDuration;
    setWorkDuration(newDuration);
    if (!onBreak) setTimeLeft(timeLeft + diff);
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Math.max(1, parseInt(e.target.value) || 1);
    const newDuration = newMinutes * 60;
    const diff = newDuration - breakDuration;
    setBreakDuration(newDuration);
    if (onBreak) setTimeLeft(timeLeft + diff);
  };

  const tabs = ["timer", "sound", "theme"];

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
      <div
        ref={overlayRef}
        className="w-[400px] flex border border-white/30 rounded-2xl bg-black/70 backdrop-blur-md p-2 shadow-lg transition-all duration-200"
      >
        <div className="flex flex-col w-1/3 gap-2 p-2 bg-transparent rounded">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2 rounded-full text-sm font-bold text-white transition-colors duration-200 border border-transparent ${
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
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-white font-bold">
                  Pomodoro
                </label>
                <input
                  type="number"
                  value={formatMinutes(workDuration)}
                  onChange={handleWorkChange}
                  className="w-full text-white rounded-full px-3 py-2 bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  min={1}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1 text-white font-bold">
                  Break
                </label>
                <input
                  type="number"
                  value={formatMinutes(breakDuration)}
                  onChange={handleBreakChange}
                  className="w-full text-white rounded-full px-3 py-2 bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  min={1}
                />
              </div>
            </div>
          )}

          {activeTab === "sound" && (
            <div className="text-sm text-white opacity-80">
              Sound settings coming soon
            </div>
          )}

          {activeTab === "theme" && (
            <div className="text-sm text-white opacity-80">
              Theme settings coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
