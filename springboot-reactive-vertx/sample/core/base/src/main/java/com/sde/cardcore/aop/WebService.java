package com.xyz.cardcore.aop;

import java.lang.reflect.Method;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

import com.programming.technie.util.FishTagUtil;
import com.programming.technie.util.LogUtil;
import com.programming.technie.web.security.ReactiveContextHolderStrategy;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.dao.CannotAcquireLockException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Component;

import io.vertx.sqlclient.TransactionRollbackException;
import com.xyz.cardcore.constant.CardErrorCode;
import com.xyz.cardcore.dto.OBRequestResponse;
import com.xyz.cardcore.helper.JSONEncryptHelper;
import com.xyz.cardcore.helper.KafkaHelper;
import com.xyz.modelsuite.dto.OBBase;
import com.xyz.modelsuite.exception.SystemException;
import com.xyz.modelsuite.util.DateUtil;
import com.xyz.modelsuite.util.PropertyUtil;
import com.xyz.modelsuite.util.SpringBeanUtil;
import com.xyz.modelsuite.util.StringUtil;
import com.xyz.modelsuite.web.security.XyzContext;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

@Aspect
@Order(2)
@Component
public class WebService extends Architecture {
    private static final Logger log = LoggerFactory.getLogger(WebService.class);

    @Autowired
    Environment env;

