import { useState } from "react";
import {
  IncidentEvent,
  IncidentSnapshot,
  IncidentSummary,
  MessageFromServer,
} from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<
    (IncidentSummary | IncidentSnapshot)[]
  >([]);

  function handleEvent(message: IncidentEvent) {
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
  }

  function handleMessage(message: MessageFromServer) {
    if ("delta" in message) {
      handleEvent(message);
    } else if ("incidents" in message) {
      setIncidents(message.incidents);
    } else if ("incidentId" in message) {
      setIncidents((old) =>
        old.map((o) => (o.incidentId === message.incidentId ? message : o)),
      );
    } else {
      const noMatch: never = message;
      console.error(`Invalid message ${JSON.stringify(noMatch)}`);
    }
  }

  const { sendMessage, isConnected } = useWebSocket({
    handleMessage,
    url: "/ws",
  });
  return { sendMessage, incidents, isConnected };
}
