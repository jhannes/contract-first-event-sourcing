import React from "react";
import { IncidentCommand, IncidentSummary } from "./model";
import { useParams } from "react-router";

function IncidentSnapshotView({ incident }: { incident: IncidentSummary }) {
  return (
    <>
      <h2>{incident.info.title}</h2>
      <p>Priority: {incident.info.priority}</p>
    </>
  );
}

export function IncidentSnapshot({
  incidents,
  sendCommand,
}: {
  incidents: IncidentSummary[];
  sendCommand: (command: IncidentCommand) => void;
}) {
  const { incidentId } = useParams();
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident) {
    return <h2>Missing incident {incidentId}</h2>;
  }
  return <IncidentSnapshotView incident={incident} />;
}
