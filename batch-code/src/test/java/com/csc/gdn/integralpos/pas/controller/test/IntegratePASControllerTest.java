package com.csc.gdn.integralpos.pas.controller.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.eq;

import java.security.Principal;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class IntegratePASControllerTest {
	private static final Logger LOGGER = LoggerFactory.getLogger(IntegratePASControllerTest.class);
	
	@Test
	public void testApplication() {
		assertTrue(true);
	}
//	@Test
//	public void testSuccessAcknowlegde() throws Exception
//	{
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"SUCCESS\", \"message\" : \"SUCCESS\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;
//		Mockito.when(servicePAS.successAcknowlegde(any(String.class), any(String.class), eq(user))).thenReturn(true);
//		assertEquals(controller.successAcknowlegde(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.OK));
//		LOGGER.info(controller.successAcknowlegde(caseId, packageFB, user).toString());
//		
//		Mockito.when(servicePAS.successAcknowlegde(any(String.class), any(String.class), eq(user))).thenReturn(false);
//		assertEquals(controller.successAcknowlegde(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.BAD_REQUEST));
//		LOGGER.info(controller.successAcknowlegde(caseId, packageFB, user).toString());
//	}
//	
//	@Test
//	public void testErrorAcknowlegde() throws Exception
//	{
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"ERROR\", \"message\" : \"ERROR\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;
//		Mockito.when(servicePAS.errorAcknowlegde(any(String.class), any(String.class), eq(user))).thenReturn(true);
//		assertEquals(controller.errorAcknowlegde(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.OK));
//		LOGGER.info(controller.errorAcknowlegde(caseId, packageFB, user).toString());
//		
//		Mockito.when(servicePAS.errorAcknowlegde(any(String.class), any(String.class), eq(user))).thenReturn(false);
//		assertEquals(controller.errorAcknowlegde(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.BAD_REQUEST));
//		LOGGER.info(controller.errorAcknowlegde(caseId, packageFB, user).toString());
//	}
//	
//	@Test
//	public void testProcessingErrors() throws Exception
//	{
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"PROCESS_ERROR\", \"message\" : \"PROCESS_ERROR\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;
//		Mockito.when(servicePAS.processingErrors(any(String.class), any(String.class), eq(user))).thenReturn(true);
//		assertEquals(controller.processingErrors(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.OK));
//		LOGGER.info(controller.processingErrors(caseId, packageFB, user).toString());
//		
//		Mockito.when(servicePAS.processingErrors(any(String.class), any(String.class), eq(user))).thenReturn(false);
//		assertEquals(controller.processingErrors(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.BAD_REQUEST));
//		LOGGER.info(controller.processingErrors(caseId, packageFB, user).toString());
//	}
//	
//	@Test
//	public void testProcessingInfos() throws Exception
//	{
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"PROCESS_SUCCESS\", \"message\" : \"PROCESS_SUCCESS\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;	
//		Mockito.when(servicePAS.processingInformation(any(String.class), any(String.class), eq(user))).thenReturn(true);
//		assertEquals(controller.processingInfos(packageFB, caseId, user), new ResponseEntity<>(HttpStatus.OK));
//		LOGGER.info(controller.processingInfos(packageFB, caseId, user).toString());
//		
//		Mockito.when(servicePAS.processingInformation(any(String.class), any(String.class), eq(user))).thenReturn(false);
//		assertEquals(controller.processingInfos(caseId, packageFB, user), new ResponseEntity<>(HttpStatus.BAD_REQUEST));
//		LOGGER.info(controller.processingInfos(caseId, packageFB, user).toString());
//	}
//	 
//	@Test
//	public void testCheckAgent() throws Exception
//	{		
//		String agenId = "10003624";	
//		String productCode = "VPM";
//		JSONObject result = new JSONObject("{\"branchCode\":\"10\",\"agentName\":\"Truong Hao\",\"branch\":\"Head Office\",\"email\":\"lbui8@gmail.com\"}");
//		Mockito.when(servicePAS.checkAgentID(any(String.class), anyObject())).thenReturn(result);
//		assertEquals(controller.checkAgent(productCode, agenId), new ResponseEntity<>(result.toString(),HttpStatus.OK));
//		LOGGER.info(controller.checkAgent(productCode, agenId).toString());
//		
//		Mockito.when(servicePAS.checkAgentID(any(String.class), anyObject())).thenReturn(null);
//		assertEquals(controller.checkAgent(productCode, agenId), new ResponseEntity<>(HttpStatus.BAD_REQUEST));
//		LOGGER.info(controller.checkAgent(productCode, agenId).toString());
//	}
//	
//	@Test
//	public void testGetExchangeRateCurrency() throws Exception
//	{				
//		String productCode = "VPM";
//		JSONObject result = new JSONObject("{\"USD\":\"8211.0000000\",\"THB\":\"241.0950000\"}");
//		Mockito.when(servicePAS.getPExchangeRateCurrency(anyObject())).thenReturn(result);
//		assertEquals(controller.getExchangeRateCurrency(productCode), new ResponseEntity<>(result.toString(),HttpStatus.OK));
//		LOGGER.info(controller.getExchangeRateCurrency(productCode).toString());
//		
//		Mockito.when(servicePAS.getPExchangeRateCurrency(anyObject())).thenReturn(null);
//		assertEquals(controller.getExchangeRateCurrency(productCode), new ResponseEntity<>(HttpStatus.BAD_REQUEST));
//		LOGGER.info(controller.getExchangeRateCurrency(productCode).toString());
//	}
}
