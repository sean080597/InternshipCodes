package com.xyz.cardcore.aop;

import org.aspectj.lang.annotation.Pointcut;

public abstract class Architecture
{
    @Pointcut ("within(com.xyz.cardcore.issuing.validator..*)")
    protected void inValidator() {}

    @Pointcut ("within(com.xyz.cardcore.issuing.account.param.service..*)" + " || " + "within(com.xyz.cardcore.issuing.authorization.param.service..*)")
    protected void inServiceLayer() {}

    @Pointcut ("within(com.xyz.cardcore.issuing.account.param.ws..*)" + " || " + "within(com.xyz.cardcore.issuing.authorization.param.ws..*)")
    protected void inWebServicesLayer() {}

    @Pointcut ("within(com.xyz.cardcore.issuing.account.param.dao..*)" + " || " + "within(com.xyz.cardcore.issuing.authorization.param.dao..*)")
    protected void inDAOLayer() {}

    @Pointcut ("within(com.xyz.ms.web.controller..*)")
    protected void inControllerLayer() {}

    @Pointcut ("within(com.xyz.cardcore.issuing.validator.handler..*)")
    protected void inValidationHandlerLayer() {}
}
