import { useState } from "react";
import { IncidentSummary, MessageFromServer } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);

  function handleMessage(message: MessageFromServer) {
    if ("delta" in message) {
      switch (message.delta.delta) {
        case "CreateIncident": {
          const {
            incidentId,
            delta: { info },
          } = message;
          setIncidents((old) => [...old, { incidentId, info }]);
          return;
        }
        case "UpdateIncident": {
          const {
            incidentId,
            delta: { info },
          } = message;
          setIncidents((old) =>
            old.map((o) =>
              o.incidentId === incidentId
                ? { ...o, info: { ...o.info, ...info } }
                : o,
            ),
          );
          return;
        }
        default:
          const noMatch: never = message.delta;
          console.error(`Invalid command ${JSON.stringify(noMatch)}`);
      }
    } else if ("incidents" in message) {
      setIncidents(message.incidents);
    }
  }

  const { sendMessage, isConnected } = useWebSocket({
    handleMessage,
    url: "/ws",
  });
  return { sendMessage, incidents, isConnected };
}
