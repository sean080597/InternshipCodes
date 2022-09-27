package com.io.ktek.keno.integration.format;

import com.fasterxml.jackson.databind.node.ObjectNode;

public class RemoveSpaceFormat implements IFormat {

    @Override
    public String name() {
        return "removeSpace";
    }

    @Override
    public String format(String value, ObjectNode config) {
        return value.replaceAll(" ", "");
    }
}
