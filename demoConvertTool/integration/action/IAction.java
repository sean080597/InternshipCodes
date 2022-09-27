package com.io.ktek.keno.integration.action;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface IAction {
    String name();

    void handle(ObjectNode action, ObjectNode data, ObjectNode config, ObjectNode scenario);

    default ObjectNode findScenariosOfUserId(ArrayNode arr, String userId) {
        for (JsonNode node : arr) {
            ObjectNode obj = (ObjectNode) node;
            if (obj.get("userId").asText().equals(userId)) {
                return obj;
            }
        }
        return null;
    }
}
