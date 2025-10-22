"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Task } from "../lib/types";
import { saveToStorage, loadFromStorage } from "../lib/storage";

export default function PomodoroPage() {
  const router = useRouter();

  function startTimer() {
    console.log("Start Timer");
  }

  function addTime() {
    console.log("Add Time Clicked");
  }

  function resetTime() {
    console.log("Reset Time Clicked");
  }

  function restTime() {
    console.log("Rest Time Clicked");
  }

  function navToTodo() {
    router.push("/todo");
  }

  return (
    <div>
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button onClick={navToTodo}>Todo</button>
        <button onClick={() => null}>Pomodoro</button>
      </div>
    </div>
  );
}
