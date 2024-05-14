package com.programming.technie.util;

import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

public class FishTagUtil {
    private static Logger log = LoggerFactory.getLogger(FishTagUtil.class);

    private static String HTTP_HEADER_ID = "TAG-ID";
    private static String SESSION_ID = "TAG-ID";
    private static String CTX_ID = "fishTagCtx";
    private static String MDC_ID = "fishTagId";

    public static String getCtxId() {
        return CTX_ID;
    }

    public static String getMdcId() {
        return MDC_ID;
    }

    public static void setIdToSession(Context ctx, ServerWebExchange exchange) {
        Mono<WebSession> sessionMono = exchange.getSession();
        sessionMono.flatMap(ss -> {
            ss.getAttributes().put(SESSION_ID, getIdFromMDC(ctx));
            return Mono.empty();
        }).subscribe();
    }

    public static Mono<String> getIdFromSession(ServerWebExchange exchange) {
        Mono<WebSession> sessionMono = exchange.getSession();
        return sessionMono.flatMap(ss -> {
            if (ss == null || !ss.getAttributes().containsKey(SESSION_ID)) {
                return Mono.empty();
            }

            String id = ss.getAttribute(SESSION_ID);
            ss.getAttributes().remove(SESSION_ID);
            return Mono.just(id);
        });
    }

    public static String getIdFromHttpHeader(ServerHttpRequest request) {
        return request.getHeaders().getFirst(HTTP_HEADER_ID);
    }

    public static void addIdToHttpHeader(Context ctx, Map<String, String> httpHeaders) {
        String id = getIdFromMDC(ctx);
        httpHeaders.put(HTTP_HEADER_ID, id);
    }

    public static Context setIdToMDC(Context ctx, String id) {
        return ctx.put(MDC_ID, id);
    }

    public static String getIdFromMDC(Context ctx) {
        return ctx.get(MDC_ID);
    }

    public static String generateId() {
        return UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
    }

    public static void clear(Context ctx) {
        ctx.delete(MDC_ID);
    }
}
