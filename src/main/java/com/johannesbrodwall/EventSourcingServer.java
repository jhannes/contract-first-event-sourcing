package com.johannesbrodwall;

import lombok.SneakyThrows;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;

public class EventSourcingServer {

    private final Server server = new Server(9080);

    @SneakyThrows
    EventSourcingServer() {
        server.setHandler(new ContextHandlerCollection(
                new ContextHandler(ContentResourceHandler.getWebJarResource("swagger-ui"), "/api-doc/swagger-ui"),
                getServletContextHandler(),
                new ContextHandler(ContentResourceHandler.getProjectResourceHandler("webapp"), "/")
        ));
        server.setRequestLog(new CustomRequestLog());
    }

    private static ServletContextHandler getServletContextHandler() {
        var handler = new ServletContextHandler();
        handler.getServletHandler().setEnsureDefaultServlet(false);
        handler.addServlet(new ServletHolder(new HelloWorldServlet()), "/hello");
        return handler;
    }

    private void start() throws Exception {
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new EventSourcingServer().start();
    }

}