    @SuppressWarnings("unchecked")
    @Around(value = "inWebServicesLayer() && !(@annotation(com.xyz.modelsuite.aop.WebServiceValidationNotRequired) || @annotation(org.springframework.web.bind.annotation.ExceptionHandler))")
    public Object validateHeader(ProceedingJoinPoint pjp) throws Throwable {
        OBBase request = (OBBase) pjp.getArgs()[0]; // 1st pass in arguments must be OBRequest extends OBBase
        AtomicReference<OBBase> response = new AtomicReference<>();

        Object result = null;
        try {
            result = pjp.proceed(); // continue processing

            if (result instanceof Mono<?> monoOut) {
                return monoOut.map(obj -> {
                    handleResponseHeaders(response, request, obj);
                    return obj;
                }).doFinally(signalType -> {
                    try {
                        handleFinally(pjp, request, response);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }).contextWrite(ctx -> ctx.put(ReactiveContextHolderStrategy.XYZ_CONTEXT_KEY, genXyzContext(request)));
            } else if (result instanceof Flux<?> fluxOut) {
                return fluxOut.map(obj -> {
                    handleResponseHeaders(response, request, obj);
                    return obj;
                }).doFinally(signalType -> {
                    try {
                        handleFinally(pjp, request, response);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }).contextWrite(ctx -> ctx.put(ReactiveContextHolderStrategy.XYZ_CONTEXT_KEY, genXyzContext(request)));
            }

            handleResponseHeaders(response, request, result);
            return result;
        } catch (Throwable t) {
            // upgrade, only print the root cause
            Throwable root;

            List<Throwable> l = ExceptionUtils.getThrowableList(t);
            if (l.size() < 2) // if no child
            {
                root = t;
            } else {
                // get the last
                root = l.get(l.size() - 1);
            }

            if (root instanceof SystemException e) {

                log.error(e.getMessage(), e);

                if (e.getOutput() != null && e.getOutput() instanceof OBBase) {
                    response.set((OBBase) e.getOutput());

                    // play safe
                    if (response.get().getObHeader() == null) {
                        response.get().setObHeader(request.getObHeader());
                    }

                    response.get().getObHeader().setStatusCode(e.getErrorCode());
                    response.get().getObHeader().setSuccess(Boolean.FALSE);
                    response.get().getObHeader().setStatusMessage(StringUtil.convertNullString(e.toString()));
                    response.get().getObHeader().setDateTimeOut(DateUtil.retrieveDateNow());

                    if (e.getErrorDetails() != null) {
                        response.get().getObHeader().setErrorDetails(e.getErrorDetails());
                    }

                    return Mono.just(e.getOutput());
                } else {
                    response.set(constructFailResponse(request, pjp));

                    response.get().getObHeader().setStatusCode(e.getErrorCode());
                    response.get().getObHeader().setStatusMessage(StringUtil.convertNullString(e.toString()));

                    if (e.getErrorDetails() != null) {
                        response.get().getObHeader().setErrorDetails(e.getErrorDetails());
                    }

                    return Mono.just(response);
                }
            } else if (root instanceof SQLIntegrityConstraintViolationException e) {

                log.error(e.getMessage(), e);

                response.set(constructFailResponse(request, pjp));

                response.get().getObHeader().setStatusCode(CardErrorCode.DUPLICATE_RECORD_FOUND.getCode());
                response.get().getObHeader().setStatusMessage(CardErrorCode.DUPLICATE_RECORD_FOUND.getDesc() + " - " + e.getMessage());

                return Mono.just(response);
            } else if (root instanceof ObjectOptimisticLockingFailureException e) {

                log.error(e.getMessage(), e);

                response.set(constructFailResponse(request, pjp));

                response.get().getObHeader().setStatusCode(CardErrorCode.CONCURRENT_UPDATE_FOUND.getCode());
                response.get().getObHeader().setStatusMessage(CardErrorCode.CONCURRENT_UPDATE_FOUND.getDesc());

                return Mono.just(response);
            } else if (root instanceof TransactionRollbackException e) {

                log.error(e.getMessage(), e);

                response.set(constructFailResponse(request, pjp));

                if (e.getMessage().contains("Deadlock found")
                    || e.getMessage().contains("Lock wait timeout")
                ) {
                    response.get().getObHeader().setStatusCode(CardErrorCode.DEADLOCK_FOUND.getCode());
                    response.get().getObHeader().setStatusMessage(CardErrorCode.DEADLOCK_FOUND.getDesc());
                } else {
                    response.get().getObHeader().setStatusCode("AB");
                    response.get().getObHeader().setStatusMessage(StringUtil.convertNullString(root.toString()));
                }


                return Mono.just(response);
            } else if (root instanceof CannotAcquireLockException e) {

                log.error(e.getMessage(), e);

                response.set(constructFailResponse(request, pjp));

                if (e.getMessage().contains("LockAcquisitionException")) {
                    response.get().getObHeader().setStatusCode(CardErrorCode.DEADLOCK_FOUND.getCode());
                    response.get().getObHeader().setStatusMessage(CardErrorCode.DEADLOCK_FOUND.getDesc());
                } else {
                    response.get().getObHeader().setStatusCode("AB");
                    response.get().getObHeader().setStatusMessage(StringUtil.convertNullString(root.toString()));
                }

                return Mono.just(response);
            } else {
                log.error(root.getMessage(), root);

                response.set(constructFailResponse(request, pjp));

                response.get().getObHeader().setStatusCode("AB");
                response.get().getObHeader().setStatusMessage(StringUtil.convertNullString(root.toString()));

                return Mono.just(response);
            }
        } finally {
            if (!(result instanceof Mono<?>) && !(result instanceof Flux<?>)) {
                handleFinally(pjp, request, response);
            }
        }
    }

    private static XyzContext genXyzContext(OBBase finalRequest) {
        XyzContext xyzContext = new XyzContext();
        xyzContext.setIpAddress(finalRequest.getObHeader().getIpAddress());
        xyzContext.setUserId(finalRequest.getObHeader().getUserId());
        xyzContext.setUsername(finalRequest.getObHeader().getUsername());
        xyzContext.setDomainId(finalRequest.getObHeader().getDomainId());
        xyzContext.setDefaultOrganizationUnit(finalRequest.getObHeader().getDefaultOrganizationUnit());
        xyzContext.setDefaultOrganization(finalRequest.getObHeader().getDefaultOrganization());
        xyzContext.setDefaultOrganizationUnitType(finalRequest.getObHeader().getDefaultOrganizationUnitType());
        xyzContext.setDefaultOrganizationUnitCategory(finalRequest.getObHeader().getDefaultOrganizationUnitCategory());
        xyzContext.setRoleCodeList(finalRequest.getObHeader().getRoleCodeList());
        return xyzContext;
    }

    private static void handleResponseHeaders(AtomicReference<OBBase> response, OBBase request, Object result) {
        if (result instanceof OBBase) {
            response.set((OBBase) result);

            // play safe
            if (response.get().getObHeader() == null) {
                response.get().setObHeader(request.getObHeader());
            }

            response.get().getObHeader().setDateTimeOut(DateUtil.retrieveDateNow());

            // to cater, when developers forget to set status code, default set to true
            if (!StringUtil.hasValue(response.get().getObHeader().getStatusCode())) {
                response.get().getObHeader().setSuccess(Boolean.TRUE);
                response.get().getObHeader().setStatusCode("AA");
            }
        }
    }

    private static void handleFinally(ProceedingJoinPoint pjp, OBBase request, AtomicReference<OBBase> response) throws Exception {
        String topic = PropertyUtil.getValue("kafka." + pjp.getSignature().getDeclaringType().getSimpleName() + "." + pjp.getSignature().getName());

        if (StringUtil.hasValue(topic)) {
            topic = ((Map<String, String>) SpringBeanUtil.lookup("kafkaTopics")).get(topic);
            // send to kafka
            long start = System.currentTimeMillis();

            OBRequestResponse rr = new OBRequestResponse();
            rr.setObRequest(request);
            rr.setObResponse(response.get());

            KafkaHelper.send(topic, pjp.getSignature().toShortString(), JSONEncryptHelper.censorSensitiveJSON(rr));

            long elapsedTime = System.currentTimeMillis() - start;

            log.debug("Send to Kafka, used time = [" + elapsedTime + "] ms.");
        }
    }

//    private String getActiveProfie()
//    {
//        String[] activeProfiles = env.getActiveProfiles();
//
//        for (String profile : activeProfiles)
//        {
//            if ("DEV".equals(profile)
//                    || "SIT".equals(profile)
//                    || "UAT".equals(profile)
//                    || "DR".equals(profile)
//                    || "PROD".equals(profile)
//                    )
//            {
//                return profile;
//            }
//        }
//
//        return "DEV";
//    }

    private static OBBase constructFailResponse(OBBase request, ProceedingJoinPoint pjp) {
        MethodSignature methodSignature = (MethodSignature) pjp.getSignature();
        Method method = methodSignature.getMethod();

        OBBase response;
        try {
            @SuppressWarnings("unchecked")
            Class<OBBase> c = (Class<OBBase>) method.getReturnType(); // return object must be OBResponse extends OBBase
            response = c.getDeclaredConstructor().newInstance();
        } catch (Exception ie) {
            log.error(ie.getMessage(), ie);
            response = new OBBase();
        }

        response.setObHeader(request.getObHeader());

        response.getObHeader().setSuccess(Boolean.FALSE);
        response.getObHeader().setDateTimeOut(DateUtil.retrieveDateNow());

        return response;
    }
}
