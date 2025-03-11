import { useState } from "react";
import { IncidentSnapshot, MessageFromServer } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleMessage(message: MessageFromServer) {
    if ("delta" in message) {
      const {
        incidentId,
        delta: { info },
      } = message;
      setIncidents((old) => [...old, { incidentId, info }]);
    } else if ("incidents" in message) {
      setIncidents(message.incidents);
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
