package com.johannesbrodwall;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentDelta;
import org.openapitools.client.model.MessageToServer;

import java.io.IOException;
import java.util.function.Function;

class ApplicationJsonMapperModule extends SimpleModule {
    {
        addInterfaceDeserializer(MessageToServer.class, _ -> IncidentCommand.class);
        addInterfaceDeserializer(IncidentDelta.class, o -> IncidentDelta.getType(o.get("delta").asText()));
    }

    private <T> void addInterfaceDeserializer(Class<T> interfaceType, Function<ObjectNode, Class<? extends T>> typeLookup) {
        addDeserializer(interfaceType, new JsonDeserializer<T>() {
            @Override
            public T deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
                var mapper = (ObjectMapper) p.getCodec();
                ObjectNode rootNode = mapper.readTree(p);
                return mapper.treeToValue(rootNode, typeLookup.apply(rootNode));
            }
        });
    }
}
