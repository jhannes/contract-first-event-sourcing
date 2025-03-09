package com.johannesbrodwall;

import lombok.SneakyThrows;
import org.eclipse.jetty.ee10.servlet.ResourceServlet;
import org.eclipse.jetty.ee10.servlet.ServletContextHandler;
import org.eclipse.jetty.ee10.servlet.ServletHolder;
import org.eclipse.jetty.server.CustomRequestLog;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.util.resource.Resource;
import org.eclipse.jetty.util.resource.ResourceFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;

public class EventSourcingServer {

    private final Server server = new Server(9080);

    EventSourcingServer() {
        var handler = new ServletContextHandler();
        handler.addServlet(new ServletHolder(new HelloWorldServlet()), "/hello");
        handler.addServlet(new ServletHolder(new ResourceServlet()), "/*");


        var root = ResourceFactory.root();

        handler.setBaseResource(getWebJarResource("swagger-ui", root));
        server.setHandler(handler);
        server.setRequestLog(new CustomRequestLog());
    }

    @SneakyThrows
    private Resource getWebJarResource(String webjar, ResourceFactory resourceFactory) {
        var properties = new Properties();

        try (var stream = getClass().getClassLoader().getResourceAsStream("META-INF/maven/org.webjars/" + webjar + "/pom.properties")) {
            if (stream == null) {
                throw new IllegalArgumentException(webjar + " not found");
            }
            properties.load(stream);
            var version = properties.getProperty("version");
            return resourceFactory.newClassLoaderResource("/META-INF/resources/webjars/" + webjar + "/" + version);
        }
    }

    @SneakyThrows
    private Resource getProjectResource(String name, ResourceFactory resourceFactory) {
        var targetDir = Path.of("target", "classes").resolve(name);
        var url = getClass().getClassLoader().getResource(name);
        if (url == null) {
            throw new IllegalArgumentException("Not found in classpath: " + name);
        } else if (url.getProtocol().equals("file")) {
            var path = Paths.get(url.toURI());
            if (path.endsWith(targetDir)) {
                var projectDir = path;
                for (int i = 0; i < targetDir.getNameCount(); i++) {
                    projectDir = projectDir.getParent();
                }
                path = projectDir
                        .resolve(Path.of("src", "main", "resources"))
                        .resolve(name);
                if (Files.isDirectory(path)) {
                    return resourceFactory.newResource(path);
                }
            }
        }
        return resourceFactory.newResource(url);
    }

    private void start() throws Exception {
        server.start();
    }

    public static void main(String[] args) throws Exception {
        new EventSourcingServer().start();
    }
}
