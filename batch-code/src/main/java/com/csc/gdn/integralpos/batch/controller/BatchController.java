package com.csc.gdn.integralpos.batch.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.csc.gdn.integralpos.batch.service.BatchMQService;
import com.csc.gdn.integralpos.batch.service.BatchQuoteService;
import com.csc.gdn.integralpos.batch.service.CommonBatchService;
import com.csc.gdn.integralpos.batch.service.CoverNoteService;
import com.csc.gdn.integralpos.batch.service.PostalCodeService;
import com.csc.gdn.integralpos.batch.service.ReconService;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;
import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.csc.gdn.integralpos.batch.properties.BatchMQProperties;

@RestController
public class BatchController {
	
	@Autowired
	private BatchMQProperties batchMQProperties;
	
	@Autowired
	private BatchMQService batchMQService;
	
	@Autowired
	private BatchQuoteService batchQuoteService;
	
	@Autowired
	private ReconService reconService;
	
	@Autowired
	private PostalCodeService postalCodeService;
	
	@Autowired
	private CoverNoteService coverNoteService;
	
	@Autowired
	private CommonBatchService commonService;
	
	// quote job
	@GetMapping("/invokeQuotejobSchedule")
	public String toggleQuoteJob() throws Exception {
		return "Run invokeJob - " + batchQuoteService.toggleJob();
	}
	
	@GetMapping("/invoked-quote-job")
	public String runQuoteJob() throws Exception {
		batchQuoteService.launchJob();
		return "Run invokeJob - invokeQuotejobOne";
	}

	// epay job
	@GetMapping("/invokeEpayjobSchedule")
	public String toggleEpayJob() throws Exception {
		return "Run invokeJob - " + batchMQService.toggleJob();
	}

	@GetMapping("/invokeEpayjob")
	public String runEpayJob() throws Exception {
		batchMQService.launchJob();
		return "Run invokeJob - invokeEpayjobOnce";
	}
	
	// MQ job
	@PostMapping("/invokeResponseMQ")
	public String runSendResponseMQ(@RequestBody String xmlString) throws Exception {
		batchMQService.sendResponseQueue(batchMQProperties.getQueueResponse(), xmlString);
		return "Run invokeJob - invokeonRpayOne";
	}
	
	// reconci job
	@GetMapping("/invokeonRpayjobSchedule")
	public String toggleRpayJob() throws Exception {
		return "Run invokeJob - " + reconService.toggleJob();
	}
	
	@GetMapping("/invokeonRpayjob")
	public String runRpayJob() throws Exception {
		reconService.launchJob();
		return "Run invokeJob - invokeonRpayOne";
	}
	
	// postal code job
	@PostMapping(value = "/uploadCSVFile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Object> uploadCSV(@RequestPart(value = "files", required = true) MultipartFile files[]) throws Exception {
		SecurityUtil.logMessage("Start - invoking uploadFile");
		if (files.length == 0) {
			throw new RuntimeException("You must select the a file for uploading");
		}
		Map<String, String> result = new HashMap<String, String>();
		postalCodeService.launchJob(files);
		result.put("originalName", files[0].getOriginalFilename());
		result.put("contentType", files[0].getContentType());
		result.put("fileName", files[0].getName());
		result.put("fileSize", String.valueOf(files[0].getSize()));
		SecurityUtil.logMessage("End - invoking uploadFile");
		return new ResponseEntity<Object>(result, HttpStatus.OK);
	}
	
	// cover note job
	@GetMapping("/invokeCoverNoteJobSchedule")
	public String toggleCoverJob() throws Exception {
		return "Run invokeJob - " + coverNoteService.toggleJob();
	}
	
	@GetMapping("/invokeCoverNoteJob")
	public String runCoverJob() throws Exception {
		coverNoteService.launchJob();
		return "Run invokeJob - invokeonRpayOne";
	}
	
//	@GetMapping("/test")
//	public String test() throws Exception {
//		Gson gson = new Gson();
//		
//		JSONArray arr = commonService.readFileAsJSON("C:\\Users\\cluu2\\Desktop\\JPJ\\JPJEnquiry-Response-list.json");
//		List<JSONObject> lsResponseFromJPJ = new ArrayList<JSONObject>();
//		for (int i = 0; i < arr.length(); i++) {
//			lsResponseFromJPJ.add(arr.getJSONObject(i));
//		}
//		
//		JSONArray arr2 = commonService.readFileAsJSON("C:\\Users\\cluu2\\Desktop\\JPJ\\quotation-list.json");
//		List<PNCQuotationModel> lsCoverNote = new ArrayList<PNCQuotationModel>();
//		for (int i = 0; i < arr2.length(); i++) {
//			PNCQuotationModel quote = gson.fromJson(arr2.getJSONObject(i).toString(), PNCQuotationModel.class);
//			lsCoverNote.add(quote);
//		}
//		
//		Map<String, List<?>> result = new HashMap<String, List<?>>();
//		result.put("lsCoverNote", lsCoverNote);
//		result.put("lsResponseFromJPJ", lsResponseFromJPJ);
//		coverNoteService.handleResponseCasesList(result);
//		return "Run invokeJob - invokeonRpayOne";
//	}
	
//	@GetMapping("/testGenCoverNoteList")
//	public String testGenCoverNoteList() throws Exception {
//		Gson gson = new Gson();
//		JSONArray arr2 = commonService.readFileAsJSON("C:\\Users\\cluu2\\Desktop\\JPJ\\quotation-list.json");
//		List<PNCQuotationModel> lsCoverNote = new ArrayList<PNCQuotationModel>();
//		for (int i = 0; i < arr2.length(); i++) {
//			PNCQuotationModel quote = gson.fromJson(arr2.getJSONObject(i).toString(), PNCQuotationModel.class);
//			lsCoverNote.add(quote);
//		}
//		List<JSONObject> lsResponseFromJPJ = new ArrayList<JSONObject>();
//		Map<String, Object> lsRequest2JPJ = coverNoteService.genRequestCoverNoteList(lsCoverNote);
//		lsResponseFromJPJ.add(coverNoteService.callJPJService(lsRequest2JPJ));
//		
//		return "Run invokeJob - testGenCoverNoteList";
//	}
//	
//	@GetMapping("/testPolicySubmission")
//	public String testPolicySubmission() throws Exception {
//		Gson gson = new Gson();
//		JSONArray arr = commonService.readFileAsJSON("C:\\Users\\cluu2\\Desktop\\JPJ\\quotation-list.json");
//		PNCQuotationModel quote = gson.fromJson(arr.getJSONObject(0).toString(), PNCQuotationModel.class);
//		coverNoteService.submitPolicySubmission(quote);
//		return "Run invokeJob - testPolicySubmission";
//	}
	@GetMapping("/test")
	public String testPolicySubmission() throws Exception {
		Gson gson = new Gson();
		JSONArray arr = commonService.readFileAsJSON("C:\\Users\\cluu2\\Desktop\\JPJ\\quotation-list.json");
		PNCQuotationModel quote = gson.fromJson(arr.getJSONObject(0).toString(), PNCQuotationModel.class);
		coverNoteService.triggerPXSendMail(quote.getId());
		return "Run invokeJob - testPolicySubmission";
	}
	
//	@GetMapping("/test")
//	public String testQuery() throws Exception {
//		coverNoteService.getListQuotation();
//		return "Run invokeJob - testQuery";
//	}
}
