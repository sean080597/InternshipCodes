package com.csc.gdn.integralpos.batch.config;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.KeyStore;
import java.security.cert.CertificateException;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.connection.CachingConnectionFactory;
import org.springframework.jms.core.JmsTemplate;

import com.csc.gdn.integralpos.batch.properties.BatchMQProperties;
import com.ibm.mq.jms.MQQueueConnectionFactory;
import com.ibm.msg.client.wmq.WMQConstants;

@EnableJms
@Configuration
public class MQConfiguration {

	@Autowired
	private BatchMQProperties batchMQProperties;
	
	@Bean
	public SSLSocketFactory sslSocketFactory() throws Exception {
		String storePath = batchMQProperties.getClientStorePath();
		String storeType = System.getProperty("javax.net.ssl.keyStoreType", KeyStore.getDefaultType());
		String storePassword = batchMQProperties.getClientStorePassword();
		// create manager factory
		TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
		KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
		char[] password = null;
		if (storePassword.length() > 0) password = storePassword.toCharArray();
		// create trust store
		KeyStore trustStore = KeyStore.getInstance(storeType);
		trustStore.load(new FileInputStream(storePath), storePassword.toCharArray());
		tmf.init(trustStore);
		// create key store
		KeyStore keyStore = KeyStore.getInstance(storeType);
		keyStore.load(new FileInputStream(storePath), storePassword.toCharArray());
		kmf.init(keyStore, password);
		// init SSLContext
		SSLContext sslContext = SSLContext.getInstance("TLS");
		sslContext.init(kmf.getKeyManagers(), tmf.getTrustManagers(), null);
		return sslContext.getSocketFactory();
	}

	@Bean
	public MQQueueConnectionFactory mqQueueConnectionFactory(SSLSocketFactory sslSocketFactory) throws Exception, CertificateException, IOException {
		// disabling IBM Cipher Suite mapping due to using Oracle Java and not IBM Java
		System.setProperty("com.ibm.mq.cfg.useIBMCipherMappings", batchMQProperties.getUseIBMCipherMappings());
		System.setProperty("javax.net.debug", "ssl:handshake");
		// set client.jks path & password - client.jks
//		System.setProperty("javax.net.ssl.keyStore", batchMQProperties.getClientStorePath());
//	    System.setProperty("javax.net.ssl.keyStorePassword", batchMQProperties.getClientStorePassword());
//	    System.setProperty("javax.net.ssl.trustStore", batchMQProperties.getClientStorePath());
//	    System.setProperty("javax.net.ssl.trustStorePassword", batchMQProperties.getClientStorePassword());
		
		// init MQ Queue Connection Factory
		MQQueueConnectionFactory mqQueueConnectionFactory = new MQQueueConnectionFactory();
		mqQueueConnectionFactory.setHostName(batchMQProperties.getHost());
		try {
			mqQueueConnectionFactory.setSSLCipherSuite(batchMQProperties.getSslCipherSuite());
			mqQueueConnectionFactory.setSSLSocketFactory(sslSocketFactory);
			mqQueueConnectionFactory.setTransportType(WMQConstants.ADMIN_QUEUE_DOMAIN);
			mqQueueConnectionFactory.setCCSID(1208);
			mqQueueConnectionFactory.setChannel(batchMQProperties.getChannel());
			mqQueueConnectionFactory.setPort(batchMQProperties.getPort());
			mqQueueConnectionFactory.setQueueManager(batchMQProperties.getQueueManager());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return mqQueueConnectionFactory;
	}
	
//	@Bean
//	UserCredentialsConnectionFactoryAdapter userCredentialsConnectionFactoryAdapter(MQQueueConnectionFactory mqQueueConnectionFactory) {
//	    UserCredentialsConnectionFactoryAdapter userCredentialsConnectionFactoryAdapter = new UserCredentialsConnectionFactoryAdapter();
//	    userCredentialsConnectionFactoryAdapter.setUsername(batchMQProperties.getUsername());
//	    userCredentialsConnectionFactoryAdapter.setPassword(batchMQProperties.getPassword());
//	    userCredentialsConnectionFactoryAdapter.setTargetConnectionFactory(mqQueueConnectionFactory);
//	    return userCredentialsConnectionFactoryAdapter;
//	}
	
	@Bean
	@Primary
	public CachingConnectionFactory cachingConnectionFactory(MQQueueConnectionFactory mqQueueConnectionFactory) {
	    CachingConnectionFactory cachingConnectionFactory = new CachingConnectionFactory();
	    cachingConnectionFactory.setTargetConnectionFactory(mqQueueConnectionFactory);
	    cachingConnectionFactory.setSessionCacheSize(500);
	    cachingConnectionFactory.setReconnectOnException(true);
	    return cachingConnectionFactory;
	}

	@Bean
	public JmsTemplate jmsTemplate(CachingConnectionFactory cachingConnectionFactory) {
		JmsTemplate jmsTemplate = new JmsTemplate(cachingConnectionFactory);
		jmsTemplate.setReceiveTimeout(batchMQProperties.getReceiveTimeout());
		return jmsTemplate;
	}
}
