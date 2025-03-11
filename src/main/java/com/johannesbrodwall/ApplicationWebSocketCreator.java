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
import org.openapitools.client.model.AddPersonToIncident;
import org.openapitools.client.model.CreateIncident;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentEvent;
import org.openapitools.client.model.IncidentSnapshot;
import org.openapitools.client.model.IncidentSummaryList;
import org.openapitools.client.model.MessageFromServer;
import org.openapitools.client.model.MessageToServer;
import org.openapitools.client.model.UpdateIncident;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Slf4j
public class ApplicationWebSocketCreator implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ApplicationObjectMapper();

    private final Set<ApplicationWebSocketAdapter> connectedClients = new HashSet<>();
    private final HashMap<UUID, IncidentSnapshot> incidents = new HashMap<>();
    private long timestamp = System.currentTimeMillis();


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
            timestamp = System.currentTimeMillis();
            var event = new IncidentEvent().setTimestamp(timestamp).putAll(command);
            switch (event.getDelta()) {
                case CreateIncident create -> incidents.put(event.getIncidentId(), new IncidentSnapshot()
                        .setIncidentId(event.getIncidentId())
                        .setCreatedAt(event.getEventTime())
                        .setUpdatedAt(event.getEventTime())
                        .setInfo(create.getInfo()));
                case UpdateIncident update -> incidents.get(event.getIncidentId())
                        .setUpdatedAt(event.getEventTime())
                        .getInfo().putAll(update.getInfo());
                case AddPersonToIncident addPerson -> incidents.get(event.getIncidentId())
                        .setUpdatedAt(event.getEventTime())
                        .getPersons().put(addPerson.getPersonId().toString(), addPerson.getInfo());
            }
            broadcastMessage(event);
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
            sendMessage(new IncidentSummaryList()
                    .setLastTimestamp(timestamp)
                    .setIncidents(new ArrayList<>(incidents.values())));
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

        public void sendMessage(MessageFromServer messageFromServer) {
            if (!messageFromServer.missingRequiredFields("").isEmpty()) {
                log.error("Missing required fields {} in {}", messageFromServer.missingRequiredFields(""), messageFromServer);
                return;
            }
            try {
                getRemote().sendString(mapper.writeValueAsString(messageFromServer));
            } catch (IOException e) {
                log.warn("Failed to send message to client {}", this, e);
            }
        }
    }
}
