package com.io.ktek.keno.integration.format;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import com.io.ktek.keno.integration.utils.JsonUtils;

public class GateFormat implements IFormat {

    @Override
    public String name() {
        return "getGateCode";
    }

    @Override
    public String format(String value, ObjectNode config) {
        String code = JsonUtils.getValueConfig(config, ConfigName.GATE, value, ConfigName.GATE_CODE);
        return  String.valueOf((int)Double.parseDouble(code));
    }
}
