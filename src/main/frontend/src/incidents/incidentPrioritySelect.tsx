import React, { useContext } from "react";
import { IncidentContext } from "./incidentContext";

export function IncidentPrioritySelect() {
  const { sendMessage } = useContext(IncidentContext);

  function setPriority(priority: string) {
    if (priority) {
    }
  }

  return (
    <span>
      <select>
        <option value={""}>(ikke satt)</option>
        <option value={"HIGH"}>HØY</option>
        <option value={"MEDIUM"}>MIDDELS</option>
        <option value={"LOW"}>LAV</option>
      </select>
    </span>
  );
}
