import { useState } from "react";
import { MessageFromServer } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<never[]>([]);

  function handleMessage(message: MessageFromServer) {}

  const { sendCommand, isConnected } = useWebSocket({
    handleMessage,
    url: "/ws",
  });
  return { sendCommand, incidents, isConnected };
}
