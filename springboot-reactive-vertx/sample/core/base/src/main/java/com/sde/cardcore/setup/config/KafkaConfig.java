package com.xyz.cardcore.setup.config;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.kafka.clients.CommonClientConfigs;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.RoundRobinPartitioner;
import org.apache.kafka.common.header.Header;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.slf4j.MDC;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.DefaultKafkaConsumerFactoryCustomizer;
import org.springframework.boot.autoconfigure.kafka.DefaultKafkaProducerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.kafka.config.AbstractKafkaListenerContainerFactory;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.util.backoff.FixedBackOff;

import com.xyz.cardcore.interceptor.KafkaProducerInterceptor;
import com.xyz.modelsuite.dto.OBBase;
import com.xyz.modelsuite.util.FishTagUtil;
import com.xyz.modelsuite.util.PropertyUtil;
import com.xyz.modelsuite.util.StringUtil;
import com.xyz.modelsuite.web.security.XyzContext;
import com.xyz.modelsuite.web.security.ThreadLocalXyzContextHolderStrategy;

import io.netty.util.internal.PlatformDependent;

@Configuration
public class KafkaConfig
{
    @Autowired
    Environment env;

    @Bean
    public Map<String, Object> producerConfigs()
    {
//        String kafkaUrl = System.getProperty("kafka.url") != null ? System.getProperty("kafka.url") : PropertyUtil.getValue("xyz.kafka.url");
        String kafkaUrl = System.getProperty("kafka.url");

        if (!StringUtil.hasValue(kafkaUrl))
        {
            kafkaUrl = "kafka.dev.cardx.aliyun.xyzcloud.tech:31000";
        }

        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaUrl);
        //The maximum wait time for a request.
        props.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, 30 * 1000);
        //Set the number of client internal retries.
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        //Set the client internal retry interval.
        props.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 1000);//1000ms
        
        props.put(ProducerConfig.LINGER_MS_CONFIG, 0);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.INTERCEPTOR_CLASSES_CONFIG, KafkaProducerInterceptor.class.getName());

        props.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, RoundRobinPartitioner.class.getName());

        String protocol = System.getProperty("kafka.producer.security.protocol") != null ? System.getProperty("kafka.producer.security.protocol") : PropertyUtil.getValue("kafka.producer.security.protocol");
        
        if(StringUtil.hasValue(protocol)) 
        {
            props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, protocol);
        }
        
        String saslMechanism = System.getProperty("kafka.producer.sasl.mechanism") != null ? System.getProperty("kafka.producer.sasl.mechanism") : PropertyUtil.getValue("kafka.producer.sasl.mechanism");
        if(StringUtil.hasValue(saslMechanism)) 
        {
            props.put("sasl.mechanism", saslMechanism);
        }
        
        String jaasConfig = env.getProperty("kafka.producer.sasl.jaas.config") != null ? env.getProperty("kafka.producer.sasl.jaas.config") : PropertyUtil.getValue("kafka.producer.sasl.jaas.config");
        if(StringUtil.hasValue(jaasConfig)) 
        {
            props.put("sasl.jaas.config", jaasConfig);
        }
        
		String jaasConfigPlainUsername = env.getProperty("kafka.producer.sasl.jaas.config.plain.username") != null ? env.getProperty("kafka.producer.sasl.jaas.config.plain.username") : PropertyUtil.getValue("kafka.producer.sasl.jaas.config.plain.username");
		String jaasConfigPlainPassword = env.getProperty("kafka.producer.sasl.jaas.config.plain.password") != null ? env.getProperty("kafka.producer.sasl.jaas.config.plain.password") : PropertyUtil.getValue("kafka.producer.sasl.jaas.config.plain.password");
		if(StringUtil.hasValue(jaasConfigPlainUsername) && StringUtil.hasValue(jaasConfigPlainPassword)) {
			props.put("sasl.jaas.config", "org.apache.kafka.common.security.plain.PlainLoginModule required username='" + jaasConfigPlainUsername + "' password='" + jaasConfigPlainPassword + "'");
		}	
        
        return props;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Bean
    public ProducerFactory<String, Object> producerFactory(ObjectProvider<DefaultKafkaProducerFactoryCustomizer> producerFactoryCustomizers)
    {
        DefaultKafkaProducerFactory producerFactory = new DefaultKafkaProducerFactory<>(producerConfigs());
        producerFactory.setValueSerializer(new StringSerializer());
        producerFactoryCustomizers.forEach(customizer -> {customizer.customize(producerFactory);});

        producerFactory.createProducer();// to init producer when server start

        return producerFactory;
    }

    @Bean
    public KafkaTemplate<String, ?> kafkaTemplate(ProducerFactory<String, Object> producerFactory)
    {
        return new KafkaTemplate<>(producerFactory);
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory(ObjectProvider<DefaultKafkaConsumerFactoryCustomizer> consumerFactoryCustomizers)
    {
//        String kafkaUrl = System.getProperty("kafka.url") != null ? System.getProperty("kafka.url") : PropertyUtil.getValue("xyz.kafka.url");
        String kafkaUrl = System.getProperty("kafka.url");
        
        if (!StringUtil.hasValue(kafkaUrl))
        {
            kafkaUrl = "kafka.dev.cardx.aliyun.xyzcloud.tech:31000";
        }

        ErrorHandlingDeserializer<String> errorHandlingDeser = new ErrorHandlingDeserializer<String>(new StringDeserializer());

        Map<String, Object> props = new HashMap<>();

        String kafkaEnabled =  System.getProperty("kafka.enabled");

        if ("true".equalsIgnoreCase(kafkaEnabled))
        {
            props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaUrl);
            props.put(ConsumerConfig.GROUP_ID_CONFIG, "cardCore");
            props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
            props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//            props.put(ConsumerConfig.INTERCEPTOR_CLASSES_CONFIG, KafkaConsumerInterceptor.class.getName());
            
            props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 5); // The maximum number of records returned in a single call to poll().
            
            String protocol = System.getProperty("kafka.consumer.security.protocol") != null ? System.getProperty("kafka.consumer.security.protocol") : PropertyUtil.getValue("kafka.consumer.security.protocol");
            
            if(StringUtil.hasValue(protocol)) 
            {
                props.put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, protocol);
            }
            
            String saslMechanism = System.getProperty("kafka.consumer.sasl.mechanism") != null ? System.getProperty("kafka.consumer.sasl.mechanism") : PropertyUtil.getValue("kafka.consumer.sasl.mechanism");
            if(StringUtil.hasValue(saslMechanism)) 
            {
                props.put("sasl.mechanism", saslMechanism);
            }
            
            String jaasConfig = env.getProperty("kafka.consumer.sasl.jaas.config") != null ? env.getProperty("kafka.consumer.sasl.jaas.config") : PropertyUtil.getValue("kafka.consumer.sasl.jaas.config");
    		if(StringUtil.hasValue(jaasConfig)) {
                props.put("sasl.jaas.config", jaasConfig);
            }
            
    		String jaasConfigPlainUsername = env.getProperty("kafka.consumer.sasl.jaas.config.plain.username") != null ? env.getProperty("kafka.consumer.sasl.jaas.config.plain.username") : PropertyUtil.getValue("kafka.consumer.sasl.jaas.config.plain.username");
    		String jaasConfigPlainPassword = env.getProperty("kafka.consumer.sasl.jaas.config.plain.password") != null ? env.getProperty("kafka.consumer.sasl.jaas.config.plain.password") : PropertyUtil.getValue("kafka.consumer.sasl.jaas.config.plain.password");
    		if(StringUtil.hasValue(jaasConfigPlainUsername) && StringUtil.hasValue(jaasConfigPlainPassword)) {
    			System.setProperty("spring.kafka.properties.sasl.jaas.config", "org.apache.kafka.common.security.plain.PlainLoginModule required username='" + jaasConfigPlainUsername + "' password='" + jaasConfigPlainPassword + "';");
    		}
        }
        
        DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), errorHandlingDeser);
        consumerFactoryCustomizers.forEach(customizer -> {customizer.customize(consumerFactory);});
        return consumerFactory;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory(ConsumerFactory<String, String> consumerFactory)
    {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        //factory.setErrorHandler(new SeekToCurrentErrorHandler(new DeadLetterPublishingRecoverer(kafkaTemplate())));
        factory.setCommonErrorHandler(new DefaultErrorHandler(new FixedBackOff(0L, 0L)));
        
        factory.setConcurrency(5);
        
        setKafkaAdviceChain(factory);
        
        return factory;
    }
    
    private void setKafkaAdviceChain(AbstractKafkaListenerContainerFactory<?, ?, ?> listenerContainerFactory)
	{
		MethodInterceptor m = new MethodInterceptor() {
			
			@SuppressWarnings("unchecked")
			@Override
			public Object invoke(MethodInvocation invocation) throws Throwable {
				Object[] args = invocation.getArguments();
				String tagId = null;
				OBBase requestBase = null;
				for(Object arg : args)
				{
					if(arg instanceof ConsumerRecord)
					{
						ConsumerRecord<String, ?> record = (ConsumerRecord<String, ?>)arg;
						Header tagIdHeader = record.headers().lastHeader("X-TAG-ID");
						
						if(tagIdHeader != null)
							tagId = new String(tagIdHeader.value());
						
						Object recordValue = record.value();
						
						if(OBBase.class.isAssignableFrom(recordValue.getClass()))
						{
							requestBase = (OBBase) recordValue;
						}
						break;
					}
				}
				
				if(tagId == null)
				{
					tagId = FishTagUtil.generateId();
				}
				
				try
				(MDC.MDCCloseable fishTag = MDC.putCloseable("fishTagId", tagId))
				{
//					FishTagUtil.setIdToMDC(tagId);
					
					
					XyzContext xyzContext = new XyzContext();
					if(requestBase != null && requestBase.getObHeader() != null)
					{
						xyzContext.setUserId(requestBase.getObHeader().getUserId());
						xyzContext.setDomainId(requestBase.getObHeader().getDomainId());
					}
                    ThreadLocalXyzContextHolderStrategy.setXyzContext(xyzContext);
					return invocation.proceed();
				}
				finally
				{
					ThreadLocalXyzContextHolderStrategy.unset();
				}
			}
		}; 
		listenerContainerFactory.getContainerProperties().setAdviceChain(m);
	}

    @Bean
    public Map<String, String> kafkaTopics()
    {
      Map<String, String> map = new LinkedHashMap<>();

      String prefix = getActiveProfie().toLowerCase();

      //MS's topic. not need set unique prefix
      map.put("notificationPoolTopic", prefix+ ".notification-send");
      map.put("cbsNotificationPoolTopic", prefix+ ".cbs-si-card-dd-enrich");
      map.put("cciiHoldCodeTopic", prefix+ ".ccii-in-holdcode-dpd-creation");
      
      if("DEV".equalsIgnoreCase(prefix) && (PlatformDependent.isWindows() || PlatformDependent.isOsx())) 
      {
          prefix = prefix+"-"+System.getProperty("user.name");
      }
      
      //CBS external job call
      map.put("outbound_externalJobRequest", prefix+ ".cardcore-external-job-request");
      map.put("inbound_externalJobResponse", prefix+ ".cardcore-external-job-response");
      map.put("cbsActivityTopic", prefix+ ".cbs-activity-topic");
      
      map.put("eodTopic", prefix+ ".eod-topic");
      
      
      //loyalty
      map.put("loyaltyCallBackTopic", prefix+ ".loyalty-callback-topic");

      map.put("cardManagementTopic", prefix+ ".card-management-topic");
      map.put("transactionTopic", prefix+ ".transaction-topic");
      map.put("authorizationTopic", prefix+ ".authorization-topic");
      //map.put("fraudTopic", prefix+ ".authorization-topic");
      map.put("loyaltyTopic", prefix+ ".loyalty-topic");
      map.put("loyaltyNotificationTopic", prefix+ ".loyalty-notification-topic");
      map.put("postFraudCheckTopic", prefix+ ".post-fraud-check");
      map.put("accountManagementTopic", prefix+ ".account-management-topic");
      map.put("eodJobTopic", prefix+ ".eod-job-topic");
      map.put("directDebitUpdateDueDateTopic", prefix+ ".direct-debit-update-due-date-topic");

      return map;
    }

    private String getActiveProfie()
    {
        String[] activeProfiles = env.getActiveProfiles();

        for (String profile : activeProfiles)
        {
            if ("DEV".equals(profile)
                    || "SIT".equals(profile)
                    || "UAT".equals(profile)
                    || "DR".equals(profile)
                    || "PROD".equals(profile)
                    )
            {
                return profile;
            }
        }

        return "DEV";
    }
}
