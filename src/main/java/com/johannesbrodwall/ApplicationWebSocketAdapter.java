package com.johannesbrodwall;

import lombok.SneakyThrows;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeRequest;
import org.eclipse.jetty.websocket.server.JettyServerUpgradeResponse;
import org.eclipse.jetty.websocket.server.JettyWebSocketCreator;

public class ApplicationWebSocketAdapter implements JettyWebSocketCreator {
    @Override
    public WebSocketAdapter createWebSocket(JettyServerUpgradeRequest req, JettyServerUpgradeResponse resp) {
        return new WebSocketAdapter() {
            @SneakyThrows
            @Override
            public void onWebSocketConnect(Session sess) {
                sess.getRemote().sendString("Hello world");
            }
        };
    }
}
