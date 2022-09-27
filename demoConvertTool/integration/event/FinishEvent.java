package com.io.ktek.keno.integration.event;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;
import com.io.ktek.keno.integration.viewstore.IBuilder;

import java.util.Iterator;
import java.util.Map;

public class FinishEvent implements IEvent{
    @Override
    public String eventName() {
        return "pfe";
    }

    @Override
    public void create(ObjectNode data, ObjectNode config, JsonNode userId, Map<String, IBuilder> builderMapper, ObjectNode scenario) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode eventInCondition = objectMapper.createObjectNode();
        eventInCondition.put("name", eventName());

        ObjectNode decision = objectMapper.createObjectNode();
        decision.put("name", "WAIT");
        decision.put("value", "DROP");
        eventInCondition.set("decision", decision);

        ObjectNode eventValue = objectMapper.createObjectNode();
        eventValue.put("privateData", true);

        ObjectNode rootRespData = objectMapper.createObjectNode();

        ObjectNode respData = objectMapper.createObjectNode();

        rootRespData.set("data", respData);
        eventValue.set("data", rootRespData);
        eventInCondition.set("value", eventValue);

        boolean hasEvent = false;
        Iterator<String> titles = data.fieldNames();
        while (titles.hasNext()) {
            String title = titles.next();
            String builder = JsonUtils.getValueConfig(config, ConfigName.TITLE, title, ConfigName.BUIL_DATA_RESPONSE);
            String event = JsonUtils.getValueConfig(config, ConfigName.TITLE, title, ConfigName.EVENT_RESPONSE);
            if (!"none".equals(builder) && data.get(title) != null && eventName().equals(event)) {
                ArrayNode values = JsonUtils.find((ArrayNode) data.get(title), userId.get("from").asInt(), userId.get("to").asInt());
                if (values != null && values.size() > 0) {
                    try {
                        builderMapper.get(builder).build(userId, title, values, data, config, respData);
                    } catch (Exception e) {
                        System.out.println("Builder: " + builder + " is not existed");
                        throw e;
                    }
                    hasEvent = true;
                }
            }
        }
        if (hasEvent) {
            ArrayNode privateChannel = (ArrayNode) scenario.get("privateChannel");
            for (JsonNode node : privateChannel) {
                String user = JsonUtils.getValueConfig(config, ConfigName.FIELD_ID, FieldId.USER, ConfigName.FIELD_NAME);
                if (node.get(user).equals(userId.get("value"))) {
                    ObjectNode userScenarios = (ObjectNode) node;
                    ObjectNode pfeSceanrio = objectMapper.createObjectNode();
                    pfeSceanrio.set("eventInCondition", eventInCondition);
                    ((ArrayNode) userScenarios.get("scenarioActions")).add(pfeSceanrio);
                    break;
                }
            }
        }
    }

}
