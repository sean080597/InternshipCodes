package com.programming.technie.nats_base.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    // Define a pointcut for all methods in com.programming.technie package
    @Pointcut("execution(* com.programming.technie..*(..))")
//    @Pointcut("within(com.programming.technie.nats_sub.dto..*")
    public void allMethodsInPackage() {}

    // Apply advice before each method matching the pointcut
    @Before("allMethodsInPackage()")
    public void logBefore() {
        System.out.println("Method called in com.programming.technie package");
    }
}
