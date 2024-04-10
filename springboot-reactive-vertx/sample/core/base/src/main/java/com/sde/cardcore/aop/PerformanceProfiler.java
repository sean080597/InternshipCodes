package com.xyz.cardcore.aop;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.function.Consumer;

import com.programming.technie.util.FishTagUtil;
import com.programming.technie.util.LogUtil;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.context.ContextView;

@Aspect
@Order(1)
@Component
public class PerformanceProfiler extends Architecture {
    private static final Logger log = LoggerFactory.getLogger(PerformanceProfiler.class);

    @Around("inServiceLayer() || inWebServicesLayer() || inDAOLayer() || inControllerLayer() || inValidationHandlerLayer() || inValidator()")
    public Object profile(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();

        Object result = null;
        try {
            result = pjp.proceed();
            if (result instanceof Mono<?> monoOut) {
                return logMonoResult(pjp, start, monoOut);
            } else if (result instanceof Flux<?> fluxOut) {
                return logFluxResult(pjp, start, fluxOut);
            }

            return result;
        } catch (Exception e) {
            if (pjp.getSignature() instanceof MethodSignature methodSignature) {
                Method method = methodSignature.getMethod();
                if (method.isAnnotationPresent(Async.class)) {
                    log.debug("Error [" + e.getMessage() + "]");
                }
            }
            throw e;
        } finally {
            if (!(result instanceof Mono<?>) && !(result instanceof Flux<?>)) {
                doOutputLogging(pjp, start);
            }
        }
    }

    private <T> Mono<T> logMonoResult(ProceedingJoinPoint pjp, long start, Mono<T> monoOut) {
        return Mono.deferContextual(contextView ->
            monoOut.doOnEach(LogUtil.logOnComplete(e -> doOutputLogging(pjp, start)))
        );
    }

    private <T> Flux<T> logFluxResult(ProceedingJoinPoint pjp, long start, Flux<T> fluxOut) {
        return Flux.deferContextual(contextView ->
            fluxOut.doOnEach(LogUtil.logOnComplete(e -> doOutputLogging(pjp, start)))
        );
    }

    private void doOutputLogging(final ProceedingJoinPoint pjp, final long start) {
        String m = pjp.getSignature().toShortString();
        long elapsedTime = System.currentTimeMillis() - start;
        log.debug("'Method '" + m + "' execution time = [" + elapsedTime + "] ms.");
    }
}
