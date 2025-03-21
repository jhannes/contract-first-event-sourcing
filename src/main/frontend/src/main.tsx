import React from "react";
import { createRoot } from "react-dom/client";
import { IncidentOverview } from "./incidents/incidentOverview";
import { BrowserRouter, Route, Routes } from "react-router";
import { IncidentSnapshot } from "./incidents/incidentSnapshot";
import { useIncidentsWebSocket } from "./incidents/useIncidentsWebSocket";
import { IncidentContext } from "./incidents/incidentContext";

function Application() {
  const { incidents, sendMessage, isConnected } = useIncidentsWebSocket();
  return (
    <BrowserRouter>
      {isConnected || <div>Disconnected</div>}
      <IncidentContext value={{ incidents, sendMessage, isConnected }}>
        <Routes>
          <Route
            path={"/incidents/:incidentId"}
            element={<IncidentSnapshot />}
          />
          <Route path={"*"} element={<IncidentOverview />} />
        </Routes>
      </IncidentContext>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("app")!).render(<Application />);
