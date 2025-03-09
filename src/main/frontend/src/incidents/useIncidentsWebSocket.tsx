import { useState } from "react";
import {
  MessageToServer,
  IncidentSummary,
  MessageFromServer,
  IncidentSnapshot,
} from "./model";
import { useApplicationWebSocket } from "./useApplicationWebSocket";

export function useIncidentsWebSocket() {
  const [incidents, setIncidents] = useState<
    (IncidentSummary | IncidentSnapshot)[]
  >([]);

  function updateIncident(
    incidentId: string,
    updatedAt: Date,
    fn: (o: IncidentSummary | IncidentSnapshot) => Partial<IncidentSnapshot>,
  ): void {
    setIncidents((old) =>
      old.map((o) =>
        o.incidentId === incidentId ? { ...o, ...fn(o), updatedAt } : o,
      ),
    );
  }

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
          updateIncident(incidentId, updatedAt, (o) => ({
            info: { ...o.info, info },
          }));
          return;
        }
        case "AddInvolvedPersonToIncident": {
          const { personId, info } = delta;
          updateIncident(incidentId, updatedAt, (o) => ({
            persons: {
              ...("persons" in o ? o.persons : {}),
              [personId]: info,
            },
          }));
        }
        default: {
          const error: string = delta.delta;
          console.error("Unknown delta ", error);
        }
      }
    } else if ("incidentId" in message) {
      const incidentSnapshot = message as IncidentSnapshot;
      setIncidents((old) =>
        old.map((o) =>
          o.incidentId === incidentSnapshot.incidentId ? incidentSnapshot : o,
        ),
      );
    }
  }

  const { sendCommand } = useApplicationWebSocket<
    MessageFromServer,
    MessageToServer
  >({ handleMessage });
  return { sendCommand, incidents };
}
