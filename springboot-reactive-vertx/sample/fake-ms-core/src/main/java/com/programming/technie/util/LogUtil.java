package com.programming.technie.util;

import org.slf4j.MDC;
import reactor.core.publisher.Signal;

import java.util.Optional;
import java.util.function.Consumer;

public class LogUtil {

    public static <T> Consumer<Signal<T>> logOnNext(Consumer<T> logStatement) {
        return signal -> {
            if (!signal.isOnNext()) return;
            Optional<String> toPutInMdc = signal.getContextView().getOrEmpty(FishTagUtil.getCtxId());
            toPutInMdc.ifPresentOrElse(tpim -> {
                try (MDC.MDCCloseable closeable = MDC.putCloseable(FishTagUtil.getMdcId(), tpim)) {
                    logStatement.accept(signal.get());
                }
            }, () -> logStatement.accept(signal.get()));
        };
    }

    public static <T> Consumer<Signal<T>> logOnError(Consumer<Throwable> logStatement) {
        return signal -> {
            if (!signal.isOnError()) return;
            Optional<String> toPutInMdc = signal.getContextView().getOrEmpty(FishTagUtil.getCtxId());
            toPutInMdc.ifPresentOrElse(tpim -> {
                try (MDC.MDCCloseable closeable = MDC.putCloseable(FishTagUtil.getMdcId(), tpim)) {
                    logStatement.accept(signal.getThrowable());
                }
            }, () -> logStatement.accept(signal.getThrowable()));
        };
    }

    public static <T> Consumer<Signal<T>> logOnComplete(Consumer<T> logStatement) {
        return signal -> {
            if (!signal.isOnComplete()) return;
            Optional<String> toPutInMdc = signal.getContextView().getOrEmpty(FishTagUtil.getCtxId());
            toPutInMdc.ifPresentOrElse(tpim -> {
                try (MDC.MDCCloseable closeable = MDC.putCloseable(FishTagUtil.getMdcId(), tpim)) {
                    logStatement.accept(signal.get());
                }
            }, () -> logStatement.accept(signal.get()));
        };
    }
}
