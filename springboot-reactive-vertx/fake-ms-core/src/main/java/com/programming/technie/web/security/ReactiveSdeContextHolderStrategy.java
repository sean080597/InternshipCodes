package com.programming.technie.web.security;

import com.sde.modelsuite.web.security.SdeContext;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

import java.util.function.Function;

public class ReactiveSdeContextHolderStrategy {

    public static final String SDE_CONTEXT_KEY = "sdeContext";

    public static Mono<SdeContext> getSdeContext() {
        return Mono.deferContextual(Mono::just).filter(ctx -> ctx.hasKey(SDE_CONTEXT_KEY)).map(ctx -> ctx.get(SDE_CONTEXT_KEY));
    }

    public static void setSdeContext(SdeContext sdeContext) {
        getSdeContext().contextWrite(ctx -> ctx.put(SDE_CONTEXT_KEY, sdeContext)).subscribe();
    }

    public static void unset() {
        getSdeContext().contextWrite(ctx -> ctx.delete(SDE_CONTEXT_KEY)).subscribe();
    }

//    public static void setSdeContext(SdeContext ctx) {
//        Mono.deferContextual(context -> context.get(SDE_CONTEXT_KEY)).contextWrite(context -> context.put(SDE_CONTEXT_KEY, ctx));
//    }
//
//    public static void unset() {
//        Mono.deferContextual(context -> context.get(SDE_CONTEXT_KEY)).contextWrite(context -> context.delete(SDE_CONTEXT_KEY));
//    }

//    public static Function<Context, Context> setSdeContext(SdeContext ctx) {
//        return context -> context.put(SDE_CONTEXT_KEY, ctx);
//    }
//
//    public static Function<Context, Context> unset() {
//        return context -> context.delete(SDE_CONTEXT_KEY);
//    }
}
