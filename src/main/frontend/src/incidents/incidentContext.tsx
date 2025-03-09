import React from "react";
import { IncidentCommand, IncidentSummary } from "./model";

export const IncidentContext = React.createContext<{
  incidents: IncidentSummary[];
  sendCommand(command: IncidentCommand): void;
}>({
  incidents: [],
  sendCommand: () => {},
});
