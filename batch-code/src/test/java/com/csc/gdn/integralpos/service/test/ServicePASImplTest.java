package com.csc.gdn.integralpos.service.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyMap;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class ServicePASImplTest {
	private static final Logger LOGGER = LoggerFactory.getLogger(ServicePASImplTest.class);

	@Mock
	RestTemplate restTemplate;

	@Mock
	private ApplicationContext context;

//	@Before
//	public void setUp() throws Exception {
//		MockitoAnnotations.initMocks(this);
//	}
	@Test
	public void testApplication() {
		assertTrue(true);
	}

//	@SuppressWarnings("unchecked")
//	@Test
//	public void testSuccessAcknowlegde() throws Exception {
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"SUCCESS\", \"message\" : \"SUCCESS\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;
//
//		Mockito.when(discoveryHelper.getURI(Mockito.anyString())).thenReturn("https://www.csc.com");
//		HttpHeaders headers = new HttpHeaders();
//		Mockito.when(restTemplateHelper.buildHeaderWithToken(oauthHelper.getAccessToken(user))).thenReturn(headers);
//		String result = "submit successfully!!";
//
//		/** Call setters of testResponse **/
//		RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
//		PowerMockito.whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
//
//		// true condition
//		ResponseEntity<Object> respEntity = new ResponseEntity<Object>(result, HttpStatus.OK);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity);
//
//		assertEquals(true, servicePAS.successAcknowlegde(caseId, packageFB, user));
//		LOGGER.info("SuccessAcknowlegde: true");
//
//		// false condition
//		ResponseEntity<Object> respEntity1 = new ResponseEntity<Object>("", HttpStatus.NOT_FOUND);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity1);
//		assertEquals(false, servicePAS.successAcknowlegde(caseId, packageFB, user));
//		LOGGER.info("SuccessAcknowlegde: false");
//	}
//
//	@SuppressWarnings("unchecked")
//	@Test
//	public void testErrorAcknowlegde() throws Exception {
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"ERROR\", \"message\" : \"ERROR\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;
//
//		Mockito.when(discoveryHelper.getURI(Mockito.anyString())).thenReturn("https://www.csc.com");
//		HttpHeaders headers = new HttpHeaders();
//		Mockito.when(restTemplateHelper.buildHeaderWithToken(oauthHelper.getAccessToken(user))).thenReturn(headers);
//		String result = "submit successfully!!";
//
//		/** Call setters of testResponse **/
//
//		RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
//		PowerMockito.whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
//
//		// true Condition
//		ResponseEntity<Object> respEntity = new ResponseEntity<Object>(result, HttpStatus.OK);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity);
//		assertEquals(true, servicePAS.errorAcknowlegde(caseId, packageFB, user));
//		LOGGER.info("ErrorAcknowlegde: true");
//
//		// false condition
//		ResponseEntity<Object> respEntity1 = new ResponseEntity<Object>("", HttpStatus.NOT_FOUND);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity1);
//		assertEquals(false, servicePAS.errorAcknowlegde(caseId, packageFB, user));
//		LOGGER.info("ErrorAcknowlegde: false");
//	}
//
//	@SuppressWarnings("unchecked")
//	@Test
//	public void testProcessingErrors() throws Exception {
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"PROCESS_ERROR\", \"message\" : \"PROCESS_ERROR\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//		Principal user = null;
//
//		Mockito.when(discoveryHelper.getURI(Mockito.anyString())).thenReturn("https://www.csc.com");
//		HttpHeaders headers = new HttpHeaders();
//		Mockito.when(restTemplateHelper.buildHeaderWithToken(oauthHelper.getAccessToken(user))).thenReturn(headers);
//		String result = "submit successfully!!";
//
//		/** Call setters of testResponse **/
//
//		RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
//		PowerMockito.whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
//
//		// true Condition
//		ResponseEntity<Object> respEntity = new ResponseEntity<Object>(result, HttpStatus.OK);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity);
//		assertEquals(true, servicePAS.processingErrors(caseId, packageFB, user));
//		LOGGER.info("processingErrors: true");
//
//		// false condition
//		ResponseEntity<Object> respEntity1 = new ResponseEntity<Object>("", HttpStatus.NOT_FOUND);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity1);
//		assertEquals(false, servicePAS.processingErrors(caseId, packageFB, user));
//		LOGGER.info("processingErrors: false");
//	}
//
//	@SuppressWarnings("unchecked")
//	@Test
//	public void testProcessingInfos() throws Exception {
//		Principal user = null;
//		String packageFB = "{\"packageFeedback\" : [{\"code\": \"PROCESS_SUCCESS\", \"message\" : \"PROCESS_SUCCESS\"}]}";
//		String caseId = "a98cdf8b-b9ea-463b-8403-2035a998d2d7";
//
//		Mockito.when(discoveryHelper.getURI(Mockito.anyString())).thenReturn("https://www.csc.com");
//		HttpHeaders headers = new HttpHeaders();
//		Mockito.when(restTemplateHelper.buildHeaderWithToken(oauthHelper.getAccessToken(user))).thenReturn(headers);
//		String result = "{\"docMeta\":{\"productCode\":\"VPS\",\"processStatus\":\"PROCESS_SUCCESS\",\"emailPO\":\"email@domain.com\",\"caseNo\":\"BCVPS777776666098\",\"staffId\":\"agt001\"},\"case\":{\"product\":{\"code\":\"VPS\",\"expiredDate\":\"\",\"name\":\"Motor Cycle\",\"description\":\"\",\"launchedDate\":\"\"},\"underwriting\":{\"underwritingRuleInfo\":[{\"underwritingRuleCd\":\"\",\"underwritingScoreNumber\":\"\",\"underwritingDecisionCd\":\"\",\"underwritingDecisionDesc\":\"No of Claims > 3\"},{\"underwritingRuleCd\":\"QCON\",\"underwritingScoreNumber\":\"\",\"underwritingDecisionCd\":\"\",\"underwritingDecisionDesc\":\"Re-conditioned vehicle = Yes\"},{\"underwritingRuleCd\":\"\",\"underwritingScoreNumber\":\"\",\"underwritingDecisionCd\":\"\",\"underwritingDecisionDesc\":\"\"},{\"underwritingRuleCd\":\"\",\"underwritingScoreNumber\":\"\",\"underwritingDecisionCd\":\"\",\"underwritingDecisionDesc\":\"\"},{\"underwritingRuleCd\":\"\",\"underwritingScoreNumber\":\"\",\"underwritingDecisionCd\":\"\",\"underwritingDecisionDesc\":\"\"}],\"systemUnderwritingDecisionDt\":\"\",\"underwriterId\":\"\",\"underwritingScoreNumber\":\"\",\"underwritingDecisionCd\":\"\",\"systemUnderwritingDecisionCd\":\"\",\"underwritingDecisionDt\":\"\",\"underwritingRenewalDecisionCd\":\"\",\"underwritingRenewalDecisionDt\":\"\"},\"attachments\":[{\"systemInfo\":{\"fileName\":\"QN777776666098.pdf\",\"contentSize\":165159,\"modifiedDate\":\"\",\"signedDate\":\"\",\"detachedDate\":\"\",\"fileUid\":\"fcd87a87-c46f-4216-bde5-2a9b8c957be5\",\"fileType\":\"pdf\",\"createDate\":\"2017-09-19T10:45:58.833Z\",\"attachedDate\":\"\"},\"businessInfo\":{\"isRequired\":\"\",\"isAttachted\":\"\",\"isSigned\":\"\",\"documentType\":\"QUOTATION\",\"attachmentType\":\"\",\"profileId\":\"\",\"isGenBySystem\":\"true\",\"documentName\":\"\",\"moduleId\":\"\",\"ownerId\":\"\",\"isSignRequired\":\"\"}},{\"systemInfo\":{\"fileName\":\"APP777776666098.pdf\",\"contentSize\":166454,\"modifiedDate\":\"\",\"signedDate\":\"\",\"detachedDate\":\"\",\"fileUid\":\"f38a2f01-1704-4251-8ef1-bbb98180314d\",\"fileType\":\"pdf\",\"createDate\":\"2017-09-19T10:47:15.502Z\",\"attachedDate\":\"\"},\"businessInfo\":{\"isRequired\":\"\",\"isAttachted\":\"\",\"isSigned\":\"\",\"documentType\":\"APPLICATION\",\"attachmentType\":\"\",\"profileId\":\"\",\"isGenBySystem\":\"true\",\"documentName\":\"\",\"moduleId\":\"\",\"ownerId\":\"\",\"isSignRequired\":\"\"}}],\"insured\":{\"insuredObj\":{\"vehicleBody\":\"\",\"usage\":\"PV\",\"loanReference\":\"Reference 1\",\"purchasePrice\":\"\",\"chassis\":\"Abcdef 789\",\"taxPaid\":\"\",\"capacity\":\"CM02\",\"claimHistory\":\"0\",\"makeModelCode\":\"MAZ014\",\"engine\":\"Abcdef 789\",\"registrationNo\":\"ABC567\",\"registrationDate\":\"\",\"vehicleType\":\"MO\"},\"questionnaires\":[{\"code\":\"QS1\",\"detail\":{},\"value\":\"N\"},{\"code\":\"QS2\",\"detail\":{},\"value\":\"Y\"}],\"declarationAcceptance\":\"Y\",\"coverages\":{\"endDate\":\"20180918\",\"additional\":[{\"code\":\"\"}],\"main\":\"CO\",\"startDate\":\"20170919\"}},\"meta\":{\"uid\":\"47492783-9cc9-4d74-937e-001cfb881e77\",\"modifyDate\":\"2017-09-19T03:44:19.513Z\",\"docType\":\"\",\"applicationNo\":\"APP777776666098\",\"policyNo\":\"V0005543\",\"title\":\"\",\"underwritingCheck\":\"FAIL\",\"caseNo\":\"BCVPS777776666098\",\"version\":\"1.0.0\",\"quotationNo\":\"QN777776666098\",\"createDate\":\"2017-09-19T03:44:19.513Z\",\"status\":{\"documentStatus\":[{\"updateDate\":\"\",\"statusCode\":\"\"}],\"businessStatus\":[{\"updateDate\":\"\",\"statusCode\":\"\"},{\"code\":\"DELIVERIED\",\"message\":\"DELIVERIED\"},{\"code\":\"NOTIFIED\",\"message\":\"NOTIFIED\"},{\"code\":\"SUCCESS_ACK\",\"message\":\"Success Acknowledge\"},{\"code\":\"CLIENT_NO\",\"message\":\"50017290\"},{\"code\":\"POLICY_NO\",\"message\":\"V0005543\"},{\"code\":\"RECEIPT_NO\",\"message\":\"\"},{\"code\":\"SEND_EMAIL_SUCCESS\",\"message\":\"SEND_EMAIL_SUCCESS\"}]}},\"parties\":{\"individual\":[{\"person\":{\"maritalStatusCode\":\"\",\"genderCode\":\"\",\"nationalityCode\":\"\",\"addresses\":[{\"country\":\"\",\"unitNo\":\"\",\"addressType\":\"RESIDENTIAL\",\"cityCode\":\"\",\"provinceCode\":\"\",\"houseNumber\":\"\",\"buildingName\":\"\",\"areaCode\":\"\",\"street\":\"\",\"fullAddress\":{\"address3\":\"\",\"address2\":\"\",\"address1\":\"\",\"address5\":\"\",\"address4\":\"\"},\"stateCode\":\"\",\"postCode\":\"\",\"prefered\":\"\"},{\"country\":\"\",\"unitNo\":\"\",\"addressType\":\"MAILING\",\"cityCode\":\"\",\"provinceCode\":\"\",\"houseNumber\":\"\",\"buildingName\":\"\",\"areaCode\":\"\",\"street\":\"\",\"fullAddress\":{\"address3\":\"\",\"address2\":\"\",\"address1\":\"\",\"address5\":\"\",\"address4\":\"\"},\"stateCode\":\"\",\"postCode\":\"\",\"prefered\":\"\"}],\"occupationCode\":\"\",\"name\":{\"last\":\"\",\"title\":\"\",\"first\":\"\",\"full\":\"AGT01 - SGT\"},\"deliveryType\":\"\",\"idList\":[{\"code\":\"STAFFID\",\"value\":\"agt001\"}],\"birthDate\":\"\",\"branch\":\"Head Office\",\"contacts\":[{\"code\":\"EMAIL\",\"value\":\"apaunderwritting@gmail.com\"},{\"code\":\"PHONE\",\"value\":\"\"}]},\"roles\":[\"CO\"]},{\"person\":{\"maritalStatusCode\":\"S\",\"genderCode\":\"F\",\"nationalityCode\":\"LAO\",\"addresses\":[{\"country\":\"LAO\",\"unitNo\":\"\",\"addressType\":\"RESIDENTIAL\",\"cityCode\":\"\",\"provinceCode\":\"\",\"houseNumber\":\"\",\"buildingName\":\"\",\"areaCode\":\"\",\"street\":\"\",\"fullAddress\":{\"address3\":\"District 2\",\"address2\":\"Ward 1\",\"address1\":\"123 Cong Hoa, P.13, Tan Binh\",\"address5\":\"Lao\",\"address4\":\"City 3\"},\"stateCode\":\"\",\"postCode\":\"551236\",\"prefered\":\"\"},{\"country\":\"LAO\",\"unitNo\":\"\",\"addressType\":\"MAILING\",\"cityCode\":\"\",\"provinceCode\":\"\",\"houseNumber\":\"\",\"buildingName\":\"\",\"areaCode\":\"\",\"street\":\"\",\"fullAddress\":{\"address3\":\"District 2\",\"address2\":\"Ward 1\",\"address1\":\"1234 Street\",\"address5\":\"Lao\",\"address4\":\"City 3\"},\"stateCode\":\"\",\"postCode\":\"12456\",\"prefered\":\"\"}],\"occupationCode\":\"ADAS\",\"name\":{\"last\":\"Nguyen\",\"title\":\"Ms\",\"first\":\"Anh\",\"full\":\"\"},\"deliveryType\":\"CN\",\"idList\":[{\"code\":\"P\",\"value\":\"678910\"}],\"birthDate\":\"19930611\",\"contacts\":[{\"code\":\"EMAIL\",\"value\":\"email@domain.com\"},{\"code\":\"PHONE\",\"value\":\"\"},{\"code\":\"TELEPHONE\",\"value\":\"\"}]},\"roles\":[\"PO\"]},{\"person\":{\"maritalStatusCode\":\"\",\"genderCode\":\"\",\"nationalityCode\":\"\",\"licenseYear\":\"\",\"addresses\":[{\"country\":\"\",\"unitNo\":\"\",\"addressType\":\"RESIDENTIAL\",\"cityCode\":\"\",\"provinceCode\":\"\",\"houseNumber\":\"\",\"buildingName\":\"\",\"areaCode\":\"\",\"street\":\"\",\"fullAddress\":{\"address3\":\"\",\"address2\":\"\",\"address1\":\"\",\"address5\":\"\",\"address4\":\"\"},\"stateCode\":\"\",\"postCode\":\"\",\"prefered\":\"\"},{\"country\":\"\",\"unitNo\":\"\",\"addressType\":\"MAILING\",\"cityCode\":\"\",\"provinceCode\":\"\",\"houseNumber\":\"\",\"buildingName\":\"\",\"areaCode\":\"\",\"street\":\"\",\"fullAddress\":{\"address3\":\"\",\"address2\":\"\",\"address1\":\"\",\"address5\":\"\",\"address4\":\"\"},\"stateCode\":\"\",\"postCode\":\"\",\"prefered\":\"\"}],\"occupationCode\":\"\",\"name\":{\"last\":\"\",\"title\":\"\",\"first\":\"\",\"full\":\"\"},\"deliveryType\":\"\",\"idList\":[{\"code\":\"DRIVER_ID\",\"value\":\"\"}],\"birthDate\":\"\",\"contacts\":[{\"code\":\"EMAIL\",\"value\":\"\"},{\"code\":\"PHONE\",\"value\":\"\"}]},\"roles\":[\"DRIVER\"]}],\"corporate\":[],\"partyType\":\"I\"},\"payment\":[{\"bankCode\":\"\",\"checkNumber\":\"\",\"yourReference\":\"\",\"paymentMode\":\"\",\"totalAmountPayable\":\"89497.00\",\"paymentReferenceNo\":\"\",\"checkDate\":\"\",\"paymentCurrency\":[{\"amount\":\"0\",\"code\":\"LAK\",\"rate\":\"1.00\"}]}],\"printLanguage\":\"E\",\"pricing\":{\"basicPremium\":\"73000.00\",\"discounts\":[{\"code\":\"OTHER\",\"premium\":\"730.00\",\"value\":\"1\"},{\"code\":\"NCD\",\"premium\":\"0.00\",\"value\":\"0\"}],\"registrationFee\":\"10000.00\",\"vatFee\":\"7227.00\",\"additionalPremiums\":[{\"premium\":\"0.00\",\"coverCode\":\"\"}],\"totalAmountPayable\":\"89497.00\",\"totalPayablePremium\":\"72270.00\"}}}";
//
//		/** Call setters of testResponse **/
//
//		RestTemplate restTemplate = Mockito.mock(RestTemplate.class);
//		PowerMockito.whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemplate);
//
//		// true Condition
//		ResponseEntity<Object> respEntity = new ResponseEntity<Object>(result, HttpStatus.OK);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity);
//		PowerMockito.when(restTemplate.exchange(Matchers.anyString(), eq(HttpMethod.POST),
//				Matchers.any(HttpEntity.class), Matchers.any(Class.class))).thenReturn(respEntity);
//		assertEquals(true, servicePAS.processingInformation(caseId, packageFB, user));
//		LOGGER.info("processingErrors: true");
//
//		// false condition
//		ResponseEntity<Object> respEntity1 = new ResponseEntity<Object>("", HttpStatus.NOT_FOUND);
//		PowerMockito.when(restTemplate.postForEntity(Matchers.anyString(), Matchers.any(HttpEntity.class),
//				Matchers.any(Class.class), Matchers.anyMap())).thenReturn(respEntity1);
//		PowerMockito.when(restTemplate.exchange(Matchers.anyString(), eq(HttpMethod.POST),
//				Matchers.any(HttpEntity.class), Matchers.any(Class.class))).thenReturn(respEntity1);
//		assertEquals(false, servicePAS.processingInformation(caseId, packageFB, user));
//		LOGGER.info("processingErrors: false");
//	}
//
//	@SuppressWarnings("unchecked")
//	@Test
//	public void testCheckAgent() throws Exception {
//		String agenIdActive = "10003624";
//		String agenIdNotFound = "100036245";
//		String agenIdTerminated = "10000496";
//		String activeContent = "{\"_returnSpecified\":true,\"_return\":{\"result\":\"Account name: Truong Hao                     ,Email: Truon@gmail.com                                    , Branch: 10, Branch Long Description: Head Office                   \",\"resultSpecified\":true,\"errors\":[null],\"errorsSpecified\":true}}";
//		String notFoundContent = "{\"_returnSpecified\":true,\"_return\":{\"result\":null,\"resultSpecified\":false,\"errors\":[{\"errorCodeSpecified\":true,\"errorDescription\":\"Account does not exist\",\"errorDescriptionSpecified\":true,\"errorCode\":\"F805\"}],\"errorsSpecified\":true}}";
//		String terminatedContent = "{\"_returnSpecified\":true,\"_return\":{\"result\":null,\"resultSpecified\":false,\"errors\":[{\"errorCodeSpecified\":true,\"errorDescription\":\"Account is terminated\",\"errorDescriptionSpecified\":true,\"errorCode\":\"E144\"}],\"errorsSpecified\":true}}";
//		String uri = "http://ec2-52-221-169-161.ap-southeast-1.compute.amazonaws.com/Ihub/api/SalesAgentEnquiryService/{id}";
//		Products product = Products.valueOf("VPM");
//
//		RestTemplate restTemp = PowerMockito.mock(RestTemplate.class);
//		PowerMockito.whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemp);
//		Mockito.when(context.getBean(anyString())).thenReturn(productGroup);
//		Mockito.when(productGroup.isEnablingIHUB()).thenReturn(true);
//		
//		PowerMockito.when(restTemp.getForObject(anyString(), anyObject(), anyMap())).thenReturn(activeContent);
//		Mockito.when(integrateConfig.getCheckAgent()).thenReturn(uri);
//		assertNotNull(servicePAS.checkAgentID(agenIdActive, product));
//		LOGGER.info("AgentId active: " + servicePAS.checkAgentID(agenIdActive, product).toString());
//
//		PowerMockito.when(restTemp.getForObject(anyString(), anyObject(), anyMap())).thenReturn(notFoundContent);
//		Mockito.when(integrateConfig.getCheckAgent()).thenReturn(uri);
//		assertNotNull(servicePAS.checkAgentID(agenIdNotFound, product));
//		LOGGER.info("AgentId not found: " + servicePAS.checkAgentID(agenIdNotFound, product).toString());
//
//		PowerMockito.when(restTemp.getForObject(anyString(), anyObject(), anyMap())).thenReturn(terminatedContent);
//		Mockito.when(integrateConfig.getCheckAgent()).thenReturn(uri);
//		assertNotNull(servicePAS.checkAgentID(agenIdTerminated, product));
//		LOGGER.info("AgentID terminated: " + servicePAS.checkAgentID(agenIdTerminated, product).toString());
//	}
//
//	@Test
//	public void testGetPExchangeRateCurrency() throws Exception {
//		String uri = "http://ec2-52-221-169-161.ap-southeast-1.compute.amazonaws.com/Ihub/api/ExchangeReturnService/general";
//		String content = "{\"_returnSpecified\":true,\"_return\":{\"result\":[{\"currency\":\"THB\",\"currencySpecified\":true,\"rateNumberSpecified\":true,\"rateExchangeSpecified\":true,\"rateNumber\":\"241.095\",\"rateExchange\":\"241.0950000\",\"errorCode\":\"\",\"errorCodeSpecified\":true},{\"currency\":\"USD\",\"currencySpecified\":true,\"rateNumberSpecified\":true,\"rateExchangeSpecified\":true,\"rateNumber\":\"8211.0\",\"rateExchange\":\"8211.0000000\",\"errorCode\":\"\",\"errorCodeSpecified\":true}],\"resultSpecified\":true,\"errors\":[null],\"errorsSpecified\":true}}";
//		Products product = Products.valueOf("VPM");
//		RestTemplate restTemp = PowerMockito.mock(RestTemplate.class);
//		PowerMockito.whenNew(RestTemplate.class).withNoArguments().thenReturn(restTemp);
//
//		PowerMockito.when(restTemp.getForObject(anyString(), anyObject())).thenReturn(content);
//
//		Mockito.when(integrateConfig.getExchangeRateCurrency()).thenReturn(uri);
//		Mockito.when(context.getBean(anyString())).thenReturn(productGroup);
//		Mockito.when(productGroup.isEnablingIHUB()).thenReturn(true);
//		assertNotNull(servicePAS.getPExchangeRateCurrency(product));
//		LOGGER.info("Get exchange rate currency: " + servicePAS.getPExchangeRateCurrency(product).toString());
//	}
}
