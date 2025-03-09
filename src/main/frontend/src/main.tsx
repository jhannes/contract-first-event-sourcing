import React from "react";
import { createRoot } from "react-dom/client";
import { IncidentOverview } from "./incidents/incidentOverview";

createRoot(document.getElementById("app")!).render(<IncidentOverview />);
