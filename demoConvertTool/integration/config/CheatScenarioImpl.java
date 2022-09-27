package com.io.ktek.keno.integration.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.io.ktek.base.logstash.LogsUtils;
import com.io.ktek.base.manager.RoomManager;
import com.io.ktek.base.model.lobby.TableGroup;
import com.io.ktek.base.model.table.BaseTable;
import com.io.ktek.integrationtest.cheat.ICheatScenario;
import com.io.ktek.keno.config.model.KenoGameConfigInfo;
import com.io.ktek.keno.model.ball.Symbol;
import com.io.ktek.keno.model.table.Table;
import com.io.ktek.keno.testingtool.dto.UpdateResultDTO;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
public class CheatScenarioImpl implements ICheatScenario {

    @Autowired
    private RoomManager roomManager;

    @Autowired
    private KenoGameConfigInfo configInfo;

    private ObjectMapper objectMapper = new ObjectMapper();

    @SneakyThrows
    @Override
    public boolean setupCheatScenario(String s) {
        UpdateResultDTO updateResultDTO = objectMapper.readValue(s, UpdateResultDTO.class);
        if (CollectionUtils.isEmpty(updateResultDTO.getResults())
                || updateResultDTO.getResults().size() > configInfo.getMaxBall()) {
            log.error("Wrong data!");
            return false;
        }

        Optional<BaseTable> tableOptional;

        if (StringUtils.isEmpty(updateResultDTO.getTableId())) {
            TableGroup tableGroup = roomManager.findCommonTableGroup();
            if (tableGroup == null) {
                log.error("Can not find table group common!");
                return false;
            }

            tableOptional = tableGroup.findAvailableTable();
            if (tableOptional.isEmpty()) {
                log.error("Can not find available table!");
                return false;
            }
        } else {
            tableOptional = roomManager.findTableBy(updateResultDTO.getTableId());
            if (tableOptional.isEmpty()) {
                log.error("Wrong tableId!");
                return false;
            }
        }

        Table table = (Table) tableOptional.get();

        List<Symbol> symbols = new ArrayList<>();
        for (Integer type : updateResultDTO.getResults()) {
            Optional<Symbol> symbolOptional = configInfo.findSymbol(type);
            if (symbolOptional.isEmpty()) {
                log.error("Wrong data!");
                return false;
            }

            symbols.add(symbolOptional.get());
        }

        LogsUtils.builder()
                .actorId(table.getId())
                .type(LogsUtils.TYPE_SYSTEM)
                .serviceId(table.getConfigInfo().getGameId())
                .stateName("TestingToolEndpoint.updateResult")
                .stepName("setResult")
                .owner(LogsUtils.TYPE_SYSTEM)
                .build()
                .writeLogInfo("TestingToolEndpoint updateResult");

        table.setEnableTestingTool(true);
        table.setTestSymbols(symbols);

        return true;
    }
}
