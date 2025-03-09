import React, { FormEvent, useState } from "react";
import { IncidentCommand } from "./model";
import { v4 as uuidv4 } from "uuid";

export function NewIncidentForm({
  sendCommand,
}: {
  sendCommand(command: IncidentCommand): void;
}) {
  const [title, setTitle] = useState("");
  const [incidentId, setIncidentId] = useState(uuidv4());

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendCommand({
      incidentId,
      delta: { info: { title } },
    });
    setIncidentId(uuidv4());
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} key={incidentId}>
      <div>
        <label>
          Title:{" "}
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
}
