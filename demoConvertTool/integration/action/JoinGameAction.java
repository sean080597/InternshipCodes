package com.io.ktek.keno.integration.action;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.utils.JsonUtils;
import org.apache.logging.log4j.util.Strings;
import org.junit.platform.commons.util.StringUtils;

import java.util.Arrays;
import java.util.UUID;

public class JoinGameAction implements IAction {

    @Override
    public String name() {
        return "createJoinGame";
    }

    @Override
    public void handle(ObjectNode action, ObjectNode data, ObjectNode config, ObjectNode scenario) {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode privateChannel = (ArrayNode) scenario.get("privateChannel");
        ObjectNode root = objectMapper.createObjectNode();

        String userTitle = JsonUtils.getTitleName(config, FieldId.USER);
        ObjectNode userIdNode = JsonUtils.findParent((ArrayNode) data.get(userTitle), action.get("from").asInt(), action.get("to").asInt());

        String userId = userIdNode.get("value").asText();

        if (StringUtils.isBlank(userId)) {
            throw new RuntimeException("UserId must not be blank");
        }

        String userMoneyTitle = JsonUtils.getTitleName(config, FieldId.USER_MONEY);

        ObjectNode userMoney = JsonUtils.findParent((ArrayNode) data.get(userMoneyTitle), action.get("from").asInt(), action.get("to").asInt());
        int mainBalance = (int) Double.parseDouble(userMoney.get("value").asText());
        String tableId = JsonUtils.getValueConfig(config, ConfigName.CONFIG_KEY, "tableId", ConfigName.CONFIG_VALUE);
        root.put("userId", userId);
        root.put("tableId", tableId);
        root.put("mainBalance", mainBalance);

        ArrayNode scenarioActions = objectMapper.createArrayNode();

        ObjectNode joinGame = objectMapper.createObjectNode();
        joinGame.put("action", "joinGame");

        ObjectNode input = objectMapper.createObjectNode();
        input.put("env", 0);
        input.put("commandId", UUID.randomUUID().toString());
        input.put("userId", userId);

        ObjectNode userDetail = objectMapper.createObjectNode();
        userDetail.put("money", mainBalance);
        userDetail.put("extraMoney", mainBalance);
        userDetail.put("displayName", "display-" + userId);
        userDetail.put("fullname", "full-" + userId);
        userDetail.put("email", userId + "@gmail.com");
        userDetail.put("userType", "USER");
        userDetail.put("userAgent", "client1");
        userDetail.put("externalId", String.valueOf(userId.hashCode()));

        input.set("userDetail", userDetail);
        joinGame.set("input", input);
        scenarioActions.add(joinGame);

        // create cheat data
        String cheatData = JsonUtils.getOneValueOf(data, config, FieldId.CHEAT, String.class);
        if (Strings.isNotBlank(cheatData)) {
            ArrayNode numbers = objectMapper.createArrayNode();
            Arrays.stream(cheatData.split(",")).map(String::trim).mapToInt(Integer::parseInt).forEach(numbers::add);

            ObjectNode cheat = objectMapper.createObjectNode();
            cheat.put("action", "cheat");
            ObjectNode cheatInput = objectMapper.createObjectNode();
            cheatInput.put("tableId", tableId);
            cheatInput.set("results", numbers);
            cheat.set("input", cheatInput);

            scenarioActions.add(cheat);
            String cheatTitle = JsonUtils.getTitleName(config, FieldId.CHEAT);
            data.remove(cheatTitle);
        }

        root.set("scenarioActions", scenarioActions);
        privateChannel.add(root);
    }
}
