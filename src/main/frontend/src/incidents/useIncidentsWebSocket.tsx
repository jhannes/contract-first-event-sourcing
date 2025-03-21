import { useState } from "react";
import {
  IncidentEvent,
  IncidentSummary,
  IncidentSnapshot,
  MessageFromServer,
} from "./model";
import { useWebSocket } from "../lib/useWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<
    (IncidentSummary | IncidentSnapshot)[]
  >([]);

  function handleEvent({
    delta,
    eventTime: updatedAt,
    incidentId,
  }: IncidentEvent) {
    if (delta.delta === "CreateIncidentDelta") {
      const incident = {
        incidentId,
        createdAt: updatedAt,
        updatedAt,
        info: delta.info,
        persons: {},
      };
      setIncidents((old) => [...old, incident]);
    } else if (delta.delta === "UpdateIncidentDelta") {
      setIncidents((old) =>
        old.map((o) =>
          o.incidentId !== incidentId
            ? o
            : { ...o, updatedAt, info: { ...o.info, ...delta.info } },
        ),
      );
    } else if (delta.delta === "AddPersonToIncidentDelta") {
      const { personId, info } = delta;
      setIncidents((old) =>
        old.map((o) =>
          o.incidentId !== incidentId
            ? o
            : {
                ...o,
                updatedAt,
                persons: {
                  ...("persons" in o ? o.persons : {}),
                  [personId]: info,
                },
              },
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
    } else if ("incidentId" in message) {
      const { incidentId } = message;
      setIncidents((old) =>
        old.map((o) => (o.incidentId === incidentId ? message : o)),
      );
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
