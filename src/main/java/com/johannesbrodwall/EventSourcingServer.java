package com.johannesbrodwall;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class EventSourcingServer {

    private final Server server = new Server(9080);

    EventSourcingServer() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new WebjarServlet("swagger-ui")), "/api-doc/swagger-ui/*");
        handler.addServlet(new ServletHolder(new ContentServlet()), "/*");
        server.setHandler(handler);
    }

    private void start() throws Exception {
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new EventSourcingServer().start();
    }
}
