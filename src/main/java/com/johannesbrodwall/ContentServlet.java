package com.johannesbrodwall;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.eclipse.jetty.http.CompressedContentFormat;
import org.eclipse.jetty.http.MimeTypes;
import org.eclipse.jetty.server.ResourceContentFactory;
import org.eclipse.jetty.server.ResourceService;
import org.eclipse.jetty.util.resource.Resource;

import java.io.IOException;

public class ContentServlet extends HttpServlet {

    private final ResourceService resourceService = new ResourceService();

    public ContentServlet() {
        resourceService.setContentFactory(new ResourceContentFactory(Resource.newClassPathResource("webapp"), new MimeTypes(), new CompressedContentFormat[0]));
        resourceService.setWelcomeFactory(pathInContext -> pathInContext + "index.html");
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resourceService.doGet(req, resp);
    }
}
