import React, { useEffect, useState } from "react";
import { IncidentCommand, IncidentSummary, MessageFromServer } from "./model";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentPrioritySelect } from "./incidentPrioritySelect";

function useApplicationWebSocket({
  handleMessage,
}: {
  handleMessage: (message: MessageFromServer) => void;
}) {
  const [websocket, setWebsocket] = useState<WebSocket>();

  function sendCommand(command: IncidentCommand) {
    websocket?.send(JSON.stringify(command));
  }

  useEffect(() => {
    const ws = new WebSocket("/ws");
    ws.onopen = () => {
      setWebsocket(ws);
    };
    ws.onmessage = (message) => {
      const msg = JSON.parse(message.data) as MessageFromServer;
      handleMessage(msg);
    };
  }, []);

  return { sendCommand };
}

export function IncidentOverview() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);

  function handleMessage(message: MessageFromServer) {
    if ("incidents" in message) {
      setIncidents(message.incidents);
    } else if ("delta" in message) {
      const { incidentId, delta } = message;
      switch (delta.delta) {
        case "CreateIncidentDelta": {
          const { info } = delta;
          setIncidents((old) => [...old, { info, incidentId }]);
          return;
        }
        case "UpdateIncidentDelta": {
          const { info } = delta;
          setIncidents((old) =>
            old.map((o) =>
              o.incidentId === incidentId
                ? { ...o, info: { ...o.info, ...info } }
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

  const { sendCommand } = useApplicationWebSocket({ handleMessage });

  return (
    <>
      <h1>My incidents</h1>
      {incidents.map((incident) => (
        <div key={incident.incidentId} id={incident.incidentId}>
          {incident.info.title}{" "}
          <IncidentPrioritySelect
            incident={incident}
            sendCommand={sendCommand}
          />
        </div>
      ))}
      <h2>Create new incident</h2>
      <NewIncidentForm sendCommand={sendCommand} />
    </>
  );
}
