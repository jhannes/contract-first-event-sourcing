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
import org.openapitools.client.model.AddPersonToIncidentDelta;
import org.openapitools.client.model.CreateIncidentDelta;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentEvent;
import org.openapitools.client.model.IncidentSnapshot;
import org.openapitools.client.model.IncidentSubscribeRequest;
import org.openapitools.client.model.IncidentSummary;
import org.openapitools.client.model.IncidentSummaryList;
import org.openapitools.client.model.MessageFromServer;
import org.openapitools.client.model.MessageToServer;
import org.openapitools.client.model.UpdateIncidentDelta;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Slf4j
public class ApplicationWebSocketCreator implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ApplicationObjectMapper();

    private final Set<ApplicationWebSocketAdapter> connectedClients = new HashSet<>();
    private final HashMap<UUID, IncidentSnapshot> incidents = new HashMap<>();

    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        var adapter = new ApplicationWebSocketAdapter();
        connectedClients.add(adapter);
        return adapter;
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
            sendMessage(new IncidentSummaryList().setIncidents(incidents.values().stream()
                    .map(snapshot -> new IncidentSummary().putAll(snapshot))
                    .toList())
            );
        }

        @SneakyThrows
        @Override
        public void onWebSocketText(String message) {
            handleMessageToServer(mapper.readValue(message, MessageToServer.class));
        }

        private void handleMessageToServer(MessageToServer messageToServer) {
            log.info(messageToServer.toString());
            if (!messageToServer.missingRequiredFields("").isEmpty()) {
                log.error("Missing required fields {} in {}", messageToServer.missingRequiredFields(""), messageToServer);
                return;
            }
            switch (messageToServer) {
                case IncidentCommand command -> handleCommand(command);
                case IncidentSubscribeRequest subscribe -> sendMessage(incidents.get(subscribe.getIncidentId()));
            }
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

    private void handleCommand(IncidentCommand command) {
        switch (command.getDelta()) {
            case CreateIncidentDelta create -> createIncident(new IncidentSnapshot()
                    .setIncidentId(command.getIncidentId())
                    .setCreatedAt(command.getEventTime())
                    .setUpdatedAt(command.getEventTime())
                    .setInfo(create.getInfo()));
            case UpdateIncidentDelta update -> incidents.get(command.getIncidentId())
                    .setUpdatedAt(command.getEventTime())
                    .getInfo().putAll(update.getInfo());
            case AddPersonToIncidentDelta addPerson -> incidents.get(command.getIncidentId())
                    .setUpdatedAt(command.getEventTime())
                    .getPersons().put(addPerson.getPersonId().toString(), addPerson.getInfo());
        }
        broadcastMessage(new IncidentEvent()
                .setTimestamp(System.currentTimeMillis())
                .putAll(command));
    }

    private void createIncident(IncidentSnapshot snapshot) {
        if (!snapshot.missingRequiredFields("").isEmpty()) {
            throw new IllegalStateException("Missing required fields " + snapshot.missingRequiredFields(""));
        }
        incidents.put(snapshot.getIncidentId(), snapshot);
    }
}
