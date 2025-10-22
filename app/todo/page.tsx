"use client";

import { useRouter } from "next/navigation";

export default function TodoPage() {
  const router = useRouter();

  function addTask() {
    console.log("Add Task");
  }

  function deleteTask() {
    console.log("Delete Task");
  }

  function completeTask() {
    console.log("Complete Task");
  }

  function navToPomo() {
    router.push("/pomo");
  }

  return (
    <div>
      <div>
        <button onClick={addTask}>Add Task</button>
        <button onClick={deleteTask}>Delete Task</button>
        <button onClick={completeTask}>Complete Task</button>
      </div>
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <button onClick={() => console.log("Todo clicked")}>Todo</button>
        <button onClick={navToPomo}>Pomodoro</button>
      </div>
    </div>
  );
}
