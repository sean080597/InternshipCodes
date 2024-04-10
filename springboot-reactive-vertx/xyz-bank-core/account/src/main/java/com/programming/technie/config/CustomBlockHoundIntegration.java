package com.programming.technie.config;

import io.vertx.core.Vertx;
import reactor.blockhound.BlockHound;
import reactor.blockhound.integration.BlockHoundIntegration;

public class CustomBlockHoundIntegration implements BlockHoundIntegration {

    @Override
    public void applyTo(BlockHound.Builder builder) {
        builder.allowBlockingCallsInside(Vertx.class.getName(), "executeBlocking");
    }
}
