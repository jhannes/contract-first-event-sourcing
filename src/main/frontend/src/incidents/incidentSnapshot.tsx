import React, { useContext, useEffect } from "react";
import { IncidentSummary, IncidentSnapshot } from "./model";
import { useParams } from "react-router";
import { IncidentContext } from "./incidentContext";
import { AddInvolvedPersonForm } from "./addInvolvedPersonForm";

function isSnapshot(incident: IncidentSummary): incident is IncidentSnapshot {
  return "persons" in incident;
}

function IncidentView({ incident }: { incident: IncidentSummary }) {
  return (
    <>
      <h2>{incident.info.title}</h2>
      <p>Priority: {incident.info.priority}</p>
      {isSnapshot(incident) && <IncidentSnapshotView incident={incident} />}
      <h3>Add involved person</h3>
      <AddInvolvedPersonForm incidentId={incident.incidentId} />
    </>
  );
}

function IncidentSnapshotView({ incident }: { incident: IncidentSnapshot }) {
  return (
    <>
      <h3>Involved persons</h3>
      {Object.entries(incident.persons).map(([id, person]) => (
        <div key={id}>
          {person.role}: {person.firstName} {person.lastName}
        </div>
      ))}
    </>
  );
}

export function IncidentSnapshot() {
  const { incidentId } = useParams();
  const { incidents, sendMessage, isConnected } = useContext(IncidentContext);
  useEffect(() => {
    if (incidentId) {
      sendMessage({ command: "SubscribeToIncidentSnapshot", incidentId });
    }
  }, [incidentId, isConnected]);
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident) {
    return <h2>Missing incident {incidentId}</h2>;
  }
  return <IncidentView incident={incident} />;
}
