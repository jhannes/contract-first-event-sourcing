import React from "react";
import { IncidentSummary, MessageToServer } from "./model";

export const IncidentContext = React.createContext<{
  incidents: IncidentSummary[];
  sendMessage(command: MessageToServer): void;
  isConnected: boolean;
}>({
  incidents: [],
  sendMessage: () => {},
  isConnected: false,
});
