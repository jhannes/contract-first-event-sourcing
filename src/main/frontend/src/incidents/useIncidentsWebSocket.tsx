import { useState } from "react";
import { IncidentCommand, IncidentSummary, MessageFromServer } from "./model";
import { useApplicationWebSocket } from "./useApplicationWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);

  function handleMessage(message: MessageFromServer) {
    if ("incidents" in message) {
      setIncidents(message.incidents);
    } else if ("delta" in message) {
      const { incidentId, eventTime: updatedAt, delta } = message;
      switch (delta.delta) {
        case "CreateIncidentDelta": {
          const { info } = delta;
          setIncidents((old) => [
            ...old,
            { info, createdAt: updatedAt, updatedAt, incidentId },
          ]);
          return;
        }
        case "UpdateIncidentDelta": {
          const { info } = delta;
          setIncidents((old) =>
            old.map((o) =>
              o.incidentId === incidentId
                ? { ...o, updatedAt, info: { ...o.info, ...info } }
                : o,
            ),
          );
        }
        default: {
          const error: string = delta.delta;
          console.error("Unknown delta ", error);
        }
      }
    }
  }

  const { sendCommand } = useApplicationWebSocket<
    MessageFromServer,
    IncidentCommand
  >({ handleMessage });
  return { sendCommand, incidents };
}
