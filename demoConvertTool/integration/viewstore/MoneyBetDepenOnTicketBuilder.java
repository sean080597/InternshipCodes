package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;

import java.util.ArrayList;
import java.util.List;

public class MoneyBetDepenOnTicketBuilder implements IBuilder {

    @Override
    public String name() {
        return "buildMoneyBetDepenOnTicket";
    }

    @Override
    public void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData) {
        List<String> valueList = new ArrayList<>();
        int idx = 0;
        for (JsonNode v : values) {
            String money = v.get("value").asText();
            int from = v.get("from").asInt();
            int to = v.get("to").asInt();

            ArrayNode ticketBets = JsonUtils.getAllValueOf(data, config, FieldId.TICKET_BET);
            ObjectNode ticket = JsonUtils.findOne(ticketBets, from, to);
            assert ticket != null;
            String tb = (++idx + "|" + ticket.get("value").asText() + "|" + money);
            valueList.add(tb);
        }
        createValidate(config, title, respData, valueList.toArray(String[]::new));
    }
}
