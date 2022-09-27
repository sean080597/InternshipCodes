package com.io.ktek.keno.integration.convert;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.action.IAction;
import com.io.ktek.keno.integration.constant.ConfigName;
import com.io.ktek.keno.integration.constant.FieldId;
import com.io.ktek.keno.integration.event.IEvent;
import com.io.ktek.keno.integration.format.IFormat;
import com.io.ktek.keno.integration.utils.JsonUtils;
import com.io.ktek.keno.integration.viewstore.IBuilder;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.util.Strings;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONException;
import org.junit.Test;
import org.reflections.Reflections;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class ExcellToJson {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, IFormat> formatMapper = new HashMap<>();
    private final Map<String, IAction> actionMapper = new HashMap<>();
    private final Map<String, IBuilder> builderMapper = new HashMap<>();
    private final Map<String, IEvent> eventMapper = new HashMap<>();

    @SneakyThrows
    public void convert(String inputPath, String outputPath) {
        File excelFile = new File(inputPath);
        Reflections iformats = new Reflections("com.io.ktek.keno.integration.format");
        for (Class<? extends IFormat> iformat : iformats.getSubTypesOf(IFormat.class)) {
            IFormat format = iformat.newInstance();
            formatMapper.put(format.name(), format);
        }

        Reflections iCollections = new Reflections("com.io.ktek.keno.integration.action");
        for (Class<? extends IAction> iCollect : iCollections.getSubTypesOf(IAction.class)) {
            IAction collection = iCollect.newInstance();
            actionMapper.put(collection.name(), collection);
        }

        Reflections iBuilders = new Reflections("com.io.ktek.keno.integration.viewstore");
        for (Class<? extends IBuilder> iBuilder : iBuilders.getSubTypesOf(IBuilder.class)) {
            IBuilder builder = iBuilder.newInstance();
            builderMapper.put(builder.name(), builder);
        }

        Reflections events = new Reflections("com.io.ktek.keno.integration.event");
        for (Class<? extends IEvent> iEvent : events.getSubTypesOf(IEvent.class)) {
            IEvent event = iEvent.newInstance();
            eventMapper.put(event.eventName(), event);
        }

        readExcellFile(excelFile, outputPath);
    }

    @SneakyThrows
    private void readExcellFile(File excelFile, String outputPath) {
        try (Workbook workbook = new XSSFWorkbook(excelFile)) {
            ObjectNode config = getConfig(workbook);
            readScenarios(workbook, config, outputPath);
        }
    }

    private ObjectNode getConfig(Workbook workbook) {
        // Load data config from excell
        ObjectNode data = objectMapper.createObjectNode();
        Sheet sheet = workbook.getSheet("config");
        Iterator<Row> rowIter = sheet.rowIterator();
        Row header = rowIter.next();

        Map<String, Integer> titleMapper = new HashMap<>();
        for (Cell cell : header) {
            if (StringUtils.isNotBlank(cell.toString())) {
                String title = cell.toString().trim();
                int index = titleMapper.size();
                titleMapper.put(title, index);
                ArrayNode arr = objectMapper.createArrayNode();
                data.set(title, arr);
            } else {
                break;
            }
        }

        boolean isFinish = false;
        while (rowIter.hasNext() && !isFinish) {
            Row row = rowIter.next();
            int amtBlank = 0;

            for (Map.Entry<String, Integer> entry : titleMapper.entrySet()) {
                String title = entry.getKey();
                int index = entry.getValue();
                if (row.getCell(index) == null || StringUtils.isBlank(row.getCell(index).toString())) {
                    amtBlank++;
                } else {
                    String value = row.getCell(index).toString().trim();
                    ((ArrayNode) data.get(title)).add(value);
                }
            }
            if (amtBlank == titleMapper.size()) {
                isFinish = true;
            }
        }

        // mapping data to config
        ObjectNode config = objectMapper.createObjectNode();
        ArrayNode mappingKey = (ArrayNode) data.get("MappingKey");
        ArrayNode mappingValue = (ArrayNode) data.get("MappingValue");
        int size = mappingKey.size();

        for (int i = 0; i < size; i++) {
            String key = mappingKey.get(i).asText();
            String[] values = mappingValue.get(i).asText().trim().split("\\|");
            int length = data.get(key).size();

            ObjectNode node = objectMapper.createObjectNode();
            for (int j = 0; j < length; j++) {
                ObjectNode vaule = objectMapper.createObjectNode();
                for (String field : values) {
                    vaule.put(field, data.get(field).get(j).asText());
                }
                node.set(data.get(key).get(j).asText(), vaule);
            }
            config.set(key, node);
        }
        return config;
    }

    private void readScenarios(Workbook workbook, ObjectNode config, String outputPath) {
        Iterator<Sheet> sheetIter = workbook.sheetIterator();
        AtomicInteger scenarioId = new AtomicInteger(0);
        while (sheetIter.hasNext()) {
            Sheet sheet = sheetIter.next();
            if ("config".equals(sheet.getSheetName())) {
                continue;
            }
            ArrayNode scenarios = createScenario(scenarioId, sheet, config);
            exportSceanrio(outputPath, sheet.getSheetName(), scenarios);
        }
    }

    private void exportSceanrio(String storage, String fileName, ArrayNode data) {
        BufferedWriter writer;
        try {
            String path = storage + "/" + fileName + ".json";
            writer = new BufferedWriter(new FileWriter(path, false));
            writer.append(data.toString());
            writer.close();
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
    }

    private ArrayNode createScenario(AtomicInteger scenarioId, Sheet sheet, ObjectNode config) {
        // Load data config from excell
        Iterator<Row> rowIter = sheet.rowIterator();
        Row header = rowIter.next();

        Map<String, Integer> titleMapper = new HashMap<>();
        for (Cell cell : header) {
            if (StringUtils.isNotBlank(cell.toString())) {
                String title = cell.toString().trim();
                int index = titleMapper.size();
                titleMapper.put(title, index);
            } else {
                break;
            }
        }

        boolean isFinish = false;

        ArrayNode data = objectMapper.createArrayNode();

        while (rowIter.hasNext() && !isFinish) {
            Row row = rowIter.next();
            int amtBlank = 0;
            String titleNo = JsonUtils.getTitleName(config, FieldId.INDEX);
            Integer no = titleMapper.get(titleNo);

            if (row.getCell(no) != null && StringUtils.isNotBlank(row.getCell(no).toString())) {
                ObjectNode root = objectMapper.createObjectNode();
                data.add(root);
            }

            ObjectNode obj = (ObjectNode) data.get(data.size() - 1);
            for (Map.Entry<String, Integer> entry : titleMapper.entrySet()) {
                String title = entry.getKey();
                int index = entry.getValue();
                if (!obj.has(title)) {
                    obj.set(title, objectMapper.createArrayNode());
                }

                if (row.getCell(index) != null && StringUtils.isNotBlank(row.getCell(index).toString())) {
                    if (title.equals(titleNo)) {
                        String value = row.getCell(index).toString().trim();
                        ((ArrayNode) obj.get(title)).add(String.valueOf((int) (Double.parseDouble(value))));
                    } else {
                        String value = row.getCell(index).toString().trim();
                        ((ArrayNode) obj.get(title)).add(value);
                    }
                } else {
                    amtBlank++;
                    ((ArrayNode) obj.get(title)).add(Strings.EMPTY);
                }
            }
            if (amtBlank == titleMapper.size()) {
                isFinish = true;
            }
        }

        // build scenarios
        ArrayNode scenarios = objectMapper.createArrayNode();
        for (JsonNode obj : data) {
            scenarioId.incrementAndGet();
            ObjectNode scenario = buildScenario(scenarioId, (ObjectNode) obj, config, sheet.getSheetName());
            scenarios.add(scenario);
        }
        return scenarios;
    }

    private ObjectNode buildScenario(AtomicInteger scenarioId, ObjectNode data, ObjectNode config, String sheetName) {
        formatData(data, config);
        ObjectNode cData = collapseData(data, config);
        return collectData(scenarioId, cData, config, sheetName);
    }

    private void formatData(ObjectNode data, ObjectNode config) {
        Iterator<String> fieldItor = data.fieldNames();
        while (fieldItor.hasNext()) {
            String field = fieldItor.next();
            try {
                String format = JsonUtils.getValueConfig(config, ConfigName.TITLE, field, ConfigName.VALUE_CONVERT);
                if (!"none".equals(format)) {
                    ArrayNode arr = (ArrayNode) data.get(field);
                    ArrayNode fArr = objectMapper.createArrayNode();
                    for (JsonNode v : arr) {
                        if (StringUtils.isNotBlank(v.asText())) {
                            String value = formatMapper.get(format).format(v.asText(), config);
                            fArr.add(value);
                        } else {
                            fArr.add(Strings.EMPTY);
                        }
                    }
                    data.set(field, fArr);
                }
            } catch (Exception e) {
                System.out.println(field);
                e.printStackTrace();
            }
        }
    }

    private ObjectNode collapseData(ObjectNode data, ObjectNode config) {
        Iterator<String> fieldItor = data.fieldNames();
        ObjectNode cData = objectMapper.createObjectNode();
        while (fieldItor.hasNext()) {
            String field = fieldItor.next();
            ArrayNode arr = (ArrayNode) data.get(field);
            ArrayNode cArr = objectMapper.createArrayNode();

            for (int i = 0; i < arr.size(); i++) {
                if(StringUtils.isBlank(arr.get(i).asText()) && cArr.size() < 1){
                    continue;
                }
                if (StringUtils.isNotBlank(arr.get(i).asText())) {
                    ObjectNode obj = objectMapper.createObjectNode();
                    obj.put("value", arr.get(i).asText());
                    obj.put("from", i);
                    obj.put("to", i);
                    cArr.add(obj);
                }

                String isMergeCell = JsonUtils.getValueConfig(config, ConfigName.TITLE, field, ConfigName.IS_MERGE_CELL);
                if (isMergeCell != null && Boolean.parseBoolean(isMergeCell.trim())) {
                    if((i == arr.size() - 1) || (StringUtils.isBlank(arr.get(i).asText()) && StringUtils.isNotBlank(arr.get(i + 1).asText()))){
                        ObjectNode obj = (ObjectNode) cArr.get(cArr.size() - 1);
                        obj.put("to", i);
                    }
                }
            }

            if(cArr.size() > 0) cData.set(field, cArr);
        }
        return cData;
    }

    private ObjectNode collectData(AtomicInteger scenarioId, ObjectNode data, ObjectNode config, String sheetName) {
        // Init scenario
        ObjectNode scenario = objectMapper.createObjectNode();
        scenario.put("index", scenarioId.get());
        String description = JsonUtils.getOneValueOf(data, config, FieldId.DESCRIPTION, String.class);
        String serviceId = JsonUtils.getValueConfig(config, ConfigName.CONFIG_KEY, "serviceId", ConfigName.CONFIG_VALUE);
        String tableId = JsonUtils.getValueConfig(config, ConfigName.CONFIG_KEY, "tableId", ConfigName.CONFIG_VALUE);
        String testDuration = JsonUtils.getValueConfig(config, ConfigName.CONFIG_KEY, "testDuration", ConfigName.CONFIG_VALUE);
        String walletVersion = JsonUtils.getValueConfig(config, ConfigName.CONFIG_KEY, "walletVersion", ConfigName.CONFIG_VALUE);


        if (StringUtils.isNotBlank(description)) {
            scenario.put("name", description);
            scenario.put("_description_", description);
        } else {
            scenario.put("name", sheetName);
            scenario.put("_description_", sheetName);
        }
        scenario.put("serviceId", serviceId);
        scenario.put("testDuration", (int) Double.parseDouble(testDuration));
        scenario.put("walletVersion", walletVersion);

        // Init private channel
        scenario.set("privateChannel", objectMapper.createArrayNode());

        // Init present channel
        ObjectNode presentChannel = objectMapper.createObjectNode();
        presentChannel.put("tableId", tableId);
        presentChannel.set("scenarioActions", objectMapper.createArrayNode());
        scenario.set("presentChannel", presentChannel);

        // build input data
        ArrayNode actions = JsonUtils.getAllValueOf(data, config, FieldId.ACTION);
        for (JsonNode action : actions) {
            String act = action.get("value").asText();
            String handle = JsonUtils.getValueConfig(config, ConfigName.ACTION_CODE, act, ConfigName.HANDLE);
            if (!"none".equals(handle)) {
                actionMapper.get(handle).handle((ObjectNode) action, data, config, scenario);
            }
        }

        // build response data
        ArrayNode userIds = JsonUtils.getAllValueOf(data, config, FieldId.USER);
        for (JsonNode userId : userIds) {
            eventMapper.forEach((event, instance) -> instance.create(data, config, userId, builderMapper, scenario));
        }

        return scenario;
    }
}
