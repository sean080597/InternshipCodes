package com.sde.cardcore.card.management.consumer;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.sde.cardcore.helper.KafkaHelper;
import io.confluent.parallelconsumer.ParallelStreamProcessor;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.DependsOn;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sde.cardcore.external.data.dto.OBTempStatementRequest;
import com.sde.cardcore.external.data.dto.OBTempStatementResponse;
import com.sde.cardcore.issuing.account.data.dto.OBAccountCancellationReinstatementRequest;
import com.sde.cardcore.issuing.account.data.dto.OBAccountCancellationReinstatementResponse;
import com.sde.cardcore.issuing.account.data.dto.OBLimitAdjustmentRequestRequest;
import com.sde.cardcore.issuing.account.data.dto.OBLimitAdjustmentRequestResponse;
import com.sde.cardcore.issuing.authorization.data.dto.OBAuthorizationRequest;
import com.sde.cardcore.issuing.authorization.data.dto.OBAuthorizationResponse;
import com.sde.cardcore.issuing.authorization.data.dto.OBCashWithdrawalDetail;
import com.sde.cardcore.issuing.authorization.data.dto.OBCashWithdrawalResponse;
import com.sde.cardcore.issuing.card.data.constant.CardRenewalStatus;
import com.sde.cardcore.issuing.card.data.constant.CardReplacementConstant;
import com.sde.cardcore.issuing.card.data.dto.OBAbuRequest;
import com.sde.cardcore.issuing.card.data.dto.OBAbuResponse;
import com.sde.cardcore.issuing.card.data.dto.OBCardApplicationRequest;
import com.sde.cardcore.issuing.card.data.dto.OBCardApplicationResponse;
import com.sde.cardcore.issuing.card.data.dto.OBCardRegistrationRequest;
import com.sde.cardcore.issuing.card.data.dto.OBCardRegistrationResponse;
import com.sde.cardcore.issuing.card.data.dto.OBCardRenewalRequest;
import com.sde.cardcore.issuing.card.data.dto.OBCardRenewalResponse;
import com.sde.cardcore.issuing.card.data.dto.OBCardReplacementRequest;
import com.sde.cardcore.issuing.card.data.dto.OBCardReplacementResponse;
import com.sde.cardcore.issuing.card.data.dto.OBCardStopRequest;
import com.sde.cardcore.issuing.card.data.dto.OBCardStopResponse;
import com.sde.cardcore.issuing.card.data.dto.OBCardUpgradeResponse;
import com.sde.cardcore.issuing.card.data.dto.OBContactlessEcommerceOptInRequest;
import com.sde.cardcore.issuing.card.data.dto.OBContactlessEcommerceOptInResponse;
import com.sde.cardcore.issuing.card.data.dto.OBEmbossingEncodingRequest;
import com.sde.cardcore.issuing.card.data.dto.OBEmbossingEncodingResponse;
import com.sde.cardcore.issuing.common.data.dto.OBCardAccountRequest;
import com.sde.cardcore.issuing.common.data.dto.OBCardAccountResponse;
import com.sde.cardcore.issuing.common.data.dto.OBCardActivationDetail;
import com.sde.cardcore.issuing.common.data.dto.OBCardActivationRequest;
import com.sde.cardcore.issuing.common.data.dto.OBCardActivationResponse;
import com.sde.cardcore.issuing.common.data.dto.OBCardMasterDetail;
import com.sde.cardcore.issuing.common.data.dto.OBCardMasterRequest;
import com.sde.cardcore.issuing.common.data.dto.OBCardMasterResponse;
import com.sde.cardcore.issuing.common.data.dto.OBCardStopDetail;
import com.sde.cardcore.issuing.common.data.dto.OBGroupAccountDetail;
import com.sde.cardcore.issuing.common.data.dto.OBGroupAccountRequest;
import com.sde.cardcore.issuing.common.data.dto.OBGroupAccountResponse;
import com.sde.cardcore.issuing.common.data.dto.OBTransactionDetail;
import com.sde.cardcore.issuing.dispute.data.dto.OBDisputeTransactionsRequest;
import com.sde.cardcore.issuing.dispute.data.dto.OBDisputeTransactionsResponse;
import com.sde.cardcore.issuing.eod.data.dto.OBTemporaryCollectionFeeFileRequest;
import com.sde.cardcore.issuing.eod.data.dto.OBTemporaryCollectionFeeFileResponse;
import com.sde.cardcore.issuing.interest.param.dto.OBParamInterestPricingPlanModelDetailRequest;
import com.sde.cardcore.issuing.interest.param.dto.OBParamInterestPricingPlanModelDetailResponse;
import com.sde.cardcore.issuing.loan.data.dto.OBIppOrderDetail;
import com.sde.cardcore.issuing.loan.data.dto.OBIppOrderRequest;
import com.sde.cardcore.issuing.loan.data.dto.OBIppOrderResponse;
import com.sde.cardcore.issuing.notification.data.dto.OBNotificationRequest;
import com.sde.cardcore.issuing.notification.data.dto.OBNotificationResponse;
import com.sde.cardcore.issuing.notification.data.ws.AccountCancellationOrReinstatementActionNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.AccountMaintenanceNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.AddressUpdateNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.AnnualFeeReminderNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.AuthorizationNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CallForDeejungNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardActivationNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardActivationReminderNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardApplicationNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardClosureReminderNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardDeactivationNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardEmbossingTrackingStatusUpdateNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardRegistrationNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardRenewalNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardReplacementNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CardStopNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CollectionFeeNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CollectionProcessForWealthCustomerNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.CreditLimitAdjustmentNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.DeejungTransferInstallmentNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.DisputeTransactionsNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.ECommerceOptInOptOutUpdateNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.InterestRateAdjustmentNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.NonFraudDisputeCaseReceivedNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.NotifyCreateAbuWS;
import com.sde.cardcore.issuing.notification.data.ws.NotifyDeejungTransactionTransferringWS;
import com.sde.cardcore.issuing.notification.data.ws.NotifyRelieveProgramEndNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.PinChangeNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.PinReissueNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.PinResetNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.PinValidateNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.RepaymentReminderNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.SkipPaymentEndNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.SkipPaymentEnrolmentNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.SkipPaymentTerminationNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.StatementGenerationReminderNotificationWS;
import com.sde.cardcore.issuing.notification.data.ws.VirtualCardRenewalReplacementNotificationWS;
import com.sde.cardcore.issuing.payment.data.dto.OBSkipPaymentPlanRequest;
import com.sde.cardcore.issuing.payment.data.dto.OBSkipPaymentPlanResponse;
import com.sde.cardcore.issuing.pin.data.dto.OBPinRequest;
import com.sde.cardcore.issuing.pin.data.dto.OBPinResponse;
import com.sde.cardcore.issuing.transaction.data.dto.OBTransactionRequest;
import com.sde.cardcore.issuing.transaction.data.dto.OBTransactionResponse;
import com.sde.cardcore.proxy.CardCoreCardDataProxy;
import com.sde.cardcore.proxy.CardCoreCardManagementWSProxy;
import com.sde.cardcore.proxy.CardCoreTransactionDataProxy;
import com.sde.modelsuite.util.JSONUtil;
import com.sde.modelsuite.util.PropertyUtil;
import com.sde.modelsuite.util.SpringBeanUtil;
import com.sde.modelsuite.util.StringUtil;

