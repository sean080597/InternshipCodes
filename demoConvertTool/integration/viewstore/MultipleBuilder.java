package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import org.apache.logging.log4j.util.Strings;

import java.util.ArrayList;
import java.util.List;

public class MultipleBuilder implements IBuilder {

    @Override
    public String name() {
        return "buildMultiple";
    }

    @Override
    public void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData) {
        List<String> valueList = new ArrayList<>();
        for (JsonNode node : values) {
            valueList.add(node.get("value").asText());
        }
        createValidate(config, title, respData, valueList.toArray(String[]::new));
    }
}
