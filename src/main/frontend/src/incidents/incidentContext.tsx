import React from "react";
import { MessageToServer, IncidentSummary } from "./model";

export const IncidentContext = React.createContext<{
  incidents: IncidentSummary[];
  sendCommand(command: MessageToServer): void;
  isConnected: boolean;
}>({
  incidents: [],
  sendCommand: () => {},
  isConnected: false,
});