import javax.annotation.PostConstruct;

@Component
public class CardNotificationConsumer implements ApplicationRunner {
    private static Logger log = LoggerFactory.getLogger(CardNotificationConsumer.class);
    private static final String listenerId = "CardNotificationConsumerId";
    private static final String groupId = "NOTIFICATION";
    @Value("#{kafkaTopics.cardManagementTopic}")
    private String topicId;

    @KafkaListener(id = "CardNotificationConsumerId", topics = {"#{kafkaTopics.cardManagementTopic}"}, autoStartup = "false")
    public void consumeMessage(ConsumerRecord<String, String> record) throws Exception {
        log.debug("consumeCardManagementTopicMessage Key = " + record.key());
        log.debug("consumeCardManagementTopicMessage Value = " + record.value());

        if ("CardActivationWS.performCardActivation(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardActivationRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardActivationRequest.class);
            OBCardActivationResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardActivationResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardActivationNotificationWS.class).sendNotification(request);

        } else if ("CardStopWS.performNewCardStop(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonResponse = node.path("obResponse");

            OBCardStopRequest obRequest = JSONUtil.decode(jsonResponse.toString(), OBCardStopRequest.class);
            OBCardStopResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardStopResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardStopNotificationWS.class).sendNotification(request);

        } else if ("CardApplicationWS.performCreateCard(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardApplicationRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardApplicationRequest.class);
            OBCardApplicationResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardApplicationResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardApplicationNotificationWS.class).sendNotification(request);

        } else if ("CardRegistrationWS.performPreembossCardRegistration(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardRegistrationRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardRegistrationRequest.class);
            OBCardRegistrationResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardRegistrationResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardRegistrationNotificationWS.class).sendNotification(request);

        } else if ("CardReplacementWS.performCardReplacement(..)".equals(record.key()) || "CardUpgradeOrConversionWS.performCardUpgrade(..)".equals(record.key())) {
            //Physical One
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardReplacementRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardReplacementRequest.class);
            OBCardReplacementResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardReplacementResponse.class);

            if ("CardUpgradeOrConversionWS.performCardUpgrade(..)".equals(record.key())) {
                OBCardUpgradeResponse obResponse2 = JSONUtil.decode(jsonResponse.toString(), OBCardUpgradeResponse.class);
                obResponse.setOldObCardMasterDetail(obResponse2.getOldCardMasterDetail());
            }

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardReplacementNotificationWS.class).sendNotification(request);

        } else if ("PinWS.performPinReissueRequest(..)".equals(record.key()) ||
                "PinWS.performGeneratePinAtEOD(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBPinRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBPinRequest.class);
            OBPinResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBPinResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(PinReissueNotificationWS.class).sendNotification(request);

        } else if ("PinWS.performValidatePin(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBPinRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBPinRequest.class);
            OBPinResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBPinResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(PinValidateNotificationWS.class).sendNotification(request);

        } else if ("PinWS.performChangePin(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBPinRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBPinRequest.class);
            OBPinResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBPinResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(PinChangeNotificationWS.class).sendNotification(request);

        } else if ("PinWS.performResetPin(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBPinRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBPinRequest.class);
            OBPinResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBPinResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(PinResetNotificationWS.class).sendNotification(request);

        } else if ("LimitAdjustmentRequestWS.performEODLimitAdjustmentProcess(..)".equals(record.key()) ||
                "LimitAdjustmentRequestWS.performCancelAndCreateLimitAdjustmentRequest(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBLimitAdjustmentRequestRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBLimitAdjustmentRequestRequest.class);
            OBLimitAdjustmentRequestResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBLimitAdjustmentRequestResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            if (!"CLOS".equals(obResponse.getObHeader().getDomainId()) && !"CRDX".equals(obResponse.getObHeader().getDomainId())) {
                //filter trigger by LOS, CLOS is channel code for LOS
                //filter trigger by CRDX , channel code from self service (Mobile)
                OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CreditLimitAdjustmentNotificationWS.class).sendNotification(request);
            }

        } else if ("ContactlessEcommerceOptInWS.performCreateContactlessEcommerceOptIn(..)".equals(record.key()) ||
                "ContactlessEcommerceOptInWS.performUpdateContactlessEcommerceOptIn(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBContactlessEcommerceOptInRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBContactlessEcommerceOptInRequest.class);
            OBContactlessEcommerceOptInResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBContactlessEcommerceOptInResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(ECommerceOptInOptOutUpdateNotificationWS.class).sendNotification(request);

        } else if ("EODCardRenewalWS.processData(..)".equals(record.key())
                || "CardRenewalWS.performCardRenewal(..)".equals(record.key())
                || "CardMasterWS.performUpdateCardMasterDetail(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardMasterRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardMasterRequest.class);
            OBCardMasterResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardMasterResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            if ("CardMasterWS.performUpdateCardMasterDetail(..)".equals(record.key()) && obResponse.getObCardMasterDetail().getRenewalStatus().equals(CardRenewalStatus.RENEWAL_OK.getCode())) {
                OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardRenewalNotificationWS.class).sendNotification(request);
            }

            if ("EODCardRenewalWS.processData(..)".equals(record.key())) {
                OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardRenewalNotificationWS.class).sendNotification(request);
            }

            if ("CardRenewalWS.performCardRenewal(..)".equals(record.key())) {
                OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardRenewalNotificationWS.class).sendNotification(request);
            }

        } else if ("CardRenewalWS.performForceCardRenewal(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardRenewalRequest obCardRenewalRequest = JSONUtil.decode(jsonRequest.toString(), OBCardRenewalRequest.class);
            OBCardRenewalResponse obCardRenewalResponse = JSONUtil.decode(jsonResponse.toString(), OBCardRenewalResponse.class);

            OBCardMasterRequest obRequest = new OBCardMasterRequest();
            OBCardMasterResponse obResponse = new OBCardMasterResponse();
            obRequest.setObHeader(obCardRenewalRequest.getObHeader());
            obRequest.setObCardMasterDetail(obCardRenewalResponse.getObCardMasterDetail());
            obResponse.setObCardMasterDetail(obCardRenewalResponse.getObCardMasterDetail());
            obResponse.setOldObCardMasterDetail(obCardRenewalResponse.getObOldCardMasterDetail());
            obResponse.setObHeader(obCardRenewalResponse.getObHeader());

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardRenewalNotificationWS.class).sendNotification(request);

        } else if ("CardAccountWS.performUpdateCardAccountMaintenance(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardAccountRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardAccountRequest.class);
            OBCardAccountResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardAccountResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(AccountMaintenanceNotificationWS.class).sendNotification(request);

        } else if ("CardAccountWS.performUpdateCardBillingAddressMaintenance(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardAccountRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardAccountRequest.class);
            OBCardAccountResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardAccountResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(AddressUpdateNotificationWS.class).sendNotification(request);

        } else if ("AuthorizationWS.performAuthorization(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBAuthorizationRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBAuthorizationRequest.class);
            OBAuthorizationResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBAuthorizationResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(AuthorizationNotificationWS.class).sendNotification(request);

        } else if ("AccountCancellationReinstatementWS.performAccountCancellationReinstatement(..)".equals(record.key())
                || "AccountCancellationReinstatementWS.performAccountCancellationOrReinstatementAction(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBAccountCancellationReinstatementRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBAccountCancellationReinstatementRequest.class);
            OBAccountCancellationReinstatementResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBAccountCancellationReinstatementResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();
            OBCardActivationResponse obCardActivationResponse = new OBCardActivationResponse();

            //retrieve Card Master Detail
            OBCardMasterRequest obCardMasterRequest = new OBCardMasterRequest();
            OBCardMasterDetail obCardMasterDetail = new OBCardMasterDetail();
            obCardMasterDetail.setCustomerNumber(obResponse.getObGroupAccountDetail().getCustomerNumber());
            obCardMasterDetail.setProductId(obResponse.getObGroupAccountDetail().getProductId());
            obCardMasterRequest.setObCardMasterDetail(obCardMasterDetail);
            OBCardMasterResponse obCardMasterResponse = SpringBeanUtil.getBean(CardCoreCardManagementWSProxy.class).sendAndReceive("CardMasterWS.retrieveCardMasterDetailByCIFProductId", obCardMasterRequest, OBCardMasterResponse.class);

            for (OBCardMasterDetail detail : obCardMasterResponse.getObCardMasterDetailList()) {
                if (detail.getAccountNumber().equals(obResponse.getObGroupAccountDetail().getAccountNumber())) {
                    obCardMasterDetail = detail;
                }
            }

            OBCardActivationDetail obCardActivationDetail = new OBCardActivationDetail();
            obCardActivationDetail.setObCardMasterDetail(obCardMasterDetail);
            obCardActivationResponse.setObHeader(obResponse.getObHeader());
            obCardActivationResponse.setObCardActivationDetail(obCardActivationDetail);

            request.setObResponse(obCardActivationResponse);

            //CXSIT-127122 - Getting card stop detail
            OBCardStopDetail obCardStopDetail = new OBCardStopDetail();
            OBCardStopRequest obCardStopRequest = new OBCardStopRequest();
            obCardStopDetail.setCardNumber(obCardMasterDetail.getCardNumber());
            obCardStopRequest.setObCardStopDetail(obCardStopDetail);
            OBCardStopResponse obCardStopResponse = SpringBeanUtil.getBean(CardCoreCardManagementWSProxy.class).sendAndReceive("CardStopWS.retrieveLatestCardStopDetailByCardNumber", obCardStopRequest, OBCardStopResponse.class);

            if (obCardStopResponse.getObCardStopDetail() != null) {
                obCardStopDetail = obCardStopResponse.getObCardStopDetail();
                if (obCardStopDetail.getStopReasonCode() != null) {
                    if (Arrays.asList("74", "75").contains(obCardStopDetail.getStopReasonCode())) {
                        OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardDeactivationNotificationWS.class).sendNotification(request);
                    } else {
                        obCardStopRequest.setObCardStopDetail(obCardStopDetail);
                        obCardStopRequest.getObCardStopDetail().setCustomerNo(obCardMasterDetail.getCustomerNumber());
                        request.setObRequest(obCardStopRequest);
                        request.setObResponse(obCardStopResponse);
                        ;
                        OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardStopNotificationWS.class).sendNotification(request);
                    }
                }
            }
        } else if ("EmbossingEncodingWS.performCreateEmbossingEncoding(..)".equals(record.key())
                || "EmbossingEncodingWS.performUpdateEmbossingTrackingHistory(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBEmbossingEncodingRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBEmbossingEncodingRequest.class);
            OBEmbossingEncodingResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBEmbossingEncodingResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardEmbossingTrackingStatusUpdateNotificationWS.class).sendNotification(request);
        }
        /**else if("CardEmbossingWS.performSingleCardEmbossing(..)".equals(record.key())
         || "ExpressCardEmbossingWS.performProcessCardEmbossing(..)".equals(record.key())
         || "EodCardEmbossingWS.processData(..)".equals(record.key()))
         {
         ObjectMapper mapper = new ObjectMapper();
         JsonNode node = mapper.readTree(record.value());
         JsonNode jsonRequest = node.path("obRequest");
         JsonNode jsonResponse = node.path("obResponse");

         OBCardEmbossingRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardEmbossingRequest.class);
         OBCardEmbossingResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardEmbossingResponse.class);

         OBNotificationRequest request = new OBNotificationRequest();

         request.setObRequest(obRequest);
         request.setObResponse(obResponse);

         OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardEmbossTrackingStatusUpdateByBatchNotificationWS.class).sendNotification(request);
         }**/
        else if ("EodMonitorPaymentDueAlertWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBGroupAccountRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBGroupAccountRequest.class);
            OBGroupAccountResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBGroupAccountResponse.class);

            // check flag
            if (null != obResponse.getObGroupAccountDetail()) {
                if (StringUtil.hasValue(obResponse.getObGroupAccountDetail().getPaymentDueDateNotificationFlag()) && ("Y").equalsIgnoreCase(obResponse.getObGroupAccountDetail().getPaymentDueDateNotificationFlag())) {
                    OBNotificationRequest request = new OBNotificationRequest();

                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    //OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(PaymentDueAlertNotificationWS.class).sendNotification(request);
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(RepaymentReminderNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("EodNotifyRelieveProgramEndWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBIppOrderRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBIppOrderRequest.class);
            OBIppOrderResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBIppOrderResponse.class);

            // check flag
            if (null != obResponse) {
                if (StringUtil.hasValue(obResponse.getRelieveProgramEnd()) && ("Y").equalsIgnoreCase(obResponse.getRelieveProgramEnd())) {
                    OBNotificationRequest request = new OBNotificationRequest();

                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(NotifyRelieveProgramEndNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("EodCollectionFeeMonitoringWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

//            OBTemporaryLatePaymentFeeFileRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBTemporaryLatePaymentFeeFileRequest.class);
//            OBTemporaryLatePaymentFeeFileResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBTemporaryLatePaymentFeeFileResponse.class);
            OBTemporaryCollectionFeeFileRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBTemporaryCollectionFeeFileRequest.class);
            OBTemporaryCollectionFeeFileResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBTemporaryCollectionFeeFileResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);
            request.setObHeader(obResponse.getObHeader());

            OBGroupAccountDetail obGroupAccountDetail = new OBGroupAccountDetail();
            OBGroupAccountRequest obGroupAccountRequest = new OBGroupAccountRequest();
            obGroupAccountDetail.setAccountNumber(obResponse.getObTemporaryCollectionFeeFileDetail().getAccountNumber());
            obGroupAccountRequest.setObGroupAccountDetail(obGroupAccountDetail);
            OBGroupAccountResponse obGroupAccountResponse = SpringBeanUtil.getBean(CardCoreCardDataProxy.class).sendAndReceive("GroupAccountWS.retrieveByAccountNumber", obGroupAccountRequest, OBGroupAccountResponse.class);

            if (obResponse.getObTemporaryCollectionFeeFileDetail().getNotificationFlag()) {
                log.debug("RM Notification" + obGroupAccountResponse.getObGroupAccountDetail().getRmNotification());
                if (obGroupAccountResponse.getObGroupAccountDetail().getRmNotification() != null && obGroupAccountResponse.getObGroupAccountDetail().getRmNotification().equals("Y")) {
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CollectionProcessForWealthCustomerNotificationWS.class).sendNotification(request);
                } else {
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CollectionFeeNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("EodCardActivationReminderWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardMasterRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardMasterRequest.class);
            OBCardMasterResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardMasterResponse.class);

            // check flag
            if (null != obResponse.getObCardMasterDetail()) {
                if (StringUtil.hasValue(obResponse.getObCardMasterDetail().getCardActivationReminderNotificationFlag())
                        && ("Y").equalsIgnoreCase(obResponse.getObCardMasterDetail().getCardActivationReminderNotificationFlag())
                        && ("CC").equalsIgnoreCase(obResponse.getObCardMasterDetail().getModule())
                ) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardActivationReminderNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("SkipPaymentPlanWS.performSkipPaymentPlanEnrolment(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBSkipPaymentPlanRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBSkipPaymentPlanRequest.class);
            OBSkipPaymentPlanResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBSkipPaymentPlanResponse.class);

            // check flag
            if (null != obResponse.getObSkipPaymentPlanDetail()) {
                if (StringUtil.hasValue(obResponse.getRelieveProgramApproved()) && ("Y").equalsIgnoreCase(obResponse.getRelieveProgramApproved())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(SkipPaymentEnrolmentNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("SkipPaymentPlanWS.performSkipPaymentPlanTermination(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBSkipPaymentPlanRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBSkipPaymentPlanRequest.class);
            OBSkipPaymentPlanResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBSkipPaymentPlanResponse.class);

            // check flag
            if (null != obResponse.getObSkipPaymentPlanDetail()) {
                if (StringUtil.hasValue(obResponse.getRelieveProgramCancel()) && ("Y").equalsIgnoreCase(obResponse.getRelieveProgramCancel())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(SkipPaymentTerminationNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("EodSkipPaymentPlanWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBSkipPaymentPlanRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBSkipPaymentPlanRequest.class);
            OBSkipPaymentPlanResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBSkipPaymentPlanResponse.class);

            // check flag
            if (null != obResponse.getObSkipPaymentPlanDetail()) {
                if (StringUtil.hasValue(obResponse.getRelieveProgramEnd()) && ("Y").equalsIgnoreCase(obResponse.getRelieveProgramEnd())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(SkipPaymentEndNotificationWS.class).sendNotification(request);
                }
            }
        }
//        else if ("CashWithdrawalWS.performIppCashWithdrawal(..)".equals(record.key()) || "CashWithdrawalWS.performCashWithdrawal(..)".equals(record.key())) {
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode node = mapper.readTree(record.value());
//            JsonNode jsonRequest = node.path("obRequest");
//            JsonNode jsonResponse = node.path("obResponse");
//
//            OBCashWithdrawalRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCashWithdrawalRequest.class);
//            OBCashWithdrawalResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCashWithdrawalResponse.class);
//
//            // check flag
//            if(null != obResponse.getObCashWithdrawalDetail()) {
//            	OBNotificationRequest request = new OBNotificationRequest();
//
//            	request.setObRequest(obRequest);
//                request.setObResponse(obResponse);
//
//                OBNotificationResponse obNotificationResponse = null; //SpringBeanUtil.getBean(NotifyDeejungTransactionTransferringWS.class).sendNotification(request);
//
//                if ("CashWithdrawalWS.performIppCashWithdrawal(..)".equals(record.key())) {
//                	if("UCT".equals(obResponse.getObCashWithdrawalDetail().getTransactionSubType())){
//                        obNotificationResponse = SpringBeanUtil.getBean(NotifyAmortizationNotificationWS.class).sendNotification(request);
//                    }
//                    else {
//                        obNotificationResponse = SpringBeanUtil.getBean(DeejungTransferInstallmentNotificationWS.class).sendNotification(request);
//                    }
//                }
//            }
//        }
        if ("CardReplacementWS.performCardReplacement(..)".equals(record.key())
                || "EODCardRenewalWS.processData(..)".equals(record.key())
                || "CardRenewalWS.performForceCardRenewal(..)".equals(record.key())
                || "CardUpgradeOrConversionWS.performCardUpgrade(..)".equals(record.key())) {

            // Virtual One
            OBNotificationRequest request = new OBNotificationRequest();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardMasterRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardMasterRequest.class);
            OBCardMasterResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardMasterResponse.class);

            if ("CardUpgradeOrConversionWS.performCardUpgrade(..)".equals(record.key())) {
                OBCardUpgradeResponse obResponse2 = JSONUtil.decode(jsonResponse.toString(), OBCardUpgradeResponse.class);
                obResponse.setOldObCardMasterDetail(obResponse2.getOldCardMasterDetail());
            }

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            Boolean isReplacement = true;
            if ("CardReplacementWS.performCardReplacement(..)".equals(record.key())) {
                OBCardReplacementRequest obReplacementRequest = JSONUtil.decode(jsonRequest.toString(), OBCardReplacementRequest.class);
                if (!obReplacementRequest.getObCardReplacementDetail().getReplacementType().equals(CardReplacementConstant.REPLACEMENT_TYPE_REPLACEMENT.getCode())) {
                    isReplacement = false;
                }
            }

            if (obResponse.getObCardMasterDetail() != null && obResponse.getObOldCardMasterDetail() != null && isReplacement) {
                OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(VirtualCardRenewalReplacementNotificationWS.class).sendNotification(request);
            }
        } else if ("CardActivationWS.performCardDeactivation(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardActivationRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardActivationRequest.class);
            OBCardActivationResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardActivationResponse.class);

            // check flag
            if (null != obResponse.getObCardActivationDetail()) {
                if (StringUtil.hasValue(obResponse.getObCardActivationDetail().getObCardMasterDetail().getActivationFlag()) && ("D").equalsIgnoreCase(obResponse.getObCardActivationDetail().getObCardMasterDetail().getActivationFlag())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardDeactivationNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("EodAnnualFeeReminderWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardMasterRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardMasterRequest.class);
            OBCardMasterResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardMasterResponse.class);

            // check flag
            if (null != obResponse.getObCardMasterDetail()) {
                if (StringUtil.hasValue(obResponse.getObCardMasterDetail().getAnnualFeeReminderNotificationFlag()) && ("Y").equalsIgnoreCase(obResponse.getObCardMasterDetail().getAnnualFeeReminderNotificationFlag())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(AnnualFeeReminderNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("EodCardClosureReminderWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardMasterRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardMasterRequest.class);
            OBCardMasterResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardMasterResponse.class);

            // check flag
            if (null != obResponse.getObCardMasterDetail()) {
                if (StringUtil.hasValue(obResponse.getObCardMasterDetail().getCardClosureReminderNotificationFlag()) && ("Y").equalsIgnoreCase(obResponse.getObCardMasterDetail().getCardClosureReminderNotificationFlag())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CardClosureReminderNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("AbuWS.performCreateAbu(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBAbuRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBAbuRequest.class);
            OBAbuResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBAbuResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(NotifyCreateAbuWS.class).sendNotification(request);

        } else if ("ParamInterestPricingPlanModelDetailWS.performCopyInterestPricingPlanModelDetail(..)".equals(record.key())
                || "ParamInterestPricingPlanModelDetailWS.performCreateInterestPricingPlanModelDetail(..)".equals(record.key())
                || "ParamInterestPricingPlanModelDetailWS.performUpdateInterestPricingPlanModelDetail(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBParamInterestPricingPlanModelDetailRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBParamInterestPricingPlanModelDetailRequest.class);
            OBParamInterestPricingPlanModelDetailResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBParamInterestPricingPlanModelDetailResponse.class);

            OBNotificationRequest request = new OBNotificationRequest();

            request.setObRequest(obRequest);
            request.setObResponse(obResponse);

            OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(InterestRateAdjustmentNotificationWS.class).sendNotification(request);

        } else if ("EodStatementGenerationReminderWS.processData(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBTempStatementRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBTempStatementRequest.class);
            OBTempStatementResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBTempStatementResponse.class);

            // check flag
            if (null != obResponse.getObTempStatementDetail()) {
                if (StringUtil.hasValue(obResponse.getObTempStatementDetail().getStatementGenerationReminder()) && ("Y").equalsIgnoreCase(obResponse.getObTempStatementDetail().getStatementGenerationReminder())) {
                    OBNotificationRequest request = new OBNotificationRequest();
                    request.setObRequest(obRequest);
                    request.setObResponse(obResponse);

                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(StatementGenerationReminderNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("DisputeTransactionsWS.performUpdateDisputeTransactions(..)".equals(record.key()) || "DisputeTransactionsWS.performCreateDisputeTransactions(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBDisputeTransactionsRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBDisputeTransactionsRequest.class);
            OBDisputeTransactionsResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBDisputeTransactionsResponse.class);

            if (null != obResponse.getObDisputeTransactionsDetail()) {
                OBNotificationRequest request = new OBNotificationRequest();
                request.setObRequest(obRequest);
                request.setObResponse(obResponse);
                if ("V".equals(obResponse.getObDisputeTransactionsDetail().getDisputeStatus()) && "FRT".equals(obResponse.getObDisputeTransactionsDetail().getTeamOwner())) {
                    //Dispute Fraud
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(DisputeTransactionsNotificationWS.class).sendNotification(request);
                } else if ("V".equals(obResponse.getObDisputeTransactionsDetail().getDisputeStatus()) && "DCT".equals(obResponse.getObDisputeTransactionsDetail().getTeamOwner())) {
                    //Dispute Non-Fraud
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(NonFraudDisputeCaseReceivedNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("CardStopWS.performDeleteCardStop(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBCardStopRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBCardStopRequest.class);
            OBCardStopResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBCardStopResponse.class);

            if (null != obResponse.getObCardStopDetail()) {
                OBNotificationRequest request = new OBNotificationRequest();
                request.setObRequest(obRequest);
                request.setObResponse(obResponse);
                if (obResponse.getObCardStopDetail().getUnblockTempBlockNotif() != null && obResponse.getObCardStopDetail().getUnblockTempBlockNotif()) {
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(AccountCancellationOrReinstatementActionNotificationWS.class).sendNotification(request);
                }
            }
        } else if ("IppOrderWS.performCreateIppOrder(..)".equals(record.key())) {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(record.value());
            JsonNode jsonRequest = node.path("obRequest");
            JsonNode jsonResponse = node.path("obResponse");

            OBIppOrderRequest obRequest = JSONUtil.decode(jsonRequest.toString(), OBIppOrderRequest.class);
            OBIppOrderResponse obResponse = JSONUtil.decode(jsonResponse.toString(), OBIppOrderResponse.class);

            if (null != obResponse.getObIppOrderDetailList() && !obResponse.getObIppOrderDetailList().isEmpty()) {
                //Get Transaction Detail
                OBTransactionDetail obTransactionDetail = new OBTransactionDetail();
                OBTransactionRequest obTransactionRequest = new OBTransactionRequest();
                obTransactionDetail.setId(obResponse.getObIppOrderDetailList().get(0).getTransactionId());
                obTransactionRequest.setObTransactionDetail(obTransactionDetail);
                obTransactionRequest.setObHeader(obRequest.getObHeader());
                OBTransactionResponse obTransactionResponse = SpringBeanUtil.getBean(CardCoreTransactionDataProxy.class).sendAndReceive("TransactionWS.retrieveTransactionDetailById", obTransactionRequest, OBTransactionResponse.class);
                obTransactionDetail = obTransactionResponse.getObTransactionDetail();

                String key = "cardcore.noti.deejungTranfer.transactionCode";
                String TC = PropertyUtil.getValue(key);
                if (!StringUtil.hasValue(TC)) {
                    log.debug("pls define TC at system param.[{}]", key);
                }

                OBNotificationRequest request = new OBNotificationRequest();
                request.setObRequest(obRequest);
                request.setObResponse(obResponse);

                if (obTransactionDetail.getTransactionCode().equals(TC)) {
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(NotifyDeejungTransactionTransferringWS.class).sendNotification_(request);
                    OBNotificationResponse obNotificationResponse2 = SpringBeanUtil.getBean(DeejungTransferInstallmentNotificationWS.class).sendNotification_(request);
                } else {
                    OBNotificationResponse obNotificationResponse = SpringBeanUtil.getBean(CallForDeejungNotificationWS.class).sendNotification(request);
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public void run(ApplicationArguments args) throws Exception {
        KafkaListenerEndpointRegistry registry = SpringBeanUtil.getBean(KafkaListenerEndpointRegistry.class);
        MessageListener<String, String> messageListener = (MessageListener<String, String>) Objects.requireNonNull(registry.getListenerContainer(listenerId))
                .getContainerProperties().getMessageListener();

        ConsumerFactory<String, String> pcf = (ConsumerFactory<String, String>) SpringBeanUtil.lookup("parallelConsumerFactory");
        Consumer<String, String> consumer = pcf.createConsumer(groupId, null);
        ParallelStreamProcessor<String, String> processor = KafkaHelper.genParallelConsumerOptions(consumer);
        processor.subscribe(List.of(topicId));
        processor.poll(context -> messageListener.onMessage(context.getSingleConsumerRecord(), null, consumer));
    }
}
