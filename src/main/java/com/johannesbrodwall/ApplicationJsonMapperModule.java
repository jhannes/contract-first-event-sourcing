package com.johannesbrodwall;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.openapitools.client.model.CreateIncidentDelta;
import org.openapitools.client.model.IncidentCommand;
import org.openapitools.client.model.IncidentDelta;
import org.openapitools.client.model.MessageToServer;

import java.io.IOException;
import java.util.function.Function;

class ApplicationJsonMapperModule extends SimpleModule {
    {
        addInterfaceDeserializer(MessageToServer.class, _ -> IncidentCommand.class);
        addInterfaceDeserializer(IncidentDelta.class, _ -> CreateIncidentDelta.class);
    }

    private <T> void addInterfaceDeserializer(Class<T> interfaceType, Function<JsonParser, Class<? extends T>> typeLookup) {
        addDeserializer(interfaceType, new JsonDeserializer<T>() {
            @Override
            public T deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
                return p.readValueAs(typeLookup.apply(p));
            }
        });
    }
}
