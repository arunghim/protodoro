"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  function todoButtonClicked() {
    router.push("/todo");
  }

  function pomoButtonClicked() {
    router.push("/pomo");
  }

  return (
    <div>
      <div>
        <h1>Welcome to protodoro</h1>
      </div>
      <div>
        <div>
          <button onClick={todoButtonClicked}>Todo</button>
        </div>
        <div>
          <button onClick={pomoButtonClicked}>Pomodoro</button>
        </div>
      </div>
    </div>
  );
}
