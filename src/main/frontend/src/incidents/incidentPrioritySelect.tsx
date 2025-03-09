import {
  IncidentCommand,
  IncidentInfoPriorityEnum,
  IncidentSummary,
} from "./model";
import React from "react";

export function IncidentPrioritySelect({
  incident: { info, incidentId },
  sendCommand,
}: {
  incident: IncidentSummary;
  sendCommand: (command: IncidentCommand) => void;
}) {
  function setPriority(priority: IncidentInfoPriorityEnum | "") {
    if (priority) {
      sendCommand({
        incidentId,
        delta: { delta: "UpdateIncidentDelta", info: { priority } },
      });
    }
    console.log({ priority });
  }

  return (
    <span>
      <select
        value={info.priority || ""}
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
