import { FormEvent, useContext, useState } from "react";
import { IncidentContext } from "./incidentContext";
import React from "react";
import {
  InvolvedPersonInfoRoleEnum,
  InvolvedPersonInfoRoleEnumValues,
} from "./model";
import { v4 as uuidv4 } from "uuid";

export function AddInvolvedPersonForm({ incidentId }: { incidentId: any }) {
  const { sendMessage } = useContext(IncidentContext);
  const [role, setRole] = useState<InvolvedPersonInfoRoleEnum | "">("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [personId] = useState(uuidv4());

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!role) return;
    sendMessage({
      command: "IncidentCommand",
      incidentId,
      eventTime: new Date(),
      delta: {
        delta: "AddInvolvedPersonToIncident",
        personId,
        info: { role, firstName, lastName },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as InvolvedPersonInfoRoleEnum)
          }
        >
          <option value="">---</option>
          {InvolvedPersonInfoRoleEnumValues.map((v) => (
            <option key={v}>{v}</option>
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
