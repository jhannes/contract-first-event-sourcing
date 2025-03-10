package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.api.exceptions.WebSocketTimeoutException;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.openapitools.client.model.MessageFromServer;
import org.openapitools.client.model.MessageToServer;

import java.util.HashSet;
import java.util.Set;

@Slf4j
public class ApplicationWebSocketCreator implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ApplicationObjectMapper();

    private final Set<ApplicationWebSocketAdapter> connectedClients = new HashSet<>();

    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        var adapter = new ApplicationWebSocketAdapter();
        connectedClients.add(adapter);
        return adapter;
    }

    private void handleMessageToServer(MessageToServer messageToServer) {
        if (!messageToServer.missingRequiredFields("").isEmpty()) {
            log.error("Missing required fields {} in {}", messageToServer.missingRequiredFields(""), messageToServer);
            return;
        }
    }

    @SneakyThrows
    private void broadcastMessage(MessageFromServer messageFromServer) {
        for (var client : connectedClients) {
            client.sendMessage(messageFromServer);
        }
    }

    private class ApplicationWebSocketAdapter extends WebSocketAdapter {
        @SneakyThrows
        @Override
        public void onWebSocketConnect(Session sess) {
            super.onWebSocketConnect(sess);
            log.info("connected");
        }

        @SneakyThrows
        @Override
        public void onWebSocketText(String message) {
            var messageToServer = mapper.readValue(message, MessageToServer.class);
            log.info(messageToServer.toString());
        }

        @Override
        public void onWebSocketError(Throwable cause) {
            if (cause instanceof WebSocketTimeoutException) {
                return;
            }
            log.error(cause.toString());
        }

        @Override
        public void onWebSocketClose(int statusCode, String reason) {
            super.onWebSocketClose(statusCode, reason);
            connectedClients.remove(this);
        }

        @SneakyThrows
        public void sendMessage(MessageFromServer messageFromServer) {
            if (!messageFromServer.missingRequiredFields("").isEmpty()) {
                log.error("Missing required fields {} in {}", messageFromServer.missingRequiredFields(""), messageFromServer);
                return;
            }
            getRemote().sendString(mapper.writeValueAsString(messageFromServer));
        }
    }
}
