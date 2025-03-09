import React from "react";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentPrioritySelect } from "./incidentPrioritySelect";
import { Link } from "react-router";
import { IncidentCommand, IncidentSummary } from "./model";

export function IncidentOverview({
  incidents,
  sendCommand,
}: {
  incidents: IncidentSummary[];
  sendCommand: (command: IncidentCommand) => void;
}) {
  return (
    <>
      <h1>My incidents</h1>
      {incidents
        .toSorted(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .map((incident) => (
          <div key={incident.incidentId} id={incident.incidentId}>
            <Link to={"/incidents/" + incident.incidentId}>
              {incident.info.title}
            </Link>{" "}
            <IncidentPrioritySelect
              incident={incident}
              sendCommand={sendCommand}
            />
          </div>
        ))}
      <h2>Create new incident</h2>
      <NewIncidentForm sendCommand={sendCommand} />
    </>
  );
}
