import { useCallback, useEffect, useRef, useState } from "react";

export function useWebSocket<FROM_SERVER, TO_SERVER>({
  handleMessage,
  url,
}: {
  handleMessage: (message: FROM_SERVER) => void;
  url: string;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

  function sendMessage(command: TO_SERVER) {
    websocketRef.current?.send(JSON.stringify(command));
  }
  const connect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    const ws = new WebSocket(url);
    ws.onopen = () => {
      websocketRef.current = ws;
      setIsConnected(true);
    };
    ws.onmessage = (message) => {
      const msg = JSON.parse(message.data) as FROM_SERVER;
      handleMessage(msg);
    };
    ws.onclose = () => {
      reconnectTimerRef.current = setTimeout(() => {
        setIsConnected(false);
        connect();
      }, 2000);
    };
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      websocketRef.current?.close();
    };
  }, [connect]);

  return { sendMessage, isConnected };
}
