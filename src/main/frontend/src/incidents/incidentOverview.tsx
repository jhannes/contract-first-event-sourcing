import React, { useEffect, useState } from "react";
import { IncidentCommand, IncidentSummary, MessageFromServer } from "./model";
import { NewIncidentForm } from "./newIncidentForm";

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
      const {
        delta: { title },
        incidentId,
      } = message;
      setIncidents((old) => [...old, { title, incidentId }]);
    }
  }

  const { sendCommand } = useApplicationWebSocket({ handleMessage });

  return (
    <>
      <h1>My incidents</h1>
      {incidents.map(({ incidentId, title }) => (
        <div key={incidentId} id={incidentId}>
          {title}
        </div>
      ))}
      <h2>Create new incident</h2>
      <NewIncidentForm sendCommand={sendCommand} />
    </>
  );
}
