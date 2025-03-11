import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IncidentContext } from "./incidentContext";
import { IncidentSnapshot, IncidentSummary } from "./model";
import { AddInvolvedPersonForm } from "./addInvolvedPersonForm";

function isSnapshot(incident: IncidentSummary): incident is IncidentSnapshot {
  return "persons" in incident;
}

function IncidentView({
  incident,
}: {
  incident: IncidentSummary | IncidentSnapshot;
}) {
  return (
    <>
      <h2>Incident: {incident.info.title}</h2>
      <p>
        <strong>Priority: </strong> {incident.info.priority}
      </p>
      {isSnapshot(incident) && <IncidentSnapshotView incident={incident} />}
      <AddInvolvedPersonForm incidentId={incident.incidentId} />
    </>
  );
}

function IncidentSnapshotView({ incident }: { incident: IncidentSnapshot }) {
  return (
    <>
      <h3>Involved persons</h3>
      {Object.entries(incident.persons).map(
        ([personId, { firstName, lastName, role }]) => (
          <div key={personId}>
            {firstName} {lastName} ({role})
          </div>
        ),
      )}
    </>
  );
}

export function IncidentSnapshot() {
  const { incidentId } = useParams();
  const { incidents, sendMessage, isConnected } = useContext(IncidentContext);
  useEffect(() => {
    if (incidentId)
      sendMessage({ type: "IncidentSubscribeRequest", incidentId });
  }, [incidentId, isConnected]);
  const incident = incidents.find((o) => o.incidentId === incidentId);
  if (!incident) {
    return <h2>Missing incident {incidentId}</h2>;
  }
  return <IncidentView incident={incident} />;
}
