import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IncidentContext } from "./incidentContext";
import { IncidentSnapshot, IncidentSummary } from "./model";
import { AddInvolvedPersonForm } from "./addInvolvedPersonForm";

interface IncidentViewProps {
  incident: IncidentSummary | IncidentSnapshot;
}

function isSnapshot(incident: IncidentSummary): incident is IncidentSnapshot {
  return "persons" in incident;
}

function IncidentView({ incident }: IncidentViewProps) {
  return (
    <>
      <h2>Incident: {incident.info.title}</h2>
      <p>Priority: {incident.info.priority}</p>
      {isSnapshot(incident) && (
        <>
          <h3>Involved persons</h3>
          {Object.entries(incident.persons).map(
            ([personId, { firstName, lastName, role }]) => (
              <div key={personId}>
                {role}: {lastName}, {firstName}
              </div>
            ),
          )}
        </>
      )}
      <h3>Add person</h3>
      <AddInvolvedPersonForm incidentId={incident.incidentId} />
    </>
  );
}

export function IncidentSnapshot() {
  const { incidentId } = useParams();
  const { incidents, sendMessage, isConnected } = useContext(IncidentContext);
  const incident = incidents.find((o) => o.incidentId === incidentId);
  useEffect(() => {
    if (incidentId) {
      sendMessage({ type: "IncidentSubscribeRequest", incidentId });
    }
  }, [incidentId, isConnected]);
  if (!incident) return <h2>Not found {incidentId}</h2>;
  return <IncidentView incident={incident} />;
}
