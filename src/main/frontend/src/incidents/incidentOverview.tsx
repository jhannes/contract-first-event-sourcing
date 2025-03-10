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
      <h2>Create new incident</h2>
      <NewIncidentForm />
    </>
  );
}
