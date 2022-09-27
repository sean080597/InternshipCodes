package com.io.ktek.keno.integration.format;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.io.ktek.base.utils.NumberFormatUtil;

public class ShortMoneyFormat implements IFormat {

    @Override
    public String name() {
        return "toShortMoney";
    }

    @Override
    public String format(String value, ObjectNode config) {
        double number = Double.parseDouble(value);
        return NumberFormatUtil.getDoubleValueAsString(Math.floor(number) / 100.0D);
    }
}
