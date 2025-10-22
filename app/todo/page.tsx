"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Task } from "../lib/types";
import { saveToStorage, loadFromStorage } from "../lib/storage";
import { v4 as uuidv4 } from "uuid";

export default function TodoPage() {
  const router = useRouter();

  function addTask(title: string) {}

  function completeTask(id: string) {}

  function navToPomo() {
    router.push("/pomo");
  }

  return (
    <div className="p-4">
      <h1>Todo List</h1>

      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button onClick={() => console.log("Todo clicked")}>Todo</button>
        <button onClick={navToPomo}>Pomodoro</button>
      </div>
    </div>
  );
}
