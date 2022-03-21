package com.csc.gdn.integralpos.batch.service;

import java.util.Map;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;

import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.ExchangeFilterFunctions;
import org.springframework.web.reactive.function.client.WebClient;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.properties.BatchProperties;

import java.io.StringWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.codehaus.jettison.json.JSONTokener;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Mono;

@Service("commonBatchService")
public class CommonBatchService {
	
	@Autowired
	private BatchProperties batchProperties;

	@Value("${microservices.emailServiceId}")
	private String emailServiceId;
	
	@Value("${reporting.receiver}")
	private String emailReceiver;
	
	@Value("${reporting.server}")
	private String apiServer;

	public ExchangeFilterFunction oauth2Credentials(Map authorizedClient) {
		return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
			ClientRequest authorizedRequest = ClientRequest.from(clientRequest)
					.header(HttpHeaders.AUTHORIZATION, "Bearer " + authorizedClient.get("access_token")).build();
			return Mono.just(authorizedRequest);
		});
	}

	public Map getApplicationToken() {
		String clientId = batchProperties.getClientId();
		String clientSecret = batchProperties.getClientSecret();
		String authServerURL = batchProperties.getServer();
		String requestURL = batchProperties.getCredentialUrl();
		Map object = WebClient.builder().filter(ExchangeFilterFunctions.basicAuthentication(clientId, clientSecret))
				.build().post().uri(authServerURL + requestURL).retrieve().bodyToMono(Map.class).block();
		SecurityUtil.logMessage("access_token ==> " + (String) object.get("access_token"));
		return object;
	}

	public void sendEmail(String uuid) {
		SecurityUtil.logMessage("Before sending mail with attachmentId = " + uuid);
		String requestUri = apiServer + BatchConstants.URL_AUTO_RECOVERY_MAIL;
		Map<String, String> params = new HashMap<String, String>();
		params.put(BatchConstants.OTP, "IFE Payment Reconciliation Batch Report");
		params.put(BatchConstants.BATCH_NAME, "Payment Reconciliation");
		params.put(BatchConstants.TO_EMAIL, emailReceiver);
		params.put(BatchConstants.ATTACHMENT_ID, uuid);
		WebClient.builder().filter(oauth2Credentials(getApplicationToken())).build()
			.post().uri(requestUri).body(Mono.just(params), Map.class)
			.retrieve().bodyToMono(Map.class).block();
		SecurityUtil.logMessage("After sending mail with attachmentId = " + uuid);
	}
	
	public String setURIParameter(String uriPath, List<String> params) {
		StringBuilder resultURIPath = new StringBuilder(uriPath);
		for (int i = 0; i < params.size(); i++) {
			if (StringUtils.contains(uriPath, "{" + i + "}")) {
				int keyIndex = StringUtils.indexOf(uriPath, "{" + i + "}");
				resultURIPath.replace(keyIndex, keyIndex + 3, params.get(i));
				uriPath = resultURIPath.toString();
			}
		}
		return resultURIPath.toString();
	}
	
	public <T> String convertObject2String(Class<T> clazz) throws JAXBException {
		JAXBContext context = JAXBContext.newInstance(clazz.getClass());
		Marshaller jaxbMarshaller = context.createMarshaller();
		jaxbMarshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, false);
		StringWriter sw = new StringWriter();
		jaxbMarshaller.marshal(clazz, sw);
		return sw.toString();
	}
	
	public JSONArray readFileAsJSON(String absoluteFilePath) {
		JSONArray result = new JSONArray();
		try {
			String content = new String(Files.readAllBytes(Paths.get(absoluteFilePath)));
			Object json = new JSONTokener(content).nextValue();
			if (json instanceof JSONObject) {
				result.put(json);
			} else if (json instanceof JSONArray) {
				result = (JSONArray) json;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

}