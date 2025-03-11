import { useState } from "react";
import { IncidentSnapshot, IncidentSummary, MessageFromServer } from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<
    (IncidentSummary | IncidentSnapshot)[]
  >([]);

  function handleMessage(message: MessageFromServer) {
    if ("delta" in message) {
      switch (message.delta.delta) {
        case "CreateIncident": {
          const {
            incidentId,
            eventTime,
            delta: { info },
          } = message;
          const newIncident: IncidentSummary = {
            incidentId,
            createdAt: eventTime,
            updatedAt: eventTime,
            info,
          };
          setIncidents((old) => [...old, newIncident]);
          return;
        }
        case "UpdateIncident": {
          const {
            incidentId,
            eventTime: updatedAt,
            delta: { info },
          } = message;
          setIncidents((old) =>
            old.map((o) =>
              o.incidentId === incidentId
                ? { ...o, updatedAt, info: { ...o.info, ...info } }
                : o,
            ),
          );
          return;
        }
        case "AddPersonToIncident": {
          const {
            incidentId,
            eventTime: updatedAt,
            delta: { personId, info },
          } = message;
          setIncidents((old) =>
            old.map((o) =>
              o.incidentId === incidentId
                ? {
                    ...o,
                    updatedAt,
                    info: { ...o.info, ...info },
                    persons:
                      "persons" in o
                        ? { ...o.persons, [personId]: info }
                        : { [personId]: info },
                  }
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
