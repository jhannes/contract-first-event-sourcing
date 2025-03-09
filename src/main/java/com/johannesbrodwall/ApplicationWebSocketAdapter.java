package com.johannesbrodwall;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;
import org.openapitools.client.model.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
public class ApplicationWebSocketAdapter implements JettyWebSocketCreator {
    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new ApplicationJsonMapperModule());

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
            }

            @Override
            public void onWebSocketError(Throwable cause) {
                log.error(cause.toString());
            }

            @Override
            public void onWebSocketClose(int statusCode, String reason) {
                super.onWebSocketClose(statusCode, reason);
            }
        };
    }

}
