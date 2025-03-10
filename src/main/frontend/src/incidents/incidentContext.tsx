import React from "react";
import { MessageToServer, IncidentSummary } from "./model";

export const IncidentContext = React.createContext<{
  incidents: IncidentSummary[];
  sendMessage(command: MessageToServer): void;
  isConnected: boolean;
}>({
  incidents: [],
  sendMessage: () => {},
  isConnected: false,
});
