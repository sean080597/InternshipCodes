package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class SingleBuilder implements IBuilder {

    @Override
    public String name() {
        return "buildSingle";
    }

    @Override
    public void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData) {
        String value = values.get(0).get("value").asText();
        createValidate(config, title, respData, value);
    }
}
