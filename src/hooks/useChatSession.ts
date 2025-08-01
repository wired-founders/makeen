// src\hooks\useChatSession.ts
import { useEffect } from "react";

export function useChatSession() {
  useEffect(() => {
    let userId = localStorage.getItem("chat_user_id");

    if (!userId) {
      userId = crypto.randomUUID(); // or uuidv4()
      localStorage.setItem("chat_user_id", userId);

      // (Optional) notify backend about new user
      fetch("/api/session-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    }
  }, []);
}
