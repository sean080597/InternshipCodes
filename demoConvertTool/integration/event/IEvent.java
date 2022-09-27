package com.io.ktek.keno.integration.event;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.viewstore.IBuilder;

import java.util.Map;

public interface IEvent {
    String eventName();

    void create(ObjectNode data, ObjectNode config, JsonNode userId, Map<String, IBuilder> builderMapper, ObjectNode scenario);
}
