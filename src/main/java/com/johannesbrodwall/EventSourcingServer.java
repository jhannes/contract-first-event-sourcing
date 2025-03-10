package com.johannesbrodwall;

import com.johannesbrodwall.infrastructure.ContentServlet;
import com.johannesbrodwall.infrastructure.WebjarServlet;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.websocket.server.config.JettyWebSocketServletContainerInitializer;

public class EventSourcingServer {

    private final Server server = new Server(9080);

    EventSourcingServer() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new WebjarServlet("swagger-ui")), "/api-doc/swagger-ui/*");
        handler.addServlet(new ServletHolder(new ContentServlet()), "/*");
        handler.addServletContainerInitializer(new JettyWebSocketServletContainerInitializer(
                (_, container) -> container.addMapping("/ws", new ApplicationWebSocketAdapter())));
        server.setHandler(handler);
    }

    private void start() throws Exception {
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new EventSourcingServer().start();
    }
}
