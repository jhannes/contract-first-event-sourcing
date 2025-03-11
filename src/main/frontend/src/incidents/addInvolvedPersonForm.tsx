import React, { FormEvent, useContext, useState } from "react";
import { IncidentContext } from "./incidentContext";
import { v4 as uuidv4 } from "uuid";
import { PersonInfoRoleEnum, PersonInfoRoleEnumValues } from "./model";

export function AddInvolvedPersonForm({ incidentId }: { incidentId: string }) {
  const { sendMessage } = useContext(IncidentContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<PersonInfoRoleEnum>();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    sendMessage({
      type: "IncidentCommand",
      eventTime: new Date(),
      incidentId,
      delta: {
        delta: "AddPersonToIncidentDelta",
        personId: uuidv4(),
        info: { firstName, lastName, role },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as PersonInfoRoleEnum)}
        >
          <option value="">---</option>
          {PersonInfoRoleEnumValues.map((item) => (
            <option key={item} value={item}>
              {item}
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
        <button>Submit</button>
      </div>
    </form>
  );
}
