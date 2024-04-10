package com.xyz.cardcore.setup.config;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AcknowledgeMode;
import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory.ConfirmType;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.ClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xyz.cardcore.dto.OBBatchProcessItemExecutionDetail;
import com.xyz.ms.util.StringUtil;

@Configuration
public class RabbitMQConfig {
    private static Logger log = LoggerFactory.getLogger(RabbitMQConfig.class);

    @Autowired
    Environment env;

    @Value("${rabbit.concurrent_min_consumer:1}")
    int minConcurrentConsumer;
    @Value("${rabbit.concurrent_max_consumer:1}")
    int maxConcurrentConsumer;

    @Value("${rabbit.containerFactory:batchRabbitListenerContainerFactory3}")
    String containerFactory;

    @Value("${rabbit.batch_size:500}")
    int rabbitBatchSize;
    @Value("${rabbit.buffer_limit:25000}")
    int rabbitBufferLimit;
    // in second
    @Value("${rabbit.timeout:2}")
    long rabbitTimeOut;

    @Value("${rabbit.prefetch:1}")
    int prefetch;

    @Bean("batchRabbitListenerContainerFactory")
    public SimpleRabbitListenerContainerFactory batchRabbitListenerContainerFactory() {
        SimpleRabbitListenerContainerFactory batchRabbitListenerContainerFactory = new SimpleRabbitListenerContainerFactory();

        batchRabbitListenerContainerFactory.setConnectionFactory(consumerConnectionFactory());
        batchRabbitListenerContainerFactory.setMessageConverter(batchJackson2JsonMessageConverter());

        batchRabbitListenerContainerFactory.setConcurrentConsumers(minConcurrentConsumer);
        batchRabbitListenerContainerFactory.setMaxConcurrentConsumers(maxConcurrentConsumer);

        batchRabbitListenerContainerFactory.setPrefetchCount(prefetch);

        batchRabbitListenerContainerFactory.setDefaultRequeueRejected(false); // requeue false

        return batchRabbitListenerContainerFactory;
    }

    // prefetch 40
    // manual ack
    // concurrency 1
    @Bean("batchRabbitListenerContainerFactory3")
    public SimpleRabbitListenerContainerFactory batchRabbitListenerContainerFactory3() {

        SimpleRabbitListenerContainerFactory batchRabbitListenerContainerFactory = new SimpleRabbitListenerContainerFactory();

        batchRabbitListenerContainerFactory.setConnectionFactory(
                // connectionFactory
                consumerConnectionFactory());
        batchRabbitListenerContainerFactory.setMessageConverter(batchJackson2JsonMessageConverter());

        batchRabbitListenerContainerFactory.setConcurrentConsumers(1);
        batchRabbitListenerContainerFactory.setMaxConcurrentConsumers(1);

        batchRabbitListenerContainerFactory.setPrefetchCount(40);

        batchRabbitListenerContainerFactory.setDefaultRequeueRejected(false); // requeue false

        // no ack/nack for consumer - consumer will die some how
        batchRabbitListenerContainerFactory.setAcknowledgeMode(AcknowledgeMode.MANUAL);

        return batchRabbitListenerContainerFactory;
    }

    public Jackson2JsonMessageConverter batchJackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter jackson2JsonMessageConverter = new Jackson2JsonMessageConverter();
        jackson2JsonMessageConverter.setClassMapper(new ClassMapper() {

            @Override
            public Class<?> toClass(MessageProperties properties) {

                return OBBatchProcessItemExecutionDetail.class;
            }

            @Override
            public void fromClass(Class<?> clazz, MessageProperties properties) {

            }

        });

