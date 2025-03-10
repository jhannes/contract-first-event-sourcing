import React from "react";
import { MessageToServer } from "./model";

export const IncidentContext = React.createContext<{
  incidents?: never;
  sendMessage(command: MessageToServer): void;
  isConnected: boolean;
}>({
  sendMessage: () => {},
  isConnected: false,
});
