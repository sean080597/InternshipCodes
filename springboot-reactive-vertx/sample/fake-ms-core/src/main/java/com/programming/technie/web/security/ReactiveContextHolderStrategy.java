package com.programming.technie.web.security;

import com.xyz.ms.web.security.XyzContext;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

import java.util.function.Function;

public class ReactiveContextHolderStrategy {

    public static final String XYZ_CONTEXT_KEY = "xyzContext";

    public static Mono<XyzContext> getXyzContext() {
        return Mono.deferContextual(Mono::just).filter(ctx -> ctx.hasKey(XYZ_CONTEXT_KEY)).map(ctx -> ctx.get(XYZ_CONTEXT_KEY));
    }

    public static void setXyzContext(XyzContext xyzContext) {
        getXyzContext().contextWrite(ctx -> ctx.put(XYZ_CONTEXT_KEY, xyzContext)).subscribe();
    }

    public static void unset() {
        getXyzContext().contextWrite(ctx -> ctx.delete(XYZ_CONTEXT_KEY)).subscribe();
    }
}
