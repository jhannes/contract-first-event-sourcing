import React from "react";
import { IncidentSnapshot, MessageToServer } from "./model";

export const IncidentContext = React.createContext<{
  incidents: IncidentSnapshot[];
  sendMessage(command: MessageToServer): void;
  isConnected: boolean;
}>({
  incidents: [],
  sendMessage: () => {},
  isConnected: false,
});
