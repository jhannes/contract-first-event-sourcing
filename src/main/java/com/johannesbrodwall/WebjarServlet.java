package com.johannesbrodwall;

import lombok.SneakyThrows;
import org.eclipse.jetty.ee10.servlet.ResourceServlet;
import org.eclipse.jetty.server.ResourceService;

public class WebjarServlet extends ResourceServlet {
    private final ResourceService resourceService = new ResourceService();

    @SneakyThrows
    public WebjarServlet(String path) {
        /*
        var properties = new Properties();
        try (var pomProperties = Resource.newClassPathResource("META-INF/maven/org.webjars/swagger-ui/pom.properties")) {
            try (var inputStream = pomProperties.getInputStream()) {
                properties.load(inputStream);
            }
        }
        var resource = Resource.newClassPathResource("META-INF/resources/webjars/" + path + "/" + properties.getProperty("version"));
        resourceService.setContentFactory(new ResourceContentFactory(resource, new MimeTypes(), new CompressedContentFormat[0]));
        resourceService.setPathInfoOnly(true);

         */
    }
}
