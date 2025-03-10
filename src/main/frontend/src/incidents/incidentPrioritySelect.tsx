import React, { useContext, useState } from "react";
import { IncidentContext } from "./incidentContext";
import { IncidentInfoPriorityEnum, IncidentSummary } from "./model";

export function IncidentPrioritySelect({
  incident: {
    incidentId,
    info: { priority },
  },
}: {
  incident: IncidentSummary;
}) {
  const { sendMessage } = useContext(IncidentContext);

  function setPriority(priority: string) {
    if (priority) {
      sendMessage({
        type: "IncidentCommand",
        incidentId,
        eventTime: new Date(),
        delta: {
          delta: "UpdateIncident",
          info: { priority: priority as IncidentInfoPriorityEnum },
        },
      });
    }
  }

  return (
    <span>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value={""}>(ikke satt)</option>
        <option value={"HIGH"}>HØY</option>
        <option value={"MEDIUM"}>MIDDELS</option>
        <option value={"LOW"}>LAV</option>
      </select>
    </span>
  );
}
