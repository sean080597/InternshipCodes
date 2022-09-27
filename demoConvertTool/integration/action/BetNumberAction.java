package com.io.ktek.keno.integration.action;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;
import org.junit.platform.commons.util.StringUtils;

import java.util.Arrays;
import java.util.UUID;

public class BetNumberAction implements IAction {

    @Override
    public String name() {
        return "createBetNumber";
    }

    @Override
    public void handle(ObjectNode action, ObjectNode data, ObjectNode config, ObjectNode scenario) {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode privateChannel = (ArrayNode) scenario.get("privateChannel");
        ArrayNode values = JsonUtils.getAllValueOf(data, config, FieldId.NUMBER_TICKET);

        String betAmountTitle = JsonUtils.getTitleName(config, FieldId.BET_AMOUNT);
        String actionTitle = JsonUtils.getTitleName(config, FieldId.ACTION);
        String userTitle = JsonUtils.getTitleName(config, FieldId.USER);

        if (StringUtils.isBlank(betAmountTitle) || StringUtils.isBlank(actionTitle)) {
            throw new RuntimeException("Can not create bet number");
        }

        ArrayNode amounts = (ArrayNode) data.get(betAmountTitle);

        int aFrom = action.get("from").asInt();
        int aTo = action.get("to").asInt();
        ArrayNode numbers = JsonUtils.find(values, aFrom, aTo);
        int index = 1;
        ArrayNode bettingDetails = objectMapper.createArrayNode();
        for (JsonNode no2 : numbers) {
            ObjectNode number = (ObjectNode) no2;
            ObjectNode amount = JsonUtils.findOne(amounts, number.get("from").asInt(), number.get("to").asInt());

            ArrayNode nums = objectMapper.createArrayNode();
            Arrays.stream(number.get("value").asText().split(","))
                    .mapToInt(i -> Integer.parseInt(i.trim()))
                    .forEach(nums::add);

            ObjectNode obj = objectMapper.createObjectNode();
            obj.put("index", index++);
            obj.put("betAmount", amount.get("value").asInt());
            obj.set("numbers", nums);
            obj.put("save", true);
            bettingDetails.add(obj);
        }
        ObjectNode user = JsonUtils.findParent((ArrayNode) data.get(userTitle), aFrom, aTo);
        String userId = user.get("value").asText();
        ObjectNode betNumber = objectMapper.createObjectNode();
        betNumber.put("action", "betNumber");

        ObjectNode input = objectMapper.createObjectNode();
        input.put("commandId", UUID.randomUUID().toString());
        input.put("userId", userId);
        input.set("bettingDetails", bettingDetails);
        input.put("gn", "#000000");

        betNumber.set("input", input);

        ObjectNode stateInCondition = objectMapper.createObjectNode();
        ObjectNode decision = objectMapper.createObjectNode();
        decision.put("name", "WAIT");

        stateInCondition.set("decision", decision);
        stateInCondition.put("name", "BETTING");

        betNumber.set("stateInCondition", stateInCondition);

        ObjectNode userScenarios = findScenariosOfUserId(privateChannel, userId);
        ((ArrayNode) userScenarios.get("scenarioActions")).add(betNumber);
    }

}
