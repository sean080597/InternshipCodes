package com.programming.technie.web.filter;

import com.programming.technie.util.LogUtil;
import com.sde.modelsuite.util.LogCensorUtil;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpResponseDecorator;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebExchangeDecorator;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

public class LoggingFilter implements WebFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);
    private final int order;

    private static final String LINE_SEPARATOR = System.getProperty("line.separator");
    private static final Marker inboundMarker = MarkerFactory.getMarker("INBOUND");
    private static final Marker outboundMarker = MarkerFactory.getMarker("OUTBOUND");

    public LoggingFilter(int order) {
        this.order = order;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        if (exchange.getRequest().getURI().getPath().startsWith("/monitoring")) {
            return chain.filter(exchange);
        }
        return chain.filter(new LoggingWebExchange(log, exchange));
    }

    @Override
    public int getOrder() {
        return order;
    }

    private static class LoggingWebExchange extends ServerWebExchangeDecorator {

        private final LoggingRequestDecorator requestDecorator;
        private final LoggingResponseDecorator responseDecorator;

        public LoggingWebExchange(Logger log, ServerWebExchange delegate) {
            super(delegate);
            this.requestDecorator = new LoggingRequestDecorator(log, delegate.getRequest());
            this.responseDecorator = new LoggingResponseDecorator(log, delegate.getRequest(), delegate.getResponse());
        }

        @Override
        public ServerHttpRequest getRequest() {
            return requestDecorator;
        }

        @Override
        public ServerHttpResponse getResponse() {
            return responseDecorator;
        }
    }

    private static class LoggingRequestDecorator extends ServerHttpRequestDecorator {

        private final Flux<DataBuffer> body;

        public LoggingRequestDecorator(Logger log, ServerHttpRequest delegate) {
            super(delegate);
            if (log.isDebugEnabled()) {
                String address = delegate.getURI().toString();
                String path = delegate.getURI().getPath();
                String method = Optional.of(delegate.getMethod()).orElse(HttpMethod.GET).name();
                String remoteAddress = Objects.requireNonNull(delegate.getRemoteAddress()).getAddress().getHostAddress();
                String headers = delegate.getHeaders().toString();

                MediaType contentType = delegate.getHeaders().getContentType();
                String formatType = null;

                StringBuilder requestLogging = new StringBuilder("Inbound Message" + LINE_SEPARATOR);
                requestLogging.append("----------------------------" + LINE_SEPARATOR);
                requestLogging.append("Address: " + address + LINE_SEPARATOR);

                if (contentType != null) {
                    requestLogging.append("Content-Type: " + contentType + LINE_SEPARATOR);

                    if (contentType.getCharset() != null) {
                        requestLogging.append("Encoding: " + contentType.getCharset() + LINE_SEPARATOR);
                    }

                    if (contentType.toString().contains("xml")) {
                        formatType = "XML";
                    } else if (contentType.toString().contains("json")) {
                        formatType = "JSON";
                    }
                }

                requestLogging.append("Http-Method: " + method + LINE_SEPARATOR);
                requestLogging.append("Remote Address: " + remoteAddress + LINE_SEPARATOR);
                requestLogging.append("Headers: " + headers + LINE_SEPARATOR);

                String finalFormatType = formatType;
                body = super.getBody()
                    .doOnNext(buffer -> {
                        try (ByteArrayOutputStream bodyStream = new ByteArrayOutputStream()) {
                            byte[] bytes = new byte[buffer.readableByteCount()];
                            ByteBuffer byteBuffer = ByteBuffer.wrap(bytes, 0, bytes.length);
                            buffer.toByteBuffer(byteBuffer);
                            Channels.newChannel(bodyStream).write(byteBuffer);
                            String censoredBody = bodyStream.toString(StandardCharsets.UTF_8);

                            // handling sensitive keys
                            String[] keys = LogCensorUtil.getSensitiveKeys();
                            censoredBody = LogCensorUtil.censorSensitiveInformation(censoredBody, keys, finalFormatType);

                            requestLogging.append("Payload: " + censoredBody + LINE_SEPARATOR);
                            requestLogging.append("--------------------------------------" + LINE_SEPARATOR);
                        } catch (IOException e) {
                            throw new RuntimeException("Error reading request body", e);
                        }
                    })
                    .doOnEach(
                        path.endsWith("/manage/health.json") || path.endsWith("/manage/health") || Pattern.matches(".*/actuator(/.*)*$", path)
                            ? LogUtil.logOnComplete(obj -> log.trace(inboundMarker, requestLogging.toString()))
                            : LogUtil.logOnComplete(obj -> log.debug(inboundMarker, requestLogging.toString()))
                    );
            } else {
                body = super.getBody();
            }
        }

        @Override
        public Flux<DataBuffer> getBody() {
            return body;
        }
    }

    private static class LoggingResponseDecorator extends ServerHttpResponseDecorator {

        private final Logger log;
        private final String path;
        private StringBuilder responseLogging;

        public LoggingResponseDecorator(Logger log, ServerHttpRequest delegateRequest, ServerHttpResponse delegateResponse) {
            super(delegateResponse);
            this.log = log;
            this.path = delegateRequest.getURI().getPath();
        }

        @Override
        public Mono<Void> writeWith(Publisher<? extends DataBuffer> body) {
            return super.writeWith(
                Flux.from(body)
                    .doOnNext(buffer -> {
                        if (log.isDebugEnabled()) {
                            String status = Objects.requireNonNull(getDelegate().getStatusCode()).toString();
                            String headers = getDelegate().getHeaders().toString();

                            MediaType contentType = getDelegate().getHeaders().getContentType();
                            String formatType = null;

                            responseLogging = new StringBuilder("Outbound Message\n");
                            responseLogging.append("---------------------------" + LINE_SEPARATOR);
                            responseLogging.append("Response-Code: " + status + LINE_SEPARATOR);
                            responseLogging.append("Headers: " + headers + LINE_SEPARATOR);

                            if (contentType != null) {
                                responseLogging.append("Content-Type: " + contentType + LINE_SEPARATOR);

                                if (contentType.toString().contains("xml")) {
                                    formatType = "XML";
                                } else if (contentType.toString().contains("json")) {
                                    formatType = "JSON";
                                }
                            }

                            try (ByteArrayOutputStream bodyStream = new ByteArrayOutputStream()) {
                                byte[] bytes = new byte[buffer.readableByteCount()];
                                ByteBuffer byteBuffer = ByteBuffer.wrap(bytes, 0, bytes.length);
                                buffer.toByteBuffer(byteBuffer);
                                Channels.newChannel(bodyStream).write(byteBuffer);
                                String censoredBody = bodyStream.toString(StandardCharsets.UTF_8);

                                // handling sensitive keys
                                String[] keys = LogCensorUtil.getSensitiveKeys();
                                censoredBody = LogCensorUtil.censorSensitiveInformation(censoredBody, keys, formatType);

                                responseLogging.append("Payload: " + censoredBody + LINE_SEPARATOR);
                                responseLogging.append("--------------------------------------" + LINE_SEPARATOR);
                            } catch (IOException e) {
                                throw new RuntimeException("Error reading response body", e);
                            }
                        }
                    })
                    .doOnEach(log.isDebugEnabled() &&
                        (path.endsWith("/manage/health.json") || path.endsWith("/manage/health") || Pattern.matches(".*/actuator(/.*)*$", path))
                        ? LogUtil.logOnComplete(obj -> log.trace(outboundMarker, responseLogging.toString()))
                        : LogUtil.logOnComplete(obj -> log.debug(outboundMarker, responseLogging.toString()))
                    )
            );
        }
    }
}
