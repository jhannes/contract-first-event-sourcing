import React, { FormEvent, useContext, useState } from "react";
import { IncidentContext } from "./incidentContext";
import { v4 as uuidv4 } from "uuid";

export function AddInvolvedPersonForm({ incidentId }: { incidentId: string }) {
  const { sendMessage } = useContext(IncidentContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [personId] = useState(uuidv4());

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select>
          <option value="">---</option>
        </select>
      </div>
      <div>
        First name:{" "}
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        Last name:{" "}
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
