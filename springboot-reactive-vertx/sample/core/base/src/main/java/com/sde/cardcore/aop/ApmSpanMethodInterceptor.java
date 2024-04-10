package com.xyz.cardcore.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.xyz.ms.cache.BaseCache;

import co.elastic.apm.api.ElasticApm;
import co.elastic.apm.api.Span;
import co.elastic.apm.api.Transaction;

@Aspect
@Component
public class ApmSpanMethodInterceptor  {

	private final Logger log = LoggerFactory.getLogger(ApmSpanMethodInterceptor.class);

	@Around("execution(* com.xyz.ms.cache.BaseCache.*(..))")
	public Object interceptMethod(ProceedingJoinPoint joinPoint) throws Throwable {
		Object targetObject = joinPoint.getTarget();
		if (targetObject instanceof BaseCache) {
			Transaction transaction = ElasticApm.currentTransaction();
			Span span = transaction.startExitSpan("db", "cache", "query");

			try {
				String cacheName = ((BaseCache) targetObject).getCache().getName();
				String spanName = cacheName;
				span.setName(spanName);
				return joinPoint.proceed();
			} catch (Exception e) {
				span.captureException(e);
				throw e;
			} finally {
				span.end();
			}
		} else {
			return joinPoint.proceed();
		}
	}
}
