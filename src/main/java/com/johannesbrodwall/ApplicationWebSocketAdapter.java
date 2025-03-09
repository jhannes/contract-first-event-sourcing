package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentEvent;
import org.openapitools.client.model.IncidentSummary;
import org.openapitools.client.model.IncidentsSummaryList;
import org.openapitools.client.model.MessageFromServer;
import org.openapitools.client.model.MessageToServer;
import org.openapitools.client.model.SampleModelData;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
public class ApplicationWebSocketAdapter implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new ApplicationJsonMapperModule());

    private final Map<UUID, IncidentSummary> incidents = new HashMap<>();

    private final Set<WebSocketAdapter> connectedClients = new HashSet<>();

    public ApplicationWebSocketAdapter() {
        var sampleData = new SampleModelData(-1);
        incidents.put(UUID.randomUUID(), sampleData.sampleIncidentSummary().setTitle("Fire"));
        incidents.put(UUID.randomUUID(), sampleData.sampleIncidentSummary().setTitle("Traffic accident"));
    }

    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        var adapter = newWebSocketAdapter();
        connectedClients.add(adapter);
        return adapter;
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
                        new ArrayList<>(incidents.values())
                )));
            }

            @SneakyThrows
            @Override
            public void onWebSocketText(String message) {
                var messageToServer = mapper.readValue(message, MessageToServer.class);
                log.info(messageToServer.toString());
                if (messageToServer instanceof IncidentCommand command) {
                    broadcastMessage(new IncidentEvent().setTimestamp(System.currentTimeMillis()).putAll(command));
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
