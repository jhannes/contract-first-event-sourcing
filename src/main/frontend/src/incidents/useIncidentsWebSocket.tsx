import { useState } from "react";
import { IncidentSnapshot, MessageFromServer } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleMessage(message: MessageFromServer) {
    if ("delta" in message) {
      const {
        incidentId,
        delta: { title },
      } = message;
      setIncidents((old) => [...old, { incidentId, title }]);
    } else {
      const unhandled: never = message;
      console.error({ unhandled });
    }
  }

  const { sendMessage, isConnected } = useWebSocket({
    handleMessage,
    url: "/ws",
  });
  return { sendMessage, incidents, isConnected };
}
