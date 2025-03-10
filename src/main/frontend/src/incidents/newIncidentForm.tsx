import React, { FormEvent, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IncidentContext } from "./incidentContext";

export function NewIncidentForm() {
  const { sendMessage } = useContext(IncidentContext);
  const [title, setTitle] = useState("");
  const [incidentId, setIncidentId] = useState(uuidv4());

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage({
      command: "IncidentCommand",
      incidentId,
      eventTime: new Date(),
      delta: { delta: "CreateIncidentDelta", info: { title } },
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
