import { IncidentInfoPriorityEnum, IncidentSummary } from "./model";
import React, { useContext } from "react";
import { IncidentContext } from "./incidentContext";

export function IncidentPrioritySelect({
  incident: { info, incidentId },
}: {
  incident: IncidentSummary;
}) {
  const { sendCommand } = useContext(IncidentContext);

  function setPriority(priority: IncidentInfoPriorityEnum | "") {
    if (priority) {
      sendCommand({
        command: "IncidentCommand",
        incidentId,
        eventTime: new Date(),
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
