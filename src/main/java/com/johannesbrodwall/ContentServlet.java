package com.johannesbrodwall;

import org.eclipse.jetty.ee10.servlet.ResourceServlet;
import org.eclipse.jetty.server.ResourceService;

import java.net.URL;

public class ContentServlet extends ResourceServlet {

    private final ResourceService resourceService = new ResourceService();

    public ContentServlet(URL resource) {

    }

}
