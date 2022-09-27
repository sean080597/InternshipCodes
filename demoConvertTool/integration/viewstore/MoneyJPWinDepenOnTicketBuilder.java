package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;

import java.util.ArrayList;
import java.util.List;

public class MoneyJPWinDepenOnTicketBuilder implements IBuilder {

    @Override
    public String name() {
        return "buildMoneyJPWinDepenOnTicket";
    }

    @Override
    public void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData) {
        List<String> valueList = new ArrayList<>();
        for (JsonNode v : values) {
            String money = v.get("value").asText();
            int from = v.get("from").asInt();
            int to = v.get("to").asInt();

            ArrayNode ticketBets = JsonUtils.getAllValueOf(data, config, FieldId.NUMBER_PLAYER_WIN);
            ObjectNode ticket = JsonUtils.findOne(ticketBets, from, to);
            assert ticket != null;
            String ticketVal = ticket.get("value").asText();
            String tb = ticketVal.split(",").length + ":" + money;
            valueList.add(tb);
        }
        createValidate(config, title, respData, valueList.toArray(String[]::new));
    }
}
