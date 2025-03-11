import React from "react";
import { IncidentSnapshot, IncidentSummary, MessageToServer } from "./model";

export const IncidentContext = React.createContext<{
  incidents: (IncidentSummary | IncidentSnapshot)[];
  sendMessage(command: MessageToServer): void;
  isConnected: boolean;
}>({
  incidents: [],
  sendMessage: () => {},
  isConnected: false,
});
