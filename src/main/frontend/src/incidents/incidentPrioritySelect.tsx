import React, { useContext } from "react";
import { IncidentContext } from "./incidentContext";
import { IncidentInfoPriorityEnum, IncidentSnapshot } from "./model";

interface IncidentPrioritySelectProps {
  incident: IncidentSnapshot;
}

export function IncidentPrioritySelect({
  incident: {
    incidentId,
    info: { priority },
  },
}: IncidentPrioritySelectProps) {
  const { sendMessage } = useContext(IncidentContext);

  function setPriority(priority: IncidentInfoPriorityEnum) {
    if (priority) {
      sendMessage({
        incidentId,
        eventTime: new Date(),
        type: "IncidentCommand",
        delta: { delta: "UpdateIncidentDelta", info: { priority } },
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
