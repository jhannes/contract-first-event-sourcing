package com.johannesbrodwall.infrastructure;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.eclipse.jetty.http.CompressedContentFormat;
import org.eclipse.jetty.http.MimeTypes;
import org.eclipse.jetty.server.ResourceContentFactory;
import org.eclipse.jetty.server.ResourceService;
import org.eclipse.jetty.util.resource.Resource;

import java.io.IOException;
import java.util.Properties;

public class WebjarServlet extends HttpServlet {
    private final ResourceService resourceService = new ResourceService();

    @SneakyThrows
    public WebjarServlet(String path) {
        var properties = new Properties();
        try (var pomProperties = Resource.newClassPathResource("META-INF/maven/org.webjars/swagger-ui/pom.properties")) {
            try (var inputStream = pomProperties.getInputStream()) {
                properties.load(inputStream);
            }
        }
        var resource = Resource.newClassPathResource("META-INF/resources/webjars/" + path + "/" + properties.getProperty("version"));
        resourceService.setContentFactory(new ResourceContentFactory(resource, new MimeTypes(), new CompressedContentFormat[0]));
        resourceService.setPathInfoOnly(true);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resourceService.doGet(req, resp);
    }
}
