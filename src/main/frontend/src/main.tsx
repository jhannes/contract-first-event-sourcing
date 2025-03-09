import React from "react";
import { createRoot } from "react-dom/client";
import { IncidentOverview } from "./incidents/incidentOverview";
import { BrowserRouter, Route, Routes } from "react-router";
import { IncidentSnapshot } from "./incidents/incidentSnapshot";
import { useIncidentsWebSocket } from "./incidents/useIncidentsWebSocket";

function Application() {
  const { incidents, sendCommand } = useIncidentsWebSocket();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/incidents/:incidentId"}
          element={
            <IncidentSnapshot incidents={incidents} sendCommand={sendCommand} />
          }
        />
        <Route
          path={"*"}
          element={
            <IncidentOverview incidents={incidents} sendCommand={sendCommand} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")!).render(<Application />);
