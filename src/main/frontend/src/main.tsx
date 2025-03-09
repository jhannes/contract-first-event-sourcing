import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

function Application() {
  useEffect(() => {
    const ws = new WebSocket("/ws");
    ws.onmessage = (message) => {
      console.log("Received message", message);
    };
  }, []);
  return <h1>My Nice App</h1>;
}

createRoot(document.getElementById("app")!).render(<Application />);
