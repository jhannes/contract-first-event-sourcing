import React, { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { IncidentContext } from "./incidentContext";

function IncidentView() {
  return <></>;
}

function IncidentSnapshotView() {
  return (
    <>
      <h3>Involved persons</h3>
    </>
  );
}

export function IncidentSnapshot() {
  const { incidentId } = useParams();
  const { incidents, sendMessage, isConnected } = useContext(IncidentContext);
  useEffect(() => {}, [incidentId, isConnected]);
  return <IncidentView />;
}
