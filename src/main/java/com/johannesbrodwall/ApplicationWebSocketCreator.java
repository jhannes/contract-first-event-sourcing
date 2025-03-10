package com.johannesbrodwall;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.api.exceptions.WebSocketTimeoutException;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentEvent;
import org.openapitools.client.model.MessageFromServer;
import org.openapitools.client.model.MessageToServer;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Slf4j
public class ApplicationWebSocketCreator implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_ABSENT)
            .registerModule(new ApplicationJsonMapperModule())
            .registerModule(new JavaTimeModule())
            .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);

    private final Set<ApplicationWebSocketAdapter> connectedClients = new HashSet<>();

    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        var adapter = new ApplicationWebSocketAdapter();
        connectedClients.add(adapter);
        return adapter;
    }

    private void handleMessageToServer(MessageToServer messageToServer) {
        log.info(messageToServer.toString());
        if (!messageToServer.missingRequiredFields("").isEmpty()) {
            log.error("Missing required fields {} in {}", messageToServer.missingRequiredFields(""), messageToServer);
            return;
        }
        if (messageToServer instanceof IncidentCommand command) {
            broadcastMessage(new IncidentEvent().setTimestamp(System.currentTimeMillis()).putAll(command));
        }
    }

    @SneakyThrows
    private void broadcastMessage(MessageFromServer messageFromServer) {
        if (!messageFromServer.missingRequiredFields("").isEmpty()) {
            log.error("Missing required fields {} in {}", messageFromServer.missingRequiredFields(""), messageFromServer);
            return;
        }
        var message = mapper.writeValueAsString(messageFromServer);
        for (var client : connectedClients) {
            try {
                client.getRemote().sendString(message);
            } catch (IOException e) {
                log.warn("Failed to send message to client {}", client, e);
            }
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
            handleMessageToServer(messageToServer);
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
    }
}
