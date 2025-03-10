package com.johannesbrodwall;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.openapitools.client.model.CreateIncident;
import org.openapitools.client.model.IncidentDelta;
import org.openapitools.client.model.MessageToServer;

import java.io.IOException;
import java.util.function.Function;

class ApplicationJsonMapperModule extends SimpleModule {
     public ApplicationJsonMapperModule() {
        addInterfaceDeserializer(MessageToServer.class, o -> MessageToServer.getType(o.get("type").asText()));
        addInterfaceDeserializer(IncidentDelta.class, o -> CreateIncident.class);
    }

    private <T> void addInterfaceDeserializer(Class<T> interfaceType, Function<ObjectNode, Class<? extends T>> typeLookup) {
        addDeserializer(interfaceType, new JsonDeserializer<>() {
            @Override
            public T deserialize(JsonParser p, DeserializationContext context) throws IOException {
                var mapper = (ObjectMapper) p.getCodec();
                ObjectNode rootNode = mapper.readTree(p);
                return mapper.treeToValue(rootNode, typeLookup.apply(rootNode));
            }
        });
    }
}
