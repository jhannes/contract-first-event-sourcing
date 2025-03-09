import React, { useEffect, useState } from "react";
import {
  IncidentCommand,
  IncidentsSummaryList,
  IncidentSummary,
} from "./model";
import { NewIncidentForm } from "./newIncidentForm";

export function IncidentOverview() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
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
      const msg = JSON.parse(message.data) as IncidentsSummaryList;
      console.log(msg);
      setIncidents(msg.incidents);
    };
  }, []);
  return (
    <>
      <h1>My incidents</h1>
      {incidents.map(({ id, title }) => (
        <div key={id} id={id}>
          {title}
        </div>
      ))}
      <h2>Create new incident</h2>
      <NewIncidentForm sendCommand={sendCommand} />
    </>
  );
}
