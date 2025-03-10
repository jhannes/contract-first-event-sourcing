package com.johannesbrodwall;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.openapitools.client.model.AddInvolvedPersonToIncident;
import org.openapitools.client.model.CreateIncidentDelta;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentEvent;
import org.openapitools.client.model.IncidentInfo;
import org.openapitools.client.model.IncidentSnapshot;
import org.openapitools.client.model.IncidentSummary;
import org.openapitools.client.model.IncidentsSummaryList;
import org.openapitools.client.model.MessageFromServer;
import org.openapitools.client.model.MessageToServer;
import org.openapitools.client.model.SubscribeToIncidentSnapshot;
import org.openapitools.client.model.UpdateIncidentDelta;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
public class ApplicationWebSocketAdapter implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_ABSENT)
            .registerModule(new JavaTimeModule())
            .registerModule(new ApplicationJsonMapperModule());

    private final Map<UUID, IncidentSnapshot> incidents = new HashMap<>();

    private final Set<WebSocketAdapter> connectedClients = new HashSet<>();

    public ApplicationWebSocketAdapter() {
        addIncident(new IncidentSummary().setIncidentId(UUID.randomUUID())
                .setCreatedAt(OffsetDateTime.now().minusSeconds(200))
                .setUpdatedAt(OffsetDateTime.now().minusSeconds(200))
                .setInfo(new IncidentInfo().setTitle("Fire").setPriority(IncidentInfo.PriorityEnum.LOW)));
        addIncident(new IncidentSummary().setIncidentId(UUID.randomUUID())
                .setCreatedAt(OffsetDateTime.now().minusSeconds(100))
                .setUpdatedAt(OffsetDateTime.now().minusSeconds(100))
                .setInfo(new IncidentInfo().setTitle("Traffic accident").setPriority(IncidentInfo.PriorityEnum.LOW)));
    }

    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        var adapter = newWebSocketAdapter();
        connectedClients.add(adapter);
        return adapter;
    }

    private void handleMessageToServer(MessageToServer messageToServer) {
        if (!messageToServer.missingRequiredFields("").isEmpty()) {
            log.error("Missing required fields {} in {}", messageToServer.missingRequiredFields(""), messageToServer);
            return;
        }

        if (messageToServer instanceof IncidentCommand command) {
            switch (command.getDelta()) {
                case CreateIncidentDelta create -> addIncident(new IncidentSummary()
                        .setCreatedAt(command.getEventTime())
                        .setUpdatedAt(command.getEventTime())
                        .setIncidentId(command.getIncidentId())
                        .setInfo(create.getInfo())
                );
                case UpdateIncidentDelta update -> incidents.get(command.getIncidentId())
                        .setUpdatedAt(command.getEventTime())
                        .getInfo().putAll(update.getInfo());
                case AddInvolvedPersonToIncident addPerson -> incidents.get(command.getIncidentId())
                        .setUpdatedAt(command.getEventTime())
                        .getPersons().put(addPerson.getPersonId().toString(), addPerson.getInfo());
                case null, default -> log.warn("Unknown event type {}", command.getDelta().getClass().getName());
            }

            broadcastMessage(new IncidentEvent().setTimestamp(System.currentTimeMillis()).putAll(command));
        } else {
            log.warn("Unknown message type {}", messageToServer.getClass().getName());
        }
    }

    private void addIncident(IncidentSummary incident) {
        incidents.put(incident.getIncidentId(), new IncidentSnapshot().putAll(incident));
    }

    @SneakyThrows
    private void broadcastMessage(MessageFromServer messageToServer) {
        var message = mapper.writeValueAsString(messageToServer);
        for (var client : connectedClients) {
            try {
                client.getRemote().sendString(message);
            } catch (IOException e) {
                log.warn("Failed to send message to client {}", client, e);
            }
        }
    }

    private WebSocketAdapter newWebSocketAdapter() {
        return new WebSocketAdapter() {
            @SneakyThrows
            @Override
            public void onWebSocketConnect(Session sess) {
                super.onWebSocketConnect(sess);
                sess.getRemote().sendString(mapper.writeValueAsString(new IncidentsSummaryList().setIncidents(
                        incidents.values().stream().map(o -> new IncidentSummary().putAll(o)).toList()
                )));
            }

            @SneakyThrows
            @Override
            public void onWebSocketText(String message) {
                var messageToServer = mapper.readValue(message, MessageToServer.class);
                log.info(messageToServer.toString());
                if (messageToServer instanceof IncidentCommand) {
                    handleMessageToServer(messageToServer);
                } else if (messageToServer instanceof SubscribeToIncidentSnapshot subscribe) {
                    getRemote().sendString(mapper.writeValueAsString(incidents.get(subscribe.getIncidentId())));
                } else {
                    log.warn("Unknown message type {}", messageToServer.getClass().getName());
                }
            }

            @Override
            public void onWebSocketError(Throwable cause) {
                log.error(cause.toString());
            }

            @Override
            public void onWebSocketClose(int statusCode, String reason) {
                super.onWebSocketClose(statusCode, reason);
                connectedClients.remove(this);
            }
        };
    }

}
