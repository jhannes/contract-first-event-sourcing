import React, { useEffect, useState } from "react";
import { IncidentsSummaryList, IncidentSummary } from "./model";
import { NewIncidentForm } from "./newIncidentForm";

export function IncidentOverview() {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  useEffect(() => {
    const ws = new WebSocket("/ws");
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
      <NewIncidentForm />
    </>
  );
}
