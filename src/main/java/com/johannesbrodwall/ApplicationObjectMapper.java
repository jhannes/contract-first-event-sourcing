package com.johannesbrodwall;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.openapitools.client.model.IncidentDelta;
import org.openapitools.client.model.MessageToServer;

import java.io.IOException;
import java.util.function.Function;

class ApplicationObjectMapper extends ObjectMapper {
    private static class ApplicationModule extends SimpleModule {
        ApplicationModule() {
            addInterfaceDeserializer(MessageToServer.class, o -> MessageToServer.getType(o.get("type").asText()));
            addInterfaceDeserializer(IncidentDelta.class, o -> IncidentDelta.getType(o.get("delta").asText()));
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

    public ApplicationObjectMapper() {
        setSerializationInclusion(JsonInclude.Include.NON_ABSENT);
        configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        registerModule(new JavaTimeModule());
        registerModule(new ApplicationModule());
    }
}
