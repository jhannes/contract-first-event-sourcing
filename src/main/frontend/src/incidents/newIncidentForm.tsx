import React, { FormEvent, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IncidentContext } from "./incidentContext";

export function NewIncidentForm() {
  const { sendMessage } = useContext(IncidentContext);
  const [title, setTitle] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
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
