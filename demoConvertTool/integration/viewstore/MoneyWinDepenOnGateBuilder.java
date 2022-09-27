package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;

import java.util.ArrayList;
import java.util.List;

public class MoneyWinDepenOnGateBuilder implements IBuilder {

    @Override
    public String name() {
        return "buildMoneyWinDepenOnGate";
    }

    @Override
    public void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData) {
        List<String> valueList = new ArrayList<>();
        for (JsonNode v : values) {
            String money = v.get("value").asText();
            int from = v.get("from").asInt();
            int to = v.get("to").asInt();

            ArrayNode gateTypeBets = JsonUtils.getAllValueOf(data, config, FieldId.GATE_TYPE_BET);
            ObjectNode gateType = JsonUtils.findOne(gateTypeBets, from, to);
            String gb = gateType.get("value").asText() + ":" + money;
            valueList.add(gb);
        }
        createValidate(config, title, respData, valueList.toArray(String[]::new));
    }
}
