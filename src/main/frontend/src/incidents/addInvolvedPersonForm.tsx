import { FormEvent, useContext } from "react";
import { IncidentContext } from "./incidentContext";
import React from "react";

export function AddInvolvedPersonForm({ incidentId }: { incidentId: any }) {
  const { sendCommand } = useContext(IncidentContext);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <>
      <h3>Add involved person</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  );
}
