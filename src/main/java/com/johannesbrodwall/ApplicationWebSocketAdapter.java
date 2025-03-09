package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.openapitools.client.model.IncidentSummary;
import org.openapitools.client.model.IncidentsSummaryList;
import org.openapitools.client.model.SampleModelData;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class ApplicationWebSocketAdapter implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ObjectMapper();

    private final Map<UUID, IncidentSummary> incidents = new HashMap<>();

    public ApplicationWebSocketAdapter() {
        var sampleData = new SampleModelData(-1);
        incidents.put(UUID.randomUUID(), sampleData.sampleIncidentSummary().setTitle("Fire"));
        incidents.put(UUID.randomUUID(), sampleData.sampleIncidentSummary().setTitle("Traffic accident"));
    }

    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        return new WebSocketAdapter() {
            @SneakyThrows
            @Override
            public void onWebSocketConnect(Session sess) {
                sess.getRemote().sendString(mapper.writeValueAsString(new IncidentsSummaryList().setIncidents(
                        new ArrayList<>(incidents.values())
                )));
            }
        };
    }
}
