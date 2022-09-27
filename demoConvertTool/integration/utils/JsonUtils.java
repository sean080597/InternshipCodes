package com.io.ktek.keno.integration.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;

public class JsonUtils {

    @SuppressWarnings("unchecked")
    public static <T> T getOneValueOf(ObjectNode data, ObjectNode config, String fieldId, Class<T> clazz) {
        try {
            JsonNode fieldValue = data.get(getTitleName(config, fieldId));
            if (fieldValue != null) {
                String value = fieldValue.get(0).get("value").asText();
                if (clazz.equals(String.class)) {
                    return (T) value;
                }
                if (clazz.equals(Integer.class)) {
                    return (T) ((Object) ((int) Double.parseDouble(value)));
                }
                if (clazz.equals(Double.class)) {
                    return (T) ((Object) (Double.parseDouble(value)));
                }
            }
        } catch (Exception e) {
            System.out.println("FielId " + fieldId + " is error data");
            e.printStackTrace();
        }
        return null;
    }

    public static String getTitleName(ObjectNode config, String fieldId) {
        return getValueConfig(config, ConfigName.FIELD_ID, fieldId, ConfigName.TITLE);
    }

    public static String getValueConfig(ObjectNode config, String iCnfName, String field, String oCnfName) {
        try {
            return config.get(iCnfName).get(field).get(oCnfName).asText();
        } catch (Exception e) {
            System.out.println(iCnfName + " " + field + " " + oCnfName);
            e.printStackTrace();
        }
        return null;
    }

    public static ArrayNode getAllValueOf(ObjectNode data, ObjectNode config, String fieldId) {
        return (ArrayNode) data.get(getTitleName(config, fieldId));
    }

    public static int indexOf(ArrayNode arr, ObjectNode node) {
        for (int i = 0; i < arr.size(); i++) {
            if (arr.get(i).equals(node)) {
                return i;
            }
        }
        return -1;
    }

    public static ArrayNode find(ArrayNode arr, int from, int to) {
        ObjectMapper objectMapper = new ObjectMapper();
        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (JsonNode node : arr) {
            ObjectNode obj = (ObjectNode) node;
            if (obj.get("from").asInt() >= from && obj.get("to").asInt() <= to) {
                arrayNode.add(obj);
            }
        }
        return arrayNode;
    }

    public static ObjectNode findOne(ArrayNode arr, int from, int to) {
        for (JsonNode node : arr) {
            ObjectNode obj = (ObjectNode) node;
            if (obj.get("from").asInt() >= from && obj.get("to").asInt() <= to) {
                return obj;
            }
        }
        return null;
    }

    public static ObjectNode findParent(ArrayNode arr, int from, int to) {
        for (JsonNode node : arr) {
            ObjectNode obj = (ObjectNode) node;
            if (obj.get("from").asInt() <= from && obj.get("to").asInt() >= to) {
                return obj;
            }
        }
        return null;
    }
}
