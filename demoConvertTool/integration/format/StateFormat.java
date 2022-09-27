package com.io.ktek.keno.integration.format;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import com.io.ktek.keno.integration.utils.JsonUtils;

public class StateFormat implements IFormat {

    @Override
    public String name() {
        return "getStateCode";
    }

    @Override
    public String format(String value, ObjectNode config) {
        String code = JsonUtils.getValueConfig(config, ConfigName.STATE, value, ConfigName.STATE_CODE);
        return String.valueOf((int) Double.parseDouble(code));
    }
}
