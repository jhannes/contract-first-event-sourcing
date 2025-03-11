import React, { useContext } from "react";
import { NewIncidentForm } from "./newIncidentForm";
import { IncidentPrioritySelect } from "./incidentPrioritySelect";
import { Link } from "react-router";
import { IncidentContext } from "./incidentContext";

export function IncidentOverview() {
  const { incidents } = useContext(IncidentContext);
  return (
    <>
      <h1>My incidents</h1>
      {incidents.map(({ incidentId, title }) => (
        <div key={incidentId}>{title}</div>
      ))}
      <h2>Create new incident</h2>
      <NewIncidentForm />
    </>
  );
}
