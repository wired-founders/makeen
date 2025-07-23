// src\hooks\useChatSession.ts
// src/hooks/useChatSession.ts
import { useEffect } from "react";

export function useChatSession() {
  useEffect(() => {
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID(); // or uuidv4()
      localStorage.setItem("chat_session_id", sessionId);

      // (Optional) send to backend
      fetch("/api/session-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    }
  }, []);
}
