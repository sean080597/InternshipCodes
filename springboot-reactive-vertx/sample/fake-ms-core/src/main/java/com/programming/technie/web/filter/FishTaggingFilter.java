package com.programming.technie.web.filter;

import com.programming.technie.util.FishTagUtil;
import com.programming.technie.util.LogUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

public class FishTaggingFilter implements WebFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(FishTaggingFilter.class);
    private final int order;

    public FishTaggingFilter(int order) {
        this.order = order;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        String id = FishTagUtil.getIdFromHttpHeader(request);
        if (id == null) {
            id = FishTagUtil.generateId();
        }

        String finalId = id;
        return chain.filter(exchange).contextWrite(Context.of(FishTagUtil.getCtxId(), finalId));
    }

    @Override
    public int getOrder() {
        return order;
    }
}
