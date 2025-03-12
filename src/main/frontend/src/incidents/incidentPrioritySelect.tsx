import React, { useContext } from "react";
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

  function setPriority(priority: IncidentInfoPriorityEnum) {
    if (priority) {
      sendMessage({
        type: "IncidentCommand",
        eventTime: new Date(),
        incidentId,
        delta: {
          delta: "UpdateIncidentDelta",
          info: { priority },
        },
      });
    }
  }

  return (
    <span>
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as IncidentInfoPriorityEnum)
        }
      >
        <option value={""}>(ikke satt)</option>
        <option value={"HIGH"}>HØY</option>
        <option value={"MEDIUM"}>MIDDELS</option>
        <option value={"LOW"}>LAV</option>
      </select>
    </span>
  );
}
