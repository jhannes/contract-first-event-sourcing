import { useEffect, useState } from "react";

export function useApplicationWebSocket<FROM_SERVER, TO_SERVER>({
  handleMessage,
}: {
  handleMessage: (message: FROM_SERVER) => void;
}) {
  const [websocket, setWebsocket] = useState<WebSocket>();

  function sendCommand(command: TO_SERVER) {
    websocket?.send(JSON.stringify(command));
  }

  useEffect(() => {
    const ws = new WebSocket("/ws");
    ws.onopen = () => {
      setWebsocket(ws);
    };
    ws.onmessage = (message) => {
      const msg = JSON.parse(message.data) as FROM_SERVER;
      handleMessage(msg);
    };
  }, []);

  return { sendCommand };
}
