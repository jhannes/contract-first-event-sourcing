import { useState } from "react";
import { MessageFromServer, IncidentEvent, IncidentSummary } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);

  function handleEvent(event: IncidentEvent) {
    if (event.delta.delta === "CreateIncidentDelta") {
      const {
        incidentId,
        delta: { info },
      } = event;
      setIncidents((old) => [...old, { incidentId, info }]);
      //} else {
      //const unhandled: never = event;
      //console.error({ unhandled });
    } else if (event.delta.delta === "UpdateIncidentDelta") {
      const {
        incidentId,
        delta: { info },
      } = event;
      setIncidents((old) =>
        old.map((o) =>
          o.incidentId !== incidentId
            ? o
            : {
                ...o,
                info: { ...o.info, ...info },
              },
        ),
      );
    }
  }

  function handleMessage(message: MessageFromServer) {
    if ("delta" in message) {
      handleEvent(message);
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
