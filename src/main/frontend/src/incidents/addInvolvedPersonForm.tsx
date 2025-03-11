import React, { FormEvent, useContext, useState } from "react";
import { IncidentContext } from "./incidentContext";
import { v4 as uuidv4 } from "uuid";
import { PersonInfoRoleEnum, PersonInfoRoleEnumValues } from "./model";

export function AddInvolvedPersonForm({ incidentId }: { incidentId: string }) {
  const { sendMessage } = useContext(IncidentContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<PersonInfoRoleEnum | "">("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!role) return;
    sendMessage({
      type: "IncidentCommand",
      incidentId,
      eventTime: new Date(),
      delta: {
        delta: "AddPersonToIncident",
        personId: uuidv4(),
        info: { firstName, lastName, role },
      },
    });
    setRole("");
    setFirstName("");
    setLastName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as PersonInfoRoleEnum)}
        >
          <option value="">---</option>
          {PersonInfoRoleEnumValues.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
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
        <button disabled={!role}>Submit</button>
      </div>
    </form>
  );
}
