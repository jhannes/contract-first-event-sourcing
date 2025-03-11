import { useState } from "react";
import { IncidentEvent, IncidentSnapshot, MessageFromServer } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<IncidentSnapshot[]>([]);

  function handleEvent({ delta, incidentId }: IncidentEvent) {
    if (delta.delta === "CreateIncidentDelta") {
      const { info } = delta;
      setIncidents((old) => [...old, { incidentId, info }]);
    } else if (delta.delta === "UpdateIncidentDelta") {
      setIncidents((old) =>
        old.map((o) =>
          o.incidentId !== incidentId
            ? o
            : { ...o, info: { ...o.info, ...delta.info } },
        ),
      );
    } else {
      const unhandled: never = delta;
      console.error({ unhandled });
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
