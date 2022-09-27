package com.io.ktek.keno.integration.viewstore;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import org.apache.logging.log4j.util.Strings;

public interface IBuilder {
    String name();

    void build(JsonNode userId, String title, ArrayNode values, ObjectNode data, ObjectNode config, ObjectNode respData);

    default void createValidate(ObjectNode config, String title, ObjectNode respData, String... values) {
        ObjectNode validate = null;

        JsonNode objConfig = config.get(ConfigName.TITLE).get(title);
        String fieldName = objConfig.get(ConfigName.FIELD_NAME).asText();
        String validateType = objConfig.get(ConfigName.VALIDATE_TYPE).asText();

        String[] tmp = validateType.split("\\|");
        String type = tmp[0];
        String param = Strings.EMPTY;
        if (tmp.length > 1) {
            param = tmp[1];
        }

        switch (type) {
            case "RegEx":
                validate = regExType(param, values);
                break;
            case "FixAllContains":
            case "FixContains":
            case "FixStartContains":
            case "FixEqualContains":
            case "ScoreMatcher":
                validate = constainsMatcher(type, param, String.join(param, values));
                break;
            case "Equals":
                switch (param) {
                    case "Int":
                        respData.put(fieldName, (int) Double.parseDouble(values[0]));
                        break;
                    case "String":
                        respData.put(fieldName, String.join(",", values));
                        break;
                }
                break;
        }

        if (validate != null) {
            if (respData.has(fieldName)) {
                ObjectMapper objectMapper = new ObjectMapper();
                ArrayNode validates = objectMapper.createArrayNode();
                validates.add(respData.get(fieldName));
                validates.add(validate);
                respData.set(fieldName, multipleValidate(validates));
            } else {
                respData.set(fieldName, validate);
            }
        }
    }

    default ObjectNode regExType(String pattern, String... values) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        String regExValue = Strings.EMPTY;
        for (String v : values) {
            regExValue = pattern.replace("value", v);
        }
        objectNode.put("_type_", "RegEx");
        objectNode.put("value", regExValue);
        return objectNode;
    }

    default ObjectNode constainsMatcher(String type, String delimiter, String value) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("_type_", type);
        objectNode.put("delimiter", delimiter);
        objectNode.put("value", value);
        return objectNode;
    }

    default ObjectNode multipleValidate(ArrayNode validates) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("_type_", "MultipleValidate");
        objectNode.set("values", validates);
        return objectNode;
    }
}
