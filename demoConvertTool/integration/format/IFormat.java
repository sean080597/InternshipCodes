package com.io.ktek.keno.integration.format;

import com.fasterxml.jackson.databind.node.ObjectNode;

public interface IFormat {
    String name();
    String format(String value, ObjectNode config);
}