        return jackson2JsonMessageConverter;
    }

    @Bean("publisherConnectionFactory")
    public CachingConnectionFactory publisherConnectionFactory() {
        CachingConnectionFactory cachingConnectionFactory = _consumerConnectionFactory2("publisher");

        // no define is true
        String publisherConfirmType = getParameter("rabbit.publisher.PublisherConfirm");
        if (!StringUtil.hasValue(publisherConfirmType)) {
            publisherConfirmType = "true";
        }

        if (Boolean.valueOf(publisherConfirmType)) {
            cachingConnectionFactory.setPublisherReturns(true);
            cachingConnectionFactory.setPublisherConfirmType(ConfirmType.CORRELATED);
        }

        String publisher_ChannelCacheSize = getParameter("rabbit.publisher.ChannelCacheSize");
        if (StringUtil.hasValue(publisher_ChannelCacheSize)) {
            cachingConnectionFactory.setChannelCacheSize(Integer.valueOf(publisher_ChannelCacheSize)); // Set the
                                                                                                       // maximum number
                                                                                                       // of channels
        }

        return cachingConnectionFactory;
    }

    @Bean("connectionFactory")
    public CachingConnectionFactory consumerConnectionFactory() {
        return _consumerConnectionFactory2("consumer1");
    }

    public CachingConnectionFactory _consumerConnectionFactory2(String postFixName) {

        CachingConnectionFactory cachingConnectionFactory = connectionFactoryBase();

        cachingConnectionFactory.setConnectionNameStrategy(f -> {

            String hostName = null;
            try {
                hostName = InetAddress.getLocalHost().getHostName();
            } catch (UnknownHostException e) {
                hostName = System.getenv("COMPUTERNAME");// window OS

                if (!StringUtil.hasValue(hostName)) {
                    hostName = System.getenv("HOSTNAME");// LINUX
                }
            }
            return hostName + "-" + postFixName;
        });

        return cachingConnectionFactory;
    }

    public CachingConnectionFactory connectionFactoryBase() {

        String ip = System.getProperty("queue.ip");
        String port = System.getProperty("queue.port");
        String username = env.getProperty("queue.username");
        String password = env.getProperty("queue.password");
        String virtualHost = System.getProperty("queue.virtualHost");
        boolean useSsl = Boolean.getBoolean("queue.ssl");

        if (!StringUtil.hasValue(ip)) {
            ip = "rabbitmq.dev.cardx.aliyun.xyzcloud.tech";
        }
        if (!StringUtil.hasValue(port)) {
            port = "14102";
        }
        if (!StringUtil.hasValue(username)) {
            username = "user";
        }
        if (!StringUtil.hasValue(password)) {
            password = "Pikachu@9394";
        }
        if (!StringUtil.hasValue(virtualHost)) {
            virtualHost = "/cardx-dev";
        }

        CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory();
        cachingConnectionFactory.setHost(ip);
        cachingConnectionFactory.setPort(Integer.valueOf(port));
        cachingConnectionFactory.setUsername(username);
        cachingConnectionFactory.setPassword(password);
        cachingConnectionFactory.setVirtualHost(virtualHost);

        cachingConnectionFactory.setConnectionNameStrategy(f -> {

            String hostName = null;
            try {
                hostName = InetAddress.getLocalHost().getHostName();
            } catch (UnknownHostException e) {
                hostName = System.getenv("COMPUTERNAME");// window OS

                if (!StringUtil.hasValue(hostName)) {
                    hostName = System.getenv("HOSTNAME");// LINUX
                }
            }
            return hostName;
        });

        if (useSsl) {
            try {
                log.debug("Using SSL");
                cachingConnectionFactory.getRabbitConnectionFactory().useSslProtocol();
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }
        }

        // https://www.rabbitmq.com/heartbeats.html#:~:text=The%20heartbeat%20timeout%20value%20defines,be%20configured%20to%20request%20heartbeats.
        cachingConnectionFactory.setRequestedHeartBeat(0);

        return cachingConnectionFactory;
    }

    @Bean("rabbitTemplate")
    public RabbitTemplate rabbitTemplate() {

        RabbitTemplate rabbitTemplate = new RabbitTemplate(
                // connectionFactory()

                // consumerConnectionFactory()
                publisherConnectionFactory());
        rabbitTemplate.setMessageConverter(converter());
        rabbitTemplate.setMandatory(true);

        return rabbitTemplate;

    }

    // @Bean
    public Jackson2JsonMessageConverter converter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.setSerializationInclusion(Include.NON_NULL);
        objectMapper.setSerializationInclusion(Include.NON_DEFAULT);
        objectMapper.setSerializationInclusion(Include.NON_ABSENT);
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    // toauto create queue
    @Bean
    public AmqpAdmin amqpAdmin() {
        return new RabbitAdmin(
                // connectionFactoryBase()
                consumerConnectionFactory()
        // publisherConnectionFactory()
        );
    }

    @Bean("setupTopicDestinations")
    public String setupTopicDestinations() {
        queueNames().forEach((key, destination) -> {
            // Queue queue = new Queue(destination.get("queues"));

            Map<String, Object> args = new HashMap<>();
            // args.put("x-queue-type", "quorum"); // quorum type queue

            // args.put("x-max-length", 1000000);//max in memory, other will discass

            // https://www.rabbitmq.com/lazy-queues.html
            args.put("x-queue-mode", "lazy");// store in disk

            Queue queue = new Queue(destination.get("queues"), true, false, false, args);

            amqpAdmin().declareQueue(queue);
            amqpAdmin().declareBinding(BindingBuilder.bind(queue).to(new DirectExchange("")).withQueueName());

        });

        return "";
    }

    @Bean
    public Map<String, Map<String, String>> queueNames() {

        String prefix = getActiveProfie().toLowerCase();

        // temp add SIT .as Chai request
        if ("DEV".equalsIgnoreCase(prefix)
                || "SIT".equalsIgnoreCase(prefix)) {

            prefix = prefix + "-" + System.getProperty("user.name");
        }

        Map<String, Map<String, String>> map = new LinkedHashMap<>();

        map.put("retrieveItemAndPushToQueueServiceQueue", constructQueueValueMap(
                "retrieveItemAndPushToQueueServiceQueue", prefix + "-retrieveItemAndPushToQueueService-Queue"));
        map.put("retrieveProcessingListServiceQueue", constructQueueValueMap("retrieveProcessingListServiceQueue",
                prefix + "-retrieveProcessingListService-Queue"));

        map.put("groupAccountMasterProcessQueue",
                constructQueueValueMap("groupAccountMasterProcessQueue", prefix + "-groupAccountMasterProcess-Queue"));
        map.put("triggerReminderQueue",
                constructQueueValueMap("triggerReminderQueue", prefix + "-triggerReminderQueue-Queue"));

        // patching
        map.put("eodPatchCXDP2234_4_PaymentPostingQueue",
                constructQueueValueMap("eodPatchCXDP2234_4_PaymentPostingQueue",
                        prefix + "-card-eodPatchCXDP2234_4_PaymentPostingQueue-Queue"));

        map.put("eodPatchCXDP2234_2_TempTableQueue", constructQueueValueMap("eodPatchCXDP2234_2_TempTableQueue",
                prefix + "-card-eodPatchCXDP2234_2_TempTableQueue-Queue"));
        map.put("eodPatchCXDP2234_2_2_ReconcileGACurBalQueue",
                constructQueueValueMap("eodPatchCXDP2234_2_2_ReconcileGACurBalQueue",
                        prefix + "-card-eodPatchCXDP2234_2_2_ReconcileGACurBalQueue-Queue"));
        map.put("eodPatchCXDP2234_2_4_ReconcilePMTQueue",
                constructQueueValueMap("eodPatchCXDP2234_2_4_ReconcilePMTQueue",
                        prefix + "-card-eodPatchCXDP2234_2_4_ReconcilePMTQueue-Queue"));

        map.put("eodPatchCXDP2234_3_0_CurrentBalanceQueue",
                constructQueueValueMap("eodPatchCXDP2234_3_0_CurrentBalanceQueue",
                        prefix + "-card-eodPatchCXDP2234_3_0_CurrentBalanceQueue-Queue"));
        map.put("eodPatchCXDP2234_3_0B_OpeningSANegativeQueue",
                constructQueueValueMap("eodPatchCXDP2234_3_0B_OpeningSANegativeQueue",
                        prefix + "-card-eodPatchCXDP2234_3_0B_OpeningSANegativeQueue-Queue"));
        map.put("eodPatchCXDP2234_3_1_UnpaidIppQueue", constructQueueValueMap("eodPatchCXDP2234_3_1_UnpaidIppQueue",
                prefix + "-card-eodPatchCXDP2234_3_1_UnpaidIppQueue-Queue"));
        map.put("eodPatchCXDP2234_3_2_UnpaidIpiQueue", constructQueueValueMap("eodPatchCXDP2234_3_2_UnpaidIpiQueue",
                prefix + "-card-eodPatchCXDP2234_3_2_UnpaidIpiQueue-Queue"));

        map.put("eodPatchCXDP2234_OvrpmtHistoryDeleteQueue",
                constructQueueValueMap("eodPatchCXDP2234_OvrpmtHistoryDeleteQueue",
                        prefix + "-card-eodPatchCXDP2234_OvrpmtHistoryDeleteQueue-Queue"));
        map.put("eodPatchCXDP2234_OvrpmtHistoryRegenQueue",
                constructQueueValueMap("eodPatchCXDP2234_OvrpmtHistoryRegenQueue",
                        prefix + "-card-eodPatchCXDP2234_OvrpmtHistoryRegenQueue-Queue"));
        map.put("eodPatchCXDP2234TCBasedPurgingExtractionQueue",
                constructQueueValueMap("eodPatchCXDP2234TCBasedPurgingExtractionQueue",
                        prefix + "-card-eodPatchCXDP2234TCBasedPurgingExtractionQueue-Queue"));
        map.put("eodPatchCXDP2234TCBasedPurgingRejectedQueue",
                constructQueueValueMap("eodPatchCXDP2234TCBasedPurgingRejectedQueue",
                        prefix + "-card-eodPatchCXDP2234TCBasedPurgingRejectedQueue-Queue"));
        map.put("eodGlCheckEntryDateQueue",
                constructQueueValueMap("eodGlCheckEntryDateQueue", prefix + "-card-eodGlCheckEntryDateQueue-Queue"));
        map.put("glTransactionPaymentRegenQueue", constructQueueValueMap("glTransactionPaymentRegenQueue",
                prefix + "-card-glTransactionPaymentRegenQueue-Queue"));
        map.put("glTransactionPaymentReAllocationRegenQueue",
                constructQueueValueMap("glTransactionPaymentReAllocationRegenQueue",
                        prefix + "-card-glTransactionPaymentReAllocationRegenQueue-Queue"));
        map.put("glPaymentKnockoffTransactionRegenQueue",
                constructQueueValueMap("glPaymentKnockoffTransactionRegenQueue",
                        prefix + "-card-glPaymentKnockoffTransactionRegenQueue-Queue"));

        map.put("eodPatchCXDP2160Queue",
                constructQueueValueMap("eodPatchCXDP2160Queue", prefix + "-card-patchCXDP2160-Queue"));
        map.put("cardEmbossingQueue", constructQueueValueMap("cardEmbossingQueue", prefix + "-card-embossing-Queue"));
        map.put("cardRenewalQueue", constructQueueValueMap("cardRenewalQueue", prefix + "-card-renewal-Queue"));
        map.put("issuingGLSimpleEODQueue",
                constructQueueValueMap("issuingGLSimpleEODQueue", prefix + "-card-issuingGLSimpleEOD-Queue"));
        map.put("mastercardIncomingQueue",
                constructQueueValueMap("mastercardIncomingQueue", prefix + "-card-mastercardIncoming-Queue"));
        map.put("eodPatchCXDP2234_5_1_RebuildIntBalPymtQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_1_RebuildIntBalPymtQueue",
                        prefix + "-card-eodPatchCXDP2234_5_1_RebuildIntBalPymt-Queue"));
        map.put("eodPatchCXDP2234_5_0_RebuildIntBalTrxFeeQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_0_RebuildIntBalTrxFeeQueue",
                        prefix + "-card-eodPatchCXDP2234_5_0_RebuildIntBalTrxFee-Queue"));
        map.put("eodPatchCXDP2234_5_1_MainRebuildIntBalPymtQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_1_MainRebuildIntBalPymtQueue",
                        prefix + "-card-eodPatchCXDP2234_5_1_MainRebuildIntBalPymt-Queue"));
        map.put("eodPatchCXDP2234_5_1_ReallocateExcessQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_1_ReallocateExcessQueue",
                        prefix + "-card-eodPatchCXDP2234_5_1_ReallocateExcess-Queue"));
        map.put("eodPatchCXDP2234_5_1_CheckEntryDateQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_1_CheckEntryDateQueue",
                        prefix + "-card-eodPatchCXDP2234_5_1_CheckEntryDate-Queue"));
        map.put("eodPatchCXDP2234_5_1_CallbackQueue", constructQueueValueMap("eodPatchCXDP2234_5_1_CallbackQueue",
                prefix + "-card-eodPatchCXDP2234_5_1_Callback-Queue"));
        map.put("eodPatchCXDP2234_5_1_NotifyCallBackQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_1_NotifyCallBackQueue",
                        prefix + "-card-eodPatchCXDP2234_5_1_NotifyCallBack-Queue"));
        map.put("eodPatchCXDP2234_5_1_2ReallocateTempPPHQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_1_2ReallocateTempPPHQueue",
                        prefix + "-card-eodPatchCXDP2234_5_1_2ReallocateTempPPH-Queue"));
        map.put("eodPatchCXDP2234_5_2_SyncSACbalQueue", constructQueueValueMap("eodPatchCXDP2234_5_2_SyncSACbalQueue",
                prefix + "-card-eodPatchCXDP2234_5_2_SyncSACbalQueue-Queue"));
        map.put("eodPatchCXDP2234_5_3_ReallocatedSubQueue",
                constructQueueValueMap("eodPatchCXDP2234_5_3_ReallocatedSubQueue",
                        prefix + "-card-eodPatchCXDP2234_5_3_ReallocatedSubQueue-Queue"));
        map.put("eodPatchCXDP2234P5RecalPrevIntBearingQueue",
                constructQueueValueMap("eodPatchCXDP2234P5RecalPrevIntBearingQueue",
                        prefix + "-card-eodPatchCXDP2234P5RecalPrevIntBearingQueue-Queue"));

        map.put("eodPatchCXDP2234_6_1A_UnbilledStatementSAQueue",
                constructQueueValueMap("eodPatchCXDP2234_6_1A_UnbilledStatementSAQueue",
                        prefix + "-card-eodPatchCXDP2234_6_1A_UnbilledStatementSAQueue-Queue"));
        map.put("eodPatchCXDP2234_6_1B_UnbilledStatementTGQueue",
                constructQueueValueMap("eodPatchCXDP2234_6_1B_UnbilledStatementTGQueue",
                        prefix + "-card-eodPatchCXDP2234_6_1B_UnbilledStatementTGQueue-Queue"));
        map.put("eodPatchCXDP2234_6_1C_UnbilledStatementGAQueue",
                constructQueueValueMap("eodPatchCXDP2234_6_1C_UnbilledStatementGAQueue",
                        prefix + "-card-eodPatchCXDP2234_6_1C_UnbilledStatementGAQueue-Queue"));
        map.put("eodPatchCXDP2234_6_1_AccruedInterestQueue",
                constructQueueValueMap("eodPatchCXDP2234_6_1_AccruedInterestQueue",
                        prefix + "-card-eodPatchCXDP2234_6_1_AccruedInterest-Queue"));
        map.put("eodPatchCXDP2234_6_2_CapitalizedQueue", constructQueueValueMap("eodPatchCXDP2234_6_2_CapitalizedQueue",
                prefix + "-card-eodPatchCXDP2234_6_2_CapitalizedQueue-Queue"));
        map.put("eodPatchCXDP2234_6_4_CardNoteQueue", constructQueueValueMap("eodPatchCXDP2234_6_4_CardNoteQueue",
                prefix + "-card-eodPatchCXDP2234_6_4_CardNoteQueue-Queue"));

        map.put("mastercardPostOutgoingInterchangeQueue", constructQueueValueMap(
                "mastercardPostOutgoingInterchangeQueue", prefix + "-card-mastercardPostOutgoingInterchange-Queue"));
        map.put("mastercardProcessIncomingInterchangeQueue",
                constructQueueValueMap("mastercardProcessIncomingInterchangeQueue",
                        prefix + "-card-mastercardProcessIncomingInterchange-Queue"));
        map.put("mastercardProcessOutgoingInterchangeQueue",
                constructQueueValueMap("mastercardProcessOutgoingInterchangeQueue",
                        prefix + "-card-mastercardProcessOutgoingInterchange-Queue"));
        // map.put("visacardPostIncomingInterchangeQueue",constructQueueValueMap("visacardPostIncomingInterchangeQueue",
        // prefix + "-card-visacardPostIncomingInterchange-Queue"));
        map.put("visacardPostOutgoingInterchangeQueue", constructQueueValueMap("visacardPostOutgoingInterchangeQueue",
                prefix + "-card-visacardPostOutgoingInterchange-Queue"));
        map.put("visacardProcessIncomingInterchangeQueue", constructQueueValueMap(
                "visacardProcessIncomingInterchangeQueue", prefix + "-card-visacardProcessIncomingInterchange-Queue"));
        map.put("visacardProcessOutgoingInterchangeQueue", constructQueueValueMap(
                "visacardProcessOutgoingInterchangeQueue", prefix + "-card-visacardProcessOutgoingInterchange-Queue"));
        map.put("mpeUpdateParameterTableQueue",
                constructQueueValueMap("mpeUpdateParameterTableQueue", prefix + "-card-mpeUpdateParameterTable-Queue"));

        map.put("mastercardProcessIncomingFileQueue", constructQueueValueMap("mastercardProcessIncomingFileQueue",
                prefix + "-card-mastercardProcessIncomingFile-Queue"));
        map.put("mastercardProcessOutgoingFileQueue", constructQueueValueMap("mastercardProcessOutgoingFileQueue",
                prefix + "-card-mastercardProcessOutgoingFile-Queue"));
        map.put("visacardProcessIncomingFileQueue", constructQueueValueMap("visacardProcessIncomingFileQueue",
                prefix + "-card-visacardProcessIncomingFile-Queue"));
        map.put("visacardProcessOutgoingFileQueue", constructQueueValueMap("visacardProcessOutgoingFileQueue",
                prefix + "-card-visacardProcessOutgoingFile-Queue"));
        map.put("visacardProcessOutgoingInterchangeReconQueue", constructQueueValueMap(
                "visacardProcessOutgoingInterchangeReconQueue", prefix + "-card-visacardProcessOutgoing-recon-Queue"));

        map.put("mpeProcessIncomingFileQueue",
                constructQueueValueMap("mpeProcessIncomingFileQueue", prefix + "-card-mpeProcessIncomingFile-Queue"));
        map.put("visaProcessIncomingVisaParameterFileQueue",
                constructQueueValueMap("visaProcessIncomingVisaParameterFileQueue",
                        prefix + "-card-visaProcessIncomingVisaParameterFile-Queue"));
        map.put("visaUpdateParameterTableQueue", constructQueueValueMap("visaUpdateParameterTableQueue",
                prefix + "-card-visaUpdateParameterTable-Queue"));

        map.put("ippPreOrderQueue", constructQueueValueMap("ippPreOrderQueue", prefix + "-card-ippPreOrder-Queue"));
        map.put("ippOrderQueue", constructQueueValueMap("ippOrderQueue", prefix + "-card-ippOrder-Queue"));
        map.put("eodMonitorIppAgreementStatusQueue", constructQueueValueMap("eodMonitorIppAgreementStatusQueue",
                prefix + "-card-eodMonitorIppAgreementStatus-Queue"));
        // map.put("notifyRelieveProgramEndQueue",constructQueueValueMap("notifyRelieveProgramEndQueue",
        // prefix + "-card-notifyRelieveProgramEnd-Queue"));

        // map.put("ISSInQueue",constructQueueValueMap("ISSInQueue", prefix +
        // "-iss-in-Queue"));
        // map.put("ISSOutQueue",constructQueueValueMap("sampleEodQueue", prefix +
        // "-iss-Out-Queue"));

        map.put("eodPaymentKnockoffConversionQueue", constructQueueValueMap("eodPaymentKnockoffConversionQueue",
                prefix + "-card-eodPaymentKnockoffConversionQueue-Queue"));
        map.put("paymentPostingQueue",
                constructQueueValueMap("paymentPostingQueue", prefix + "-card-paymentPosting-Queue"));
        map.put("transactionPostingQueue",
                constructQueueValueMap("transactionPostingQueue", prefix + "-card-transactionPosting-Queue"));
        map.put("eodNightTrxPostingQueue",
                constructQueueValueMap("eodNightTrxPostingQueue", prefix + "-card-eodNightTrxPostingQueue-Queue"));
        map.put("eodAccruedInterestQueue",
                constructQueueValueMap("eodAccruedInterestQueue", prefix + "-card-accruedInterest-Queue"));
        map.put("eodAutoMonitorAccountInArrearsQueue", constructQueueValueMap("eodAutoMonitorAccountInArrearsQueue",
                prefix + "-card-autoMonitorAccountInArrears-Queue"));
        map.put("eodCapitalizedInterestQueue",
                constructQueueValueMap("eodCapitalizedInterestQueue", prefix + "-card-capitalizedInterest-Queue"));
        map.put("eodCardAdminRollDateQueue",
                constructQueueValueMap("eodCardAdminRollDateQueue", prefix + "-card-cardAdminRollDate-Queue"));
        map.put("eodCardAdminUpdateLatestProcessingDateQueue", constructQueueValueMap(
                "eodCardAdminUpdateLatestProcessingDateQueue", prefix + "-card-cardAdminUpdateLatestProcessing-Queue"));
        map.put("eodCardStatusMonitoringQueue",
                constructQueueValueMap("eodCardStatusMonitoringQueue", prefix + "-card-cardStatusMonitoring-Queue"));
        map.put("eodLimitAdjustmentProcessingQueue", constructQueueValueMap("eodLimitAdjustmentProcessingQueue",
                prefix + "-card-limitAdjustmentProcessing-Queue"));
        map.put("eodLatePaymentFeeQueue",
                constructQueueValueMap("eodLatePaymentFeeQueue", prefix + "-card-latePaymentFee-Queue"));
        map.put("eodStatementFeeQueue",
                constructQueueValueMap("eodStatementFeeQueue", prefix + "-card-statementFee-Queue"));
        map.put("eodOverlimitFeeQueue",
                constructQueueValueMap("eodOverlimitFeeQueue", prefix + "-card-overlimitFee-Queue"));
        map.put("eodWarehouseTempFeeQueue",
                constructQueueValueMap("eodWarehouseTempFeeQueue", prefix + "-card-warehouseTempFee-Queue"));
        map.put("eodProcessExcessPaymentQueue", constructQueueValueMap("eodProcessExcessPaymentQueue",
                prefix + "-card-eodProcessExcessPaymentQueue-Queue"));
        map.put("eodProcessReallocatedPaymentQueue", constructQueueValueMap("eodProcessReallocatedPaymentQueue",
                prefix + "-card-eodProcessReallocatedPayment-Queue"));
        map.put("eodProcessReallocatedPaymentForSubAccountQueue",
                constructQueueValueMap("eodProcessReallocatedPaymentForSubAccountQueue",
                        prefix + "-card-eodProcessReallocatedPaymentForSubAccountQueue-Queue"));
        map.put("eodTempTransactionsQueue",
                constructQueueValueMap("eodTempTransactionsQueue", prefix + "-card-eodTempTransactionsQueue-Queue"));
        map.put("eodTempFeeQueue", constructQueueValueMap("eodTempFeeQueue", prefix + "-card-eodTempFeeQueue-Queue"));
        map.put("eodCoBrandUpdateQueue",
                constructQueueValueMap("eodCoBrandUpdateQueue", prefix + "-card-eodCoBrandUpdateQueue-Queue"));
        map.put("eodOverDpdQueue", constructQueueValueMap("eodOverDpdQueue", prefix + "-card-eodOverDpdQueue-Queue"));

        // Batch Job Validation
        map.put("eodBatchJobValidationVisaAndMasterQueue",
                constructQueueValueMap("eodBatchJobValidationVisaAndMasterQueue",
                        prefix + "-card-eodBatchJobValidationVisaAndMasterQueue-Queue"));
        map.put("eodBatchJobValidationAtmQueue", constructQueueValueMap("eodBatchJobValidationAtmQueue",
                prefix + "-card-eodBatchJobValidationAtmQueue-Queue"));
        map.put("eodBatchJobValidationOlsQueue", constructQueueValueMap("eodBatchJobValidationOlsQueue",
                prefix + "-card-eodBatchJobValidationOlsQueue-Queue"));
        map.put("eodBatchJobValidationPmhQueue", constructQueueValueMap("eodBatchJobValidationPmhQueue",
                prefix + "-card-eodBatchJobValidationPmhQueue-Queue"));
        map.put("eodBatchJobValidationBTwoKQueue", constructQueueValueMap("eodBatchJobValidationBTwoKQueue",
                prefix + "-card-eodBatchJobValidationBTwoKQueue-Queue"));
        map.put("eodBatchJobValidationLisQueue", constructQueueValueMap("eodBatchJobValidationLisQueue",
                prefix + "-card-eodBatchJobValidationLisQueue-Queue"));
        map.put("eodBatchJobValidationEfsQueue", constructQueueValueMap("eodBatchJobValidationEfsQueue",
                prefix + "-card-eodBatchJobValidationEfsQueue-Queue"));

        // Tables Snapshot
        map.put("eodTablesSnapshotQueue",
                constructQueueValueMap("eodTablesSnapshotQueue", prefix + "-card-eodTablesSnapshotQueue-Queue"));

        map.put("eodMonitorAccountAtDueDateOrStatementDateQueue",
                constructQueueValueMap("eodMonitorAccountAtDueDateOrStatementDateQueue",
                        prefix + "-card-monitorAccountAtDueDateOrStatementDate-Queue"));
        map.put("eodMonitorNewAccountIntoArrearsQueue", constructQueueValueMap("eodMonitorNewAccountIntoArrearsQueue",
                prefix + "-card-monitorNewAccountIntoArrears-Queue"));
        map.put("eodMonitorPaymentDueAlertQueue", constructQueueValueMap("eodMonitorPaymentDueAlertQueue",
                prefix + "-card-monitorPaymentDueAlert-Queue"));
        map.put("eodUnMatchAuthorizationRemovalQueue", constructQueueValueMap("eodUnMatchAuthorizationRemovalQueue",
                prefix + "-card-unMatchAuthorizationRemoval-Queue"));
        // map.put("eodReallocatedPaymentQueue",constructQueueValueMap("eodReallocatedPaymentQueue",
        // prefix + "-card-reallocatedPayment-Queue"));
        map.put("eodAuthToTempTransactionsQueue", constructQueueValueMap("eodAuthToTempTransactionsQueue",
                prefix + "-card-eodAuthToTempTransactionsQueue-Queue"));
        map.put("eodSkipPaymentPlanQueue",
                constructQueueValueMap("eodSkipPaymentPlanQueue", prefix + "-card-skipPaymentPlan-Queue"));
        map.put("eodMonitorAccProcessingDateAgainstHolidayQueue",
                constructQueueValueMap("eodMonitorAccProcessingDateAgainstHolidayQueue",
                        prefix + "-card-monitorAccProcessingDateAgainstHoliday-Queue"));
        map.put("eodMonitorPrivilegeCodeQueue", constructQueueValueMap("eodMonitorPrivilegeCodeQueue",
                prefix + "-card-monitorPrivilegeCodeQueue-Queue"));
        map.put("eodPriorityPassUpdateQueue",
                constructQueueValueMap("eodPriorityPassUpdateQueue", prefix + "-card-priorityPassUpdateQueue-Queue"));
        map.put("eodTemporarySkipPaymentQueue", constructQueueValueMap("eodTemporarySkipPaymentQueue",
                prefix + "-card-temporarySkipPaymentQueue-Queue"));
        map.put("eodParamIppChannelMappingQueue", constructQueueValueMap("eodParamIppChannelMappingQueue",
                prefix + "-card-paramIppChannelMappingQueue-Queue"));
        map.put("eodPrivilegeCodeUpdateQueue",
                constructQueueValueMap("eodPrivilegeCodeUpdateQueue", prefix + "-card-privilegeCodeUpdateQueue-Queue"));
        map.put("eodTempCardRenewalQueue",
                constructQueueValueMap("eodTempCardRenewalQueue", prefix + "-card-tempCardRenewalQueue-Queue"));

        map.put("eodProcessAutoTurnNPLorCHOQueue", constructQueueValueMap("eodProcessAutoTurnNPLorCHOQueue",
                prefix + "-card-processAutoTurnNPLorCHO-Queue"));
        map.put("eodProcessNPLQueue", constructQueueValueMap("eodProcessNPLQueue", prefix + "-card-processNPL-Queue"));
        map.put("eodProcessCHOQueue", constructQueueValueMap("eodProcessCHOQueue", prefix + "-card-processCHO-Queue"));
        map.put("eodProcessManualCHOService",
                constructQueueValueMap("eodProcessManualCHOService", prefix + "-card-processManualCHO-Queue"));
        map.put("eodProcessWROQueue", constructQueueValueMap("eodProcessWROQueue", prefix + "-card-processWRO-Queue"));
        map.put("eodProcessNPLEOMQueue",
                constructQueueValueMap("eodProcessNPLEOMQueue", prefix + "-card-processNPLEOM-Queue"));
        map.put("eodProcessCHOEOMQueue",
                constructQueueValueMap("eodProcessCHOEOMQueue", prefix + "-card-processCHOEOM-Queue"));
        map.put("eodProcessLQDQueue", constructQueueValueMap("eodProcessLQDQueue", prefix + "-card-processLQD-Queue"));

        map.put("eodProcessAnnualSpendingHistoryQueue", constructQueueValueMap("eodProcessAnnualSpendingHistoryQueue",
                prefix + "-card-processAnnualSpendingHistory-Queue"));
        map.put("eodTempStatementQueue",
                constructQueueValueMap("eodTempStatementQueue", prefix + "-card-tempStatement-Queue"));
        map.put("eodTempPaymentHierarchyQueue",
                constructQueueValueMap("eodTempPaymentHierarchyQueue", prefix + "-card-tempPaymentHierarchy-Queue"));

        map.put("eodCollectionFeeMonitoringQueue", constructQueueValueMap("eodCollectionFeeMonitoringQueue",
                prefix + "-card-eodCollectionFeeMonitoring-Queue"));

        map.put("eodUnMatchAuthorizationRemovalQueue", constructQueueValueMap("eodUnMatchAuthorizationRemovalQueue",
                prefix + "-card-unMatchAuthorizationRemoval-Queue"));

        map.put("nplMonthlyMovementQueue",
                constructQueueValueMap("nplMonthlyMovementQueue", prefix + "-card-nplMonthlyMovement-Queue"));
        map.put("chargeOffMonthlyMovementDetailQueue", constructQueueValueMap("chargeOffMonthlyMovementDetailQueue",
                prefix + "-card-chargeOffMonthlyMovementDetail-Queue"));
        map.put("interestBearingBalanceQueue",
                constructQueueValueMap("interestBearingBalanceQueue", prefix + "-card-interestBearingBalance-Queue"));
        map.put("visaInterchangeFeeQueue",
                constructQueueValueMap("visaInterchangeFeeQueue", prefix + "-card-visaInterchangeFee-Queue"));
        map.put("unclaimedMoniesQueue",
                constructQueueValueMap("unclaimedMoniesQueue", prefix + "-card-unclaimedMonies-Queue"));
        map.put("interchangeFeesQueue",
                constructQueueValueMap("interchangeFeesQueue", prefix + "-card-interchangeFees-Queue"));

        // GL
        map.put("glInterchangeFeesQueue",
                constructQueueValueMap("glInterchangeFeesQueue", prefix + "-card-glInterchangeFees-Queue"));
        map.put("glDailyAnticipatedInterestQueue", constructQueueValueMap("glDailyAnticipatedInterestQueue",
                prefix + "-card-glDailyAnticipatedInterest-Queue"));
        map.put("glTransactionPaymentQueue",
                constructQueueValueMap("glTransactionPaymentQueue", prefix + "-card-glTransactionPayment-Queue"));
        map.put("glTransactionQueue",
                constructQueueValueMap("glTransactionQueue", prefix + "-card-glTransaction-Queue"));
        map.put("glTransactionPaymentReAllocationQueue", constructQueueValueMap("glTransactionPaymentReAllocation",
                prefix + "-card-glTransactionPaymentReAllocation-Queue"));
        map.put("glPaymentKnockoffTransactionQueue", constructQueueValueMap("glPaymentKnockoffTransactionQueue",
                prefix + "-card-glPaymentKnockoffTransaction-Queue"));
        map.put("glExtractionTempQueue",
                constructQueueValueMap("glExtractionTempQueue", prefix + "-card-glExtractionTemp-Queue"));
        map.put("glPreviousDayReversalQueue",
                constructQueueValueMap("glPreviousDayReversalQueue", prefix + "-card-glPreviousDayReversal-Queue"));
        map.put("glRegenerateQueue", constructQueueValueMap("glRegenerateQueue", prefix + "-card-glRegenerate-Queue"));
        map.put("glDailyIppInterestAccrualQueue", constructQueueValueMap("glDailyIppInterestAccrualQueue",
                prefix + "-card-glDailyIppInterestAccrualQueue-Queue"));
        // map.put("glDailyInterestAccuralBalanceQueue",constructQueueValueMap("glDailyInterestAccuralBalanceQueue",
        // prefix + "-card-glDailyInterestAccuralBalance-Queue"));
        map.put("dailyInterestAccrualHistoryQueue", constructQueueValueMap("dailyInterestAccrualHistoryQueue",
                prefix + "-card-dailyInterestAccrualHistoryQueue-Queue"));
        // map.put("taxChargeOffEOMProcessingQueue",constructQueueValueMap("taxChargeOffEOMProcessingQueue",
        // prefix + "-card-taxChargeOffEOMProcessing-Queue"));
        // map.put("glTaxChargeOffEOMProcessingQueue",constructQueueValueMap("glTaxChargeOffEOMProcessingQueue",
        // prefix + "-card-glTaxChargeOffEOMProcessing-Queue"));
        // map.put("glAccountRepaymentExtractionQueue",constructQueueValueMap("glAccountRepaymentExtractionQueue",
        // prefix + "-card-glAccountRepaymentExtraction-Queue"));
        // map.put("glAccountUpdatingQueue",constructQueueValueMap("glAccountUpdatingQueue",
        // prefix + "-card-glAccountUpdating-Queue"));
        // map.put("glTaxChargeOffProcessingQueue",constructQueueValueMap("glTaxChargeOffProcessingQueue",
        // prefix + "-card-glTaxChargeOffProcessing-Queue"));
        map.put("glMovePrevDayRevToExtractTmpQueue", constructQueueValueMap("glMovePrevDayRevToExtractTmpQueue",
                prefix + "-card-glMovePrevDayRevToExtractTmpQueue-Queue"));
        map.put("glSumTodayCurrentOutstandingQueue", constructQueueValueMap("glSumTodayCurrentOutstandingQueue",
                prefix + "-card-glSumTodayCurrentOutstanding-Queue"));
        map.put("glInterchangeFeesTotalQueue",
                constructQueueValueMap("glInterchangeFeesTotalQueue", prefix + "-card-glInterchangeFeesTotal-Queue"));
        map.put("glChargeOffAccountUnbilledIppQueue", constructQueueValueMap("glChargeOffAccountUnbilledIppQueue",
                prefix + "-card-glChargeOffAccountUnbilledIpp-Queue"));

        map.put("processFirstJanAmountNplQueue", constructQueueValueMap("processFirstJanAmountNplQueue",
                prefix + "-card-processFirstJanAmountNpl-Queue"));
        map.put("processFirstJanAmountChargeOffQueue", constructQueueValueMap("processFirstJanAmountChargeOffQueue",
                prefix + "-card-processFirstJanAmountChargeOff-Queue"));
        map.put("accountCancellationReinstatementQueue", constructQueueValueMap("accountCancellationReinstatementQueue",
                prefix + "-card-accountCancellationReinstatementQueue-Queue"));

        map.put("eodAutoMonitorAccountInArrearsQueue", constructQueueValueMap("eodAutoMonitorAccountInArrearsQueue",
                prefix + "-card-eodAutoMonitorAccountInArrearsQueue-Queue"));
        map.put("eodLatePaymentFeeQueue",
                constructQueueValueMap("eodLatePaymentFeeQueue", prefix + "-card-eodLatePaymentFeeQueue-Queue"));
        map.put("eodWarehouseTempFeeQueue",
                constructQueueValueMap("eodWarehouseTempFeeQueue", prefix + "-card-eodWarehouseTempFeeQueue-Queue"));
        map.put("notesPurgingQueue",
                constructQueueValueMap("notesPurgingQueue", prefix + "-card-notesPurgingQueue-Queue"));
        map.put("annualFeeQueue", constructQueueValueMap("annualFeeQueue", prefix + "-card-annualFeeQueue-Queue"));
        map.put("eodStatementUpdateCycleDateQueue", constructQueueValueMap("eodStatementUpdateCycleDateQueue",
                prefix + "-card-eodStatementUpdateCycleDateQueue-Queue"));

        // eodNotifyCardCoreJobEndQueue
        map.put("eodNotifyCardCoreJobEndQueue", constructQueueValueMap("eodNotifyCardCoreJobEndQueue",
                prefix + "-card-eodNotifyCardCoreJobEndQueue-Queue"));

        map.put("eodNotifyLoyaltyStartEodQueue", constructQueueValueMap("eodNotifyLoyaltyStartEodQueue",
                prefix + "-card-eodNotifyLoyaltyStartEodQueue-Queue"));

        map.put("eodNotifyEndEodServiceQueue", constructQueueValueMap("eodNotifyEndEodServiceQueue",
                prefix + "-card-eodNotifyEndEodServiceQueue-Queue"));
        map.put("eodNotifyEndCriticalEodServiceQueue", constructQueueValueMap("eodNotifyEndCriticalEodServiceQueue",
                prefix + "-card-eodNotifyEndCriticalEodService-Queue"));

        map.put("eodNotifyExternalJobStartQueue", constructQueueValueMap("eodNotifyExternalJobStartQueue",
                prefix + "-card-eodNotifyExternalJobStartQueue-Queue"));
        map.put("eodNotifyExternalPostingJobEndQueue", constructQueueValueMap("eodNotifyExternalPostingJobEndQueue",
                prefix + "-card-eodNotifyExternalPostingJobEndQueue-Queue"));
        map.put("eodNotifyOlsNifiQueue",
                constructQueueValueMap("eodNotifyOlsNifiQueue", prefix + "-card-eodNotifyOlsNifiQueue-Queue"));
        map.put("eodNotifySosNifiQueue",
                constructQueueValueMap("eodNotifySosNifiQueue", prefix + "-card-eodNotifySosNifiQueue-Queue"));
        map.put("eodNotifyDigitalMktNifiQueue", constructQueueValueMap("eodNotifyDigitalMktNifiQueue",
                prefix + "-card-eodNotifyDigitalMktNifiQueue-Queue"));
        map.put("eodNotifyKingpowerCbsQueue", constructQueueValueMap("eodNotifyKingpowerCbsQueue",
                prefix + "-card-eodNotifyKingpowerCbsQueue-Queue"));
        map.put("eodNotifyTmgCbsQueue",
                constructQueueValueMap("eodNotifyTmgCbsQueue", prefix + "-card-eodNotifyTmgCbsQueue-Queue"));
        map.put("eodStatementProcessingQueue", constructQueueValueMap("eodStatementProcessingQueue",
                prefix + "-card-eodStatementProcessingQueue-Queue"));
        map.put("acqSettlementPostingQueue",
                constructQueueValueMap("acqSettlementPostingQueue", prefix + "-card-acqSettlementPostingQueue-Queue"));
        map.put("directDebitPaymentQueue",
                constructQueueValueMap("directDebitPaymentQueue", prefix + "-card-directDebitPaymentQueue-Queue"));
        map.put("atmSettlementPostingQueue",
                constructQueueValueMap("atmSettlementPostingQueue", prefix + "-card-atmSettlementPostingQueue-Queue"));
        map.put("pmhSettlementPostingQueue",
                constructQueueValueMap("pmhSettlementPostingQueue", prefix + "-card-pmhSettlementPostingQueue-Queue"));
        map.put("eodParamIppMerchantLinkageQueue", constructQueueValueMap("eodParamIppMerchantLinkageQueue",
                prefix + "-card-eodParamIppMerchantLinkageQueue-Queue"));
        map.put("eodLoyaltyCashbackPaymentQueue", constructQueueValueMap("eodLoyaltyCashbackPaymentQueue",
                prefix + "-card-eodLoyaltyCashbackPaymentQueue-Queue"));
        map.put("eodOlsCashbackTransactionQueue", constructQueueValueMap("eodOlsCashbackTransactionQueue",
                prefix + "-card-eodOlsCashbackTransactionQueue-Queue"));
        map.put("eodRepaymentPostingQueue",
                constructQueueValueMap("eodRepaymentPostingQueue", prefix + "-card-eodRepaymentPostingQueue-Queue"));
        map.put("eodTempCampaignEnrolmentProcessQueue", constructQueueValueMap("eodTempCampaignEnrolmentProcessQueue",
                prefix + "-card-eodTempCampaignEnrolmentProcessQueue-Queue"));
        map.put("eodParamCampaignEnrolmentRecordsUpdateQueue",
                constructQueueValueMap("eodParamCampaignEnrolmentRecordsUpdateQueue",
                        prefix + "-card-eodParamCampaignEnrolmentRecordsUpdateQueue-Queue"));
        map.put("eodTempParamStatementTextProcessQueue", constructQueueValueMap("eodTempParamStatementTextProcessQueue",
                prefix + "-card-eodTempParamStatementTextProcessQueue-Queue"));
        map.put("eodTempProcessingGroupChangeProcessQueue",
                constructQueueValueMap("eodTempProcessingGroupChangeProcessQueue",
                        prefix + "-card-eodTempProcessingGroupChangeProcessQueue-Queue"));
        map.put("eodTempCardholderUpdateQueue", constructQueueValueMap("eodTempCardholderUpdateQueue",
                prefix + "-card-eodTempCardholderUpdateQueue-Queue"));
        map.put("eodTempChargeoffProcessQueue", constructQueueValueMap("eodTempChargeoffProcessQueue",
                prefix + "-card-eodTempChargeoffProcessQueue-Queue"));
        map.put("eodTempLoungeAccessProcessQueue", constructQueueValueMap("eodTempLoungeAccessProcessQueue",
                prefix + "-card-eodTempLoungeAccessProcessQueue-Queue"));
        map.put("eodTempBulkAccountCreationQueue", constructQueueValueMap("eodTempBulkAccountCreationQueue",
                prefix + "-card-eodTempBulkAccountCreationQueue-Queue"));
        map.put("eodTempLisUpdateQueue",
                constructQueueValueMap("eodTempLisUpdateQueue", prefix + "-card-eodTempLisUpdateQueue-Queue"));
        map.put("eodTempPhysicalCardIssuanceQueue", constructQueueValueMap("eodTempPhysicalCardIssuanceQueue",
                prefix + "-card-eodTempPhysicalCardIssuanceQueue-Queue"));
        map.put("eodTempLimitUpdateQueue",
                constructQueueValueMap("eodTempLimitUpdateQueue", prefix + "-card-eodTempLimitUpdateQueue-Queue"));
        map.put("eodTempAuthBypassingRulesProcessQueue", constructQueueValueMap("eodTempAuthBypassingRulesProcessQueue",
                prefix + "-card-eodTempAuthBypassingRulesProcessQueue-Queue"));
        map.put("eodTempFreeTextMessageProcessQueue", constructQueueValueMap("eodTempFreeTextMessageProcessQueue",
                prefix + "-card-eodTempFreeTextMessageProcessQueue-Queue"));
        map.put("eodTempBlockCardProcessQueue", constructQueueValueMap("eodTempBlockCardProcessQueue",
                prefix + "-card-eodTempBlockCardProcessQueue-Queue"));
        map.put("eodTempBulkCardDeliveryUpdateQueue", constructQueueValueMap("eodTempBulkCardDeliveryUpdateQueue",
                prefix + "-card-eodTempBulkCardDeliveryUpdateQueue-Queue"));
        map.put("eodTempConvertCardNumberQueue", constructQueueValueMap("eodTempConvertCardNumberQueue",
                prefix + "-card-eodTempConvertCardNumberQueue-Queue"));

        // jcb
        map.put("jcbProcessIncomingFileQueue", constructQueueValueMap("jcbProcessIncomingFileQueue",
                prefix + "-card-jcb-process-incoming-file-Queue"));
        map.put("jcbProcessIncomingInterchangeQueue", constructQueueValueMap("jcbProcessIncomingInterchangeQueue",
                prefix + "-card-jcb-process-incoming-interchange-Queue"));
        // map.put("jcbPostIncomingInterchangeQueue",
        // constructQueueValueMap("jcbPostIncomingInterchangeQueue", prefix +
        // "-card-jcb-post-incoming-interchange-Queue"));
        map.put("jcbProcessOutgoingFileQueue", constructQueueValueMap("jcbProcessOutgoingFileQueue",
                prefix + "-card-jcb-process-outgoing-file-Queue"));
        map.put("jcbProcessOutgoingInterchangeQueue", constructQueueValueMap("jcbProcessOutgoingInterchangeQueue",
                prefix + "-card-jcb-process-outgoing-interchange-Queue"));
        map.put("jcbPostOutgoingInterchangeQueue", constructQueueValueMap("jcbPostOutgoingInterchangeQueue",
                prefix + "-card-jcb-post-outgoing-interchange-Queue"));
        map.put("jcbMPEProcessIncomingFileQueue", constructQueueValueMap("jcbMPEProcessIncomingFileQueue",
                prefix + "-card-jcb-mpe-process-incoming-file-Queue"));
        map.put("jcbMPEUpdateParameterTableQueue", constructQueueValueMap("jcbMPEUpdateParameterTableQueue",
                prefix + "-card-jcb-mpe-update-parameter-table-Queue"));
        map.put("jcbQRProcessIncomingInterchangeEodQueue", constructQueueValueMap(
                "jcbQRProcessIncomingInterchangeEodQueue", prefix + "-card-jcbQRProcessIncomingInterchangeEod-Queue"));
        map.put("jcbQRProcessIncomingFileQueue", constructQueueValueMap("jcbQRProcessIncomingFileQueue",
                prefix + "-card-jcbQRProcessIncomingFile-Queue"));
        map.put("jcbProcessBulkFileReportQueue", constructQueueValueMap("jcbProcessBulkFileReportQueue",
                prefix + "-card-jcbProcessBulkFileReport-Queue"));

        // visa
        // map.put("VisaParameterFormatBinQueue",
        // constructQueueValueMap("VisaParameterFormatBinQueue", prefix +
        // "-card-visa-parameter-format-bin-Queue")); // deprecated
        // map.put("VisaParameterUpdateBinQueue",
        // constructQueueValueMap("VisaParameterUpdateBinQueue", prefix +
        // "-card-visa-parameter-update-bin-Queue")); // deprecated
        // map.put("visaParameterFormatBinQueue",
        // constructQueueValueMap("visaParameterFormatBinQueue", prefix +
        // "-card-visa-parameter-format-bin-Queue"));
        // map.put("visaParameterUpdateBinQueue",
        // constructQueueValueMap("visaParameterUpdateBinQueue", prefix +
        // "-card-visa-parameter-update-bin-Queue"));
        map.put("visaPANLifecycleQueue",
                constructQueueValueMap("visaPANLifecycleQueue", prefix + "-card-visa-pan-lifecycle-Queue"));

        map.put("visaPANUpdateStatusForRetryingQueue", constructQueueValueMap("visaPANUpdateStatusForRetryingQueue",
                prefix + "-visaPANUpdateStatusForRetrying-Queue"));

        // master
        map.put("masterProcessAcknowledgeParameterQueue", constructQueueValueMap(
                "masterProcessAcknowledgeParameterQueue", prefix + "-card-master-process-acknowledge-parameter-Queue"));
        map.put("mastercardProcessBulkFileReportQueue", constructQueueValueMap("mastercardProcessBulkFileReportQueue",
                prefix + "-card-master-process-bulk-file-report-Queue"));

        map.put("eodDailyTransactionTotalsQueue", constructQueueValueMap("eodDailyTransactionTotalsQueue",
                prefix + "-card-eodDailyTransactionTotalsQueue-Queue"));

        // QMR
        map.put("qmrExtractionScheduleQueue",
                constructQueueValueMap("qmrExtractionScheduleQueue", prefix + "-card-qmr-extraction-schedule-Queue"));
        map.put("qmrQuarterlyAffiliationTransactionTotalsQueue",
                constructQueueValueMap("qmrQuarterlyAffiliationTransactionTotalsQueue",
                        prefix + "-card-qmr-quarterly-affiliation-transaction_totals_Queue"));
        map.put("qmrVisaQuarterlyAffiliationStatisticQueue",
                constructQueueValueMap("qmrVisaQuarterlyAffiliationStatisticQueue",
                        prefix + "-card-qmr-visa-quarterly-affiliation-statistic-Queue"));
        map.put("qmrMasterCardQuarterlyAffiliationStatisticQueue",
                constructQueueValueMap("qmrMasterCardQuarterlyAffiliationStatisticQueue",
                        prefix + "-card-qmr-master-quarterly-affiliation-statistic-Queue"));
        map.put("qmrJcbMonthlyStatisticQueue",
                constructQueueValueMap("qmrJcbMonthlyStatisticQueue", prefix + "-card-qmr-jcb-monthly-schedule-Queue"));
        map.put("qmrMonthlyIssuerAccountStatisticQueue", constructQueueValueMap("qmrMonthlyIssuerAccountStatisticQueue",
                prefix + "-card-qmr-monthly-issuer-account-statistic-Queue"));
        map.put("qmrStatementProcessingVisaQueue", constructQueueValueMap("qmrStatementProcessingVisaQueue",
                prefix + "-card-qmr-statement-processing-visa-Queue"));
        map.put("qmrStatementProcessingMasterCardQueue", constructQueueValueMap("qmrStatementProcessingMasterCardQueue",
                prefix + "-card-qmr-statement-processing-master-Queue"));
        map.put("qmrStatementProcessingJCBQueue", constructQueueValueMap("qmrStatementProcessingJCBQueue",
                prefix + "-card-qmr-Statement-Processing-JCB-Queue"));
        map.put("qmrDailyBalancePerProductQueue", constructQueueValueMap("qmrDailyBalancePerProductQueue",
                prefix + "-card-qmr-DailyBalancePerProduct-Queue"));

        // Credit Shield
        map.put("creditShieldBatchProcessingAmendmentQueue",
                constructQueueValueMap("creditShieldBatchProcessingAmendmentQueue",
                        prefix + "-card-credit-shield-batch-process-amendment-Queue"));
        map.put("creditShieldBatchProcessingBillingQueue", constructQueueValueMap(
                "creditShieldBatchProcessingBillingQueue", prefix + "-card-credit-shield-batch-process-billing-Queue"));

        // ABU
        map.put("mastercardAbuOnlineQueue",
                constructQueueValueMap("mastercardAbuOnlineQueue", prefix + "-card-mastercard-abu-online-Queue"));
        map.put("mastercardNewAbuExtractionQueue", constructQueueValueMap("mastercardNewAbuExtractionQueue",
                prefix + "-card-mastercard-new-abu-extraction-Queue"));
        map.put("mastercardUpdAbuExtractionQueue", constructQueueValueMap("mastercardUpdAbuExtractionQueue",
                prefix + "-card-mastercard-upd-abu-extraction-Queue"));
        map.put("abuAutomaticBillingUpdaterQueue", constructQueueValueMap("abuAutomaticBillingUpdaterQueue",
                prefix + "-card-abu-automatic-billing-updater-Queue"));
        map.put("abuOutgoingDataGeneraterQueue", constructQueueValueMap("abuOutgoingDataGeneraterQueue",
                prefix + "-card-abu-outgoing-data-generater-Queue"));
        map.put("abuIncomingDataServiceQueue", constructQueueValueMap("abuIncomingDataServiceQueue",
                prefix + "-card-abu-incoming-data-service-Queue"));

        // upi
        map.put("upiProcessIncomingUpiParameterFileQueue",
                constructQueueValueMap("upiProcessIncomingUpiParameterFileQueue",
                        prefix + "-card-upi-process-incoming-upi-parameter-file-Queue"));
        map.put("upiPostOutgoingInterchangeQueue", constructQueueValueMap("upiPostOutgoingInterchangeQueue",
                prefix + "-card-upi-post-outgoing-interchange-Queue"));
        map.put("upiUpdateBinParameterQueue",
                constructQueueValueMap("upiUpdateBinParameterQueue", prefix + "-card-upi-update-bin-parameter-Queue"));
        map.put("upiUpdateExchangeRateParameterQueue", constructQueueValueMap("upiUpdateExchangeRateParameterQueue",
                prefix + "-card-upi-update-exchange-rate-parameter-Queue"));
        map.put("upiProcessIncomingFileQueue", constructQueueValueMap("upiProcessIncomingFileQueue",
                prefix + "-card-upi-process-incoming-file-Queue"));
        map.put("upiProcessIncomingInterchangeQueue", constructQueueValueMap("upiProcessIncomingInterchangeQueue",
                prefix + "-card-upi-process-incoming-interchange-Queue"));
        // map.put("upiPostIncomingInterchangeQueue",
        // constructQueueValueMap("upiPostIncomingInterchangeQueue", prefix +
        // "-card-upi-post-incoming-interchange-Queue"));
        map.put("upiProcessOutgoingFileQueue", constructQueueValueMap("upiProcessOutgoingFileQueue",
                prefix + "-card-upi-process-outgoing-file-Queue"));
        map.put("upiProcessOutgoingInterchangeQueue", constructQueueValueMap("upiProcessOutgoingInterchangeQueue",
                prefix + "-card-upi-process-outgoing-interchange-Queue"));

        // arrears interest
        map.put("eodTransactionGroupAccruedInterestQueue", constructQueueValueMap(
                "eodTransactionGroupAccruedInterestQueue", prefix + "-card-transactionGroupAccruedInterest-Queue"));
        map.put("eodTransactionGroupArrearsAccruedInterestQueue",
                constructQueueValueMap("eodTransactionGroupArrearsAccruedInterestQueue",
                        prefix + "-card-transactionGroupArrearsAccruedInterest-Queue"));
        map.put("eodMonitorAccountForArrearsBalanceQueue", constructQueueValueMap(
                "eodMonitorAccountForArrearsBalanceQueue", prefix + "-card-monitorAccountForArrearsBalance-Queue"));
        map.put("eodMonitorAnticipatedTransactionGroupQueue", constructQueueValueMap(
                "eodMonitorAnticipatedTransactionGroupQueue", prefix + "-card-MonitorAnticipatedTransaction-Queue"));

        // QR Payment
        map.put("visacardQRProcessIncomingInterchangeQueue",
                constructQueueValueMap("visacardQRProcessIncomingInterchangeQueue",
                        prefix + "-card-visacardQRProcessIncomingInterchange-Queue"));
        map.put("visacardQRProcessIncomingFileQueue", constructQueueValueMap("visacardQRProcessIncomingFileQueue",
                prefix + "-card-visacardQRProcessIncomingFile-Queue"));
        // map.put("visacardQRPostIncomingInterchangeQueue",constructQueueValueMap("visacardQRPostIncomingInterchangeQueue",
        // prefix + "-card-visacardQRPostIncomingInterchange-Queue"));
        map.put("mastercardQRProcessIncomingFileQueue", constructQueueValueMap("mastercardQRProcessIncomingFileQueue",
                prefix + "-card-mastercardQRProcessIncomingFile-Queue"));
        map.put("mastercardQRProcessIncomingInterchangeQueue",
                constructQueueValueMap("mastercardQRProcessIncomingInterchangeQueue",
                        prefix + "-card-mastercardQRProcessIncomingInterchange-Queue"));
        // map.put("mastercardQRPostIncomingInterchangeQueue",constructQueueValueMap("mastercardQRPostIncomingInterchangeQueue",
        // prefix + "-card-mastercardQRPostIncomingInterchange-Queue"));

        map.put("eodCardActivationReminderQueue", constructQueueValueMap("eodCardActivationReminderQueue",
                prefix + "-card-cardActivationReminder-Queue"));
        map.put("eodAnnualFeeReminderQueue",
                constructQueueValueMap("eodAnnualFeeReminderQueue", prefix + "-card-annualFeeReminder-Queue"));
        map.put("eodCardClosureReminderQueue",
                constructQueueValueMap("eodCardClosureReminderQueue", prefix + "-card-CardClosureReminder-Queue"));
        map.put("eodSkipPaymentEndReminderQueue", constructQueueValueMap("eodSkipPaymentEndReminderQueue",
                prefix + "-card-SkipPaymentEndReminder-Queue"));
        map.put("eodFraudBlockCodeFtrReminderQueue", constructQueueValueMap("eodFraudBlockCodeFtrReminderQueue",
                prefix + "-card-FraudBlockCodeFtrReminder-Queue"));
        map.put("eodStatementGenerationReminderQueue", constructQueueValueMap("eodStatementGenerationReminderQueue",
                prefix + "-card-StatementGenerationReminder-Queue"));
        map.put("nplMonthlyMovementTotalQueue",
                constructQueueValueMap("nplMonthlyMovementTotalQueue", prefix + "-card-nplMonthlyMovementTotal-Queue"));

        // Dispute
        map.put("disputeTransactionSuspendQueue", constructQueueValueMap("disputeTransactionSuspendQueue",
                prefix + "-card-disputeTransactionSuspend-Queue"));
        map.put("disputeTransactionWriteOffQueue", constructQueueValueMap("disputeTransactionWriteOffQueue",
                prefix + "-card-disputeTransactionWriteOff-Queue"));

        // SFTP
        map.put("incomingSFTPQueue", constructQueueValueMap("incomingSFTPQueue", prefix + "-card-incomingSFTP-Queue"));
        map.put("outgoingSFTPQueue", constructQueueValueMap("outgoingSFTPQueue", prefix + "-card-outgoingSFTP-Queue"));

        map.put("eodGlExtractionTempPurgeQueue", constructQueueValueMap("eodGlExtractionTempPurgeQueue",
                prefix + "-card-eodGlExtractionTempPurge-Queue"));
        map.put("eodStatementAffiliationStatisticQueue", constructQueueValueMap("eodStatementAffiliationStatisticQueue",
                prefix + "-card-eodStatementAffiliationStatisticQueue-Queue"));

        map.put("eodPPPenaltyChargeQueue",
                constructQueueValueMap("eodPPPenaltyChargeQueue", prefix + "-card-eodPPPenaltyChargeQueue-Queue"));

        // purging
        map.put("purgingDataByConfigurationQueue", constructQueueValueMap("purgingDataByConfigurationQueue",
                prefix + "-card-purgingDataByConfiguration-Queue"));
        map.put("purgingDataTransactionStatementQueue", constructQueueValueMap("purgingDataTransactionStatementQueue",
                prefix + "-card-purgingDataTransactionStatement-Queue"));
        map.put("eodBatchJobValidationEODBatchQueue", constructQueueValueMap("eodBatchJobValidationEODBatchQueue",
                prefix + "-card-eodBatchJobValidationEODBatch-Queue"));

        // batch reload
        map.put("eodCardCacheReloadingQueue", constructQueueValueMap("eodCardCacheReloadingQueue",
                prefix + "-card-eodCardCacheReloadingQueue-Queue"));
        map.put("eodCardCacheJoinReloadingQueue", constructQueueValueMap("eodCardCacheJoinReloadingQueue",
                prefix + "-card-eodCardCacheJoinReloadingQueue-Queue"));

        // reset db seq
        map.put("eodResetTaxInvoiceSeqQueue", constructQueueValueMap("eodResetTaxInvoiceSeqQueue",
                prefix + "-card-eodResetTaxInvoiceSeqQueue-Queue"));

        return map;
    }

    private Map<String, String> constructQueueValueMap(String id, String queues) {
        Map<String, String> valuemap = new LinkedHashMap<>();

        valuemap.put("id", id);
        valuemap.put("queues", queues);

        int min = this.minConcurrentConsumer;
        int max = this.maxConcurrentConsumer;

        String min_str = getParameter("rabbit.concurrent_min_consumer." + id);
        String max_str = getParameter("rabbit.concurrent_max_consumer." + id);
        if (StringUtil.hasValue(min_str)) {

            min = Integer.parseInt(min_str);
        }
        if (StringUtil.hasValue(max_str)) {
            max = Integer.parseInt(max_str);
        }

        if (max < min && max != min) {
            throw new RuntimeException("Invalid define min [" + min + "] max [" + max + "] id:" + id);
        }

        String defaultBatchRabbitListenerContainerFactory = this.containerFactory;
        String batchRabbitListenerContainerFactory = getParameter("rabbit.containerFactory." + id);

        if (StringUtil.hasValue(batchRabbitListenerContainerFactory)) {
            defaultBatchRabbitListenerContainerFactory = batchRabbitListenerContainerFactory;
        }

        valuemap.put("containerFactory", defaultBatchRabbitListenerContainerFactory);

        String concurrency = min + "-" + max;
        valuemap.put("concurrency", concurrency);// "min-Max"

        String isEnable = null;
        // global setting
        if (Boolean.valueOf(getParameter("queue.enabled"))) {

            // c- consumer only
            // p - publisher only
            // cp/ null(no define) - both enable
            String rabbitMode = null == getParameter("rabbit.operation_mode") ? ""
                    : getParameter("rabbit.operation_mode");

            switch (rabbitMode) {
                case "c":
                case "C":
                    isEnable = "true";
                    if (id.equalsIgnoreCase("retrieveItemAndPushToQueueServiceQueue")) {
                        isEnable = "false";
                    }
                    break;

                case "p":
                case "P":
                    isEnable = "false";
                    if (id.equalsIgnoreCase("retrieveItemAndPushToQueueServiceQueue")) {
                        isEnable = "true";
                        System.setProperty("queue.enabled", "false");
                    }
                    break;

                case "cp":
                case "CP":
                    isEnable = "true";
                    break;
                default:
                    isEnable = "true";
                    break;

            }

        } else {
            isEnable = "false";
        }

        valuemap.put("enabled", isEnable);

        log.debug("id [{}]  valuemap {}", id, valuemap);

        return valuemap;
    }

    private String getParameter(String key) {

        // System - get from java argument
        // env - get from property files
        String value = System.getProperty(key);

        if (!StringUtil.hasValue(value)) {

            value = env.getProperty(key);

            log.debug("param get from property file key [{}] value [{}]", key, value);
        } else {
            log.debug("param get from java argument key [{}] value [{}]", key, value);
        }
        return value;

        // return System.getProperty(key) != null ? System.getProperty(key) :
        // env.getProperty(key);
    }

    private String getActiveProfie() {
        String[] activeProfiles = env.getActiveProfiles();

        for (String profile : activeProfiles) {
            if ("DEV".equals(profile) || "SIT".equals(profile) || "UAT".equals(profile) || "DR".equals(profile)
                    || "PROD".equals(profile)) {
                return profile;
            }
        }

        return "DEV";
    }
}
