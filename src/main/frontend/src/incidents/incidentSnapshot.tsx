import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IncidentContext } from "./incidentContext";
import { IncidentSnapshot } from "./model";
import { AddInvolvedPersonForm } from "./addInvolvedPersonForm";

interface IncidentViewProps {
  incident: IncidentSnapshot;
}

function IncidentView({ incident }: IncidentViewProps) {
  return (
    <>
      <h2>Incident: {incident.info.title}</h2>
      <p>Priority: {incident.info.priority}</p>
      <h3>Involved persons</h3>
      {Object.entries(incident.persons).map(
        ([personId, { firstName, lastName, role }]) => (
          <div key={personId}>
            {role}: {lastName}, {firstName}
          </div>
        ),
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
  useEffect(() => {}, [incidentId, isConnected]);
  if (!incident) return <h2>Not found {incidentId}</h2>;
  return <IncidentView incident={incident} />;
}
