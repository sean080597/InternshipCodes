package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;

import java.util.ArrayList;
import java.util.List;

public class MoneyWinDepenOnTicketBuilder implements IBuilder {

    @Override
    public String name() {
        return "buildMoneyWinDepenOnTicket";
    }

    @Override
    public void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData) {
        List<String> valueList = new ArrayList<>();
        for (JsonNode v : values) {
            String money = v.get("value").asText();
            int from = v.get("from").asInt();
            int to = v.get("to").asInt();

            ArrayNode ticketBets = JsonUtils.getAllValueOf(data, config, FieldId.TICKET_BET);
            ArrayNode filteredByUserId = new ObjectMapper().createArrayNode();
            for(JsonNode node : ticketBets){
                if(node.get("from").asInt() >= userId.get("from").asInt() && node.get("to").asInt() <= userId.get("to").asInt()){
                    filteredByUserId.add(node);
                }
            }
            ObjectNode ticket = JsonUtils.findOne(filteredByUserId, from, to);
            String tb = (JsonUtils.indexOf(filteredByUserId, ticket) + 1) + ":" + money;
            valueList.add(tb);
        }
        createValidate(config, title, respData, valueList.toArray(String[]::new));
    }
}
