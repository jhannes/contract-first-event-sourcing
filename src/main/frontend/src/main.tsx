import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  IncidentSummary,
  IncidentsSummaryList,
} from "../../../../target/generated-sources/openapi/typescript";

function Application() {
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
    </>
  );
}

createRoot(document.getElementById("app")!).render(<Application />);
