import React, { useContext } from "react";
import { IncidentSummary } from "./model";
import { useParams } from "react-router";
import { IncidentContext } from "./incidentContext";
import { AddInvolvedPersonForm } from "./addInvolvedPersonForm";

function IncidentSnapshotView({ incident }: { incident: IncidentSummary }) {
  return (
    <>
      <h2>{incident.info.title}</h2>
      <p>Priority: {incident.info.priority}</p>
      <AddInvolvedPersonForm incidentId={incident.incidentId} />
    </>
  );
}

export function IncidentSnapshot() {
  const { incidentId } = useParams();
  const { incidents } = useContext(IncidentContext);
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident) {
    return <h2>Missing incident {incidentId}</h2>;
  }
  return <IncidentSnapshotView incident={incident} />;
}
