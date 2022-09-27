package com.io.ktek.keno.integration.format;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.keno.integration.constant.ConfigName;
import com.io.ktek.keno.integration.utils.JsonUtils;

public class ActionFormat implements IFormat {

    @Override
    public String name() {
        return "getActionCode";
    }

    @Override
    public String format(String value, ObjectNode config) {
        return JsonUtils.getValueConfig(config, ConfigName.ACTION, value, ConfigName.ACTION_CODE);
    }
}
