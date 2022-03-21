package com.csc.gdn.integralpos.batch.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.batch.operations.JobRestartException;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.elasticsearch.action.search.ClearScrollRequest;
import org.elasticsearch.action.search.ClearScrollResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.Scroll;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.owasp.security.logging.util.SecurityUtil;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.job.CoverNoteJob;
import com.csc.gdn.integralpos.batch.properties.ESProperties;
import com.csc.gdn.integralpos.batch.repository.BatchQuotationRepository;
import com.csc.gdn.integralpos.batch.utils.BatchUtils;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;
import com.csc.gdn.integralpos.quotation.pnc.pas.returned.ProposalCreationModel;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import reactor.core.publisher.Mono;

@Service("coverNoteService")
public class CoverNoteServiceImpl implements CoverNoteService{
	
	@Autowired
	private ESProperties esProperties;
	
	@Value("${JPJEnquiryAPI.url}")
    private String jpjEnquiryURL;
	
	@Value("${reporting.server}")
	private String apiServer;
	
	private AtomicInteger countSuccess = new AtomicInteger(0);
	private AtomicBoolean batchJobState = new AtomicBoolean(false);
	private Gson gson = new Gson();
	private List<JSONObject> lsResponseCases = new ArrayList<JSONObject>();
	
	@Autowired
	private BatchUtils batchUtils;
	
	@Autowired
	private CommonBatchService commonBatchService;

	@Autowired
	private RestHighLevelClient client;

	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	@Qualifier("coverJob")
	private Job coverJob;

	@Autowired
	private CoverNoteJob coverNoteJob;
	
	private BatchQuotationRepository quoteRepository;
	
	@Autowired
	public void setBatchPaymentRepository(BatchQuotationRepository quoteRepository) {
		this.quoteRepository = quoteRepository;
	}

	// constructor
	public CoverNoteServiceImpl() throws JSONException {
		this.lsResponseCases = generateLsResponseCases();
	}

	@Override
	public int getNextCountRecordsSuccessfully() {
		return countSuccess.getAndIncrement();
	}

	@Override
	public int getCountRecordsSuccessfully() {
		return countSuccess.get();
	}

	@Override
	public void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
			JobRestartException, JobInstanceAlreadyCompleteException {
		countSuccess.set(0);
		try {
			JobParameters params = new JobParametersBuilder()
					.addString("JobID", String.valueOf(System.currentTimeMillis()))
					.addString("Wish", "Pray to run successfully").addString("JobName", coverJob.getName())
					.toJobParameters();
			jobLauncher.run(coverJob, params);
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}

	@Override
	public boolean toggleJob() {
		return coverNoteJob.toggle();
	}

	@Override
	public boolean toggleBatchJobState() {
		batchJobState.set(!batchJobState.get());
		SecurityUtil.logMessage("TOGGLED '" + batchJobState.get() + "' ON BatchJobState");
		return batchJobState.get();
	}

	@Override
	public boolean getBatchJobState() {
		return batchJobState.get();
	}
	
	@Override
	public PNCQuotationModel save(PNCQuotationModel quoteObj) {
		return quoteRepository.save(quoteObj);
	}
	
	/*
	 * Idea:
	 * + Create a list all cases with corresponding Actions List "lsResponseCases"
	 * 	 [{"responseCase":{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":true},"actions":["01","02","03"]},
	 *   {"responseCase":{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":false},"actions":["01","02","03"]}]
	 * 
	 * + Send & Receive from JPJService --> eventually, generate "lsResponseObj2Compare" to compare with the list above:
	 * 	 [{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":true},
	 *   {"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":false}]
	 * 
	 * + loop the above 2 lists and compare each ResponseCase of "lsResponseObj2Compare"
	 * 	with every lsResponseCases's element, then get corresponding actions list
	 * 	EX: "responseCase":{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":true}
	 * 		--> "actions":["01","02","03"]
	 * 
	 * + run corresponding handle for "actions":["01","02","03"]
	 * 
	 * How to custom:
	 * 1/ generateLsResponseCases() --> change list response cases
	 * 2/ callJPJService() --> calling JPJ Service by WebClient
	 * 3/ handleSpecificResponseCase() --> handle a specific Response Case
	 * 
	 * Explain flow of CoverNoteService:
	 * + Constructor:
	 *   1/ Generate a list all cases with corresponding Actions:
	 *   	lsResponseCases = generateLsResponseCases();
	 *   	[{"responseCase":{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":true},"actions":["01","02","03"]},
	 *   	{"responseCase":{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":false},"actions":["01","02","03"]}]
	 * + Reader:
	 *   1/ Get list of quotation from ES by some conditions
	 *   	getListQuotation() --> Adjust conditions: QueryBuilder query = QueryBuilders.boolQuery()
	 * + Processor:
	 *   1/ generate list of Request Cover Note: genRequestCoverNoteList()
	 *   2/ send single/list Request Cover Note to JPJ Service: callJPJService()
	 *   3/ receive single/list Response Cover Note --> return list of JSONObject in processCoverNoteStatus() eventually
	 * + Writer: inside handleResponseCasesList()
	 *   1/ generate "lsResponseObj2Compare" compare with "lsResponseCases" in Constructor: genResponseObj2Compare()
	 *   	[{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":true},
	 *   	{"jpjStatus":"01","documentType":"3","reasonCode":"0","hasVehicleNumber":false}]
	 *   2/ use for loop to compare each ResponseCase of "lsResponseObj2Compare" with every lsResponseCases's element,
	 *   then get corresponding "actions" list
	 *   3/ for loop "actions" list --> handle specific case by handleSpecificResponseCase()
	 * */
	
	// using in constructor=========================================================================
	// generate a list -> [{"responseCase": {"jpjStatus": "", "documentType": "", "reasonCode": "", "hasVehicleNumber": ""}, "actions": [] }]
	private JSONObject genResponseCaseObj(String jpjStatus, String docType, String reasonCode, Boolean hasVehicleNo, String[] lsActions) throws JSONException {
		// create responseCase
		JSONObject resCaseObj = new JSONObject();
		resCaseObj.put(BatchConstants.JPJ_STATUS_RES_FIELD, jpjStatus);
		resCaseObj.put(BatchConstants.JPJ_DOCTYPE_RES_FIELD, docType);
		resCaseObj.put(BatchConstants.JPJ_REASON_RES_FIELD, reasonCode);
		resCaseObj.put(BatchConstants.JPJ_HAS_VEHICLE_RES_FIELD, hasVehicleNo);
		
		// create lsActions
		JSONArray actionsArr = new JSONArray();
		for (int i = 0; i < lsActions.length; i++) {
			actionsArr.put(lsActions[i]);
		}
		
		// add to list
		JSONObject resObj = new JSONObject();
		resObj.put(BatchConstants.JPJ_RES_CASE, resCaseObj);
		resObj.put(BatchConstants.JPJ_LS_ACTIONS, actionsArr);
		return resObj;
	}
	
	// init Response Cases List
	private List<JSONObject> generateLsResponseCases() throws JSONException {
		List<JSONObject> results = new ArrayList<JSONObject>();
		// add 1st case
		// add 2nd case
		String[] lsActions = new String[]{BatchConstants.JPJ_CALL_ISM_NCD, BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED, BatchConstants.JPJ_UPDATE_QUOTATION_STATUS_REJECTED};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_CANCEL_CASES_CODE, BatchConstants.JPJ_REASON_NEW_CAR_REGIS_CODE, true, lsActions));
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_CANCEL_CASES_CODE, BatchConstants.JPJ_REASON_NEW_CAR_REGIS_CODE, false, lsActions));
		// add 3rd case
		lsActions = new String[]{BatchConstants.JPJ_CALL_POLICY_ISSUED, BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_NEW_COVERNOTE_CODE, BatchConstants.JPJ_REASON_NEW_BUSINESS_FOR_REGIS_CAR_CODE, true, lsActions));
		// add 4th case
		lsActions = new String[]{BatchConstants.JPJ_TRIGGER_PX_SEND_MAIL, BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_NEW_COVERNOTE_CODE, BatchConstants.JPJ_REASON_NEW_CAR_REGIS_CODE, false, lsActions));
		// add 5th case
		lsActions = new String[]{BatchConstants.JPJ_UPDATE_QUOTATION_DATA, BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED, BatchConstants.JPJ_CALL_POLICY_ISSUED};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_UPDATE_EXISTING_REC_CODE, BatchConstants.JPJ_REASON_INTERCHANGE_CODE, true, lsActions));
		// add 6th case
		lsActions = new String[]{BatchConstants.JPJ_UPDATE_QUOTATION_DATA, BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED, BatchConstants.JPJ_CALL_POLICY_ISSUED};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_UPDATE_EXISTING_REC_CODE, BatchConstants.JPJ_REASON_EXTENSION_POLICY_CODE, true, lsActions));
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_UPDATE_EXISTING_REC_CODE, BatchConstants.JPJ_REASON_UPDATE_IDNO_CODE, true, lsActions));
		// add 7th case
		lsActions = new String[]{BatchConstants.JPJ_UPDATE_QUOTATION_DATA, BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED, BatchConstants.JPJ_TRIGGER_PX_SEND_MAIL};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_UPDATE_EXISTING_REC_CODE, BatchConstants.JPJ_REASON_EXTENSION_POLICY_CODE, false, lsActions));
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_ACCEPTED_CODE, BatchConstants.JPJ_DOCTYPE_UPDATE_EXISTING_REC_CODE, BatchConstants.JPJ_REASON_UPDATE_IDNO_CODE, false, lsActions));
		// add 8th case
		lsActions = new String[]{BatchConstants.JPJ_UPDATE_JPJ_STATUS_REJECTED};
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_REJECTED_CODE, BatchConstants.JPJ_DOCTYPE_NEW_COVERNOTE_CODE, BatchConstants.JPJ_REASON_BLANK, true, lsActions));
		results.add(genResponseCaseObj(BatchConstants.JPJ_STATUS_REJECTED_CODE, BatchConstants.JPJ_DOCTYPE_NEW_COVERNOTE_CODE, BatchConstants.JPJ_REASON_BLANK, false, lsActions));
		return results;
	}
	// using in constructor ============================================================================
	
	// Reader - get list quotation by conditions
	@Override
	public List<PNCQuotationModel> getListQuotation() throws Exception {
		final Scroll scroll = new Scroll(TimeValue.timeValueSeconds(esProperties.getScrollTimeOut()));
		List<SearchHit[]> lsSearchHitArray = new ArrayList<SearchHit[]>();
		//build searchRequest
		SearchRequest searchRequest = buildSearchRequest(BatchConstants.QUOTATION_INDEX, BatchConstants.QUOTATION_TYPE);
		//create searchBuild
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		//build & set query
		QueryBuilder query = QueryBuilders.boolQuery()
				.must(QueryBuilders.termQuery("metaData.productFamily.code", BatchConstants.PRODUCT_CLASS_PMOT_CODE))
				.must(QueryBuilders.termQuery("metaData.businessStatus.code", BatchConstants.COMPLETE_CODE))
				.should(QueryBuilders.termQuery("coverNoteInformation.jpjStatus.code", BatchConstants.JPJ_PENDING_CODE))
				.should(QueryBuilders.termQuery("coverNoteInformation.jpjStatus.code", BatchConstants.JPJ_ACCEPTED_CODE))
				.mustNot(QueryBuilders.existsQuery("metaData.policyNo"));
		searchSourceBuilder.query(query);
		SecurityUtil.logMessage("Query: " + query.toString());
		//set size
		searchSourceBuilder.size(esProperties.getScrollSize());
		//set search builder
		searchRequest.source(searchSourceBuilder);
		//set scroll timeout
		searchRequest.scroll(scroll);
		//search response
        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);
        long totalHits = searchResponse.getHits().getTotalHits();
        SecurityUtil.logMessage("Get total:" + totalHits);
        //get scrollId
        String scrollId = searchResponse.getScrollId();
        //get first hits
        SearchHit[] searchHits = searchResponse.getHits().getHits();
        //add to list
        lsSearchHitArray.add(searchHits);
        //loop & get hits until no documents are returned
        while (searchHits != null && searchHits.length > 0) {
        	//search scroll request
        	SearchScrollRequest scrollRequest = new SearchScrollRequest(scrollId);
        	scrollRequest.scroll(scroll);
        	searchResponse = client.scroll(scrollRequest, RequestOptions.DEFAULT);
        	scrollId = searchResponse.getScrollId();
        	searchHits = searchResponse.getHits().getHits();
        	if(searchHits.length > 0) lsSearchHitArray.add(searchHits);
        }
        //clear scroll request
        ClearScrollRequest clearScrollRequest = new ClearScrollRequest();
        clearScrollRequest.addScrollId(scrollId);
        ClearScrollResponse clearScrollResponse = client.clearScroll(clearScrollRequest, RequestOptions.DEFAULT);
        if(clearScrollResponse.isSucceeded()) {
        	return getSearchResult(lsSearchHitArray);
        }
        return null;
	}
	
	private SearchRequest buildSearchRequest(String searchIndex, String searchType) {
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.indices(searchIndex);
        searchRequest.types(searchType);
        return searchRequest;
    }
	
	private List<PNCQuotationModel> getSearchResult(List<SearchHit[]> lsSearchHits) {
		SearchHit[] searchHits = lsSearchHits.stream().flatMap(arr -> Stream.of(arr)).toArray(SearchHit[]::new);
        List<PNCQuotationModel> results = Arrays.stream(searchHits)
        		.map(hit->gson.fromJson(hit.getSourceAsString(), PNCQuotationModel.class))
        		.collect(Collectors.toList());
        return results;
	}
	// End getting list quotation
	
	// processor - processing list quotation
	@Override
	public Map<String, List<? extends Object>> processCoverNoteStatus(List<PNCQuotationModel> lsCoverNote) throws Exception{
		// generate Request Cover Note List
		Map<String, Object> lsRequest2JPJ = genRequestCoverNoteList(lsCoverNote);
		
		// call JPJ service
		JSONObject jpjRepObj = callJPJService(lsRequest2JPJ);
		
		// add response object into lsResponseFromJPJ
		List<JSONObject> lsResponseFromJPJ = new ArrayList<JSONObject>();
		if(jpjRepObj.has(BatchConstants.JPJ_REP_RESULT)) {
			JSONArray jpjRepOutputsArr = jpjRepObj.getJSONArray(BatchConstants.JPJ_REP_RESULT);
			for (int i = 0; i < jpjRepOutputsArr.length(); i++) {
				lsResponseFromJPJ.add(jpjRepOutputsArr.getJSONObject(i));
			}			
		}

		// create result processor
		Map<String, List<?>> result = new HashMap<String, List<?>>();
		result.put("lsCoverNote", lsCoverNote);
		result.put("lsResponseFromJPJ", lsResponseFromJPJ);
		return result;
	}
	
	private Map<String, Object> genRequestCoverNoteList(List<PNCQuotationModel> lsCoverNote) throws Exception{
		List<String> lsDocsNumb = new ArrayList<String>();
		lsCoverNote.forEach(item -> {
			lsDocsNumb.add(item.getCoverNoteInformation().getCoverNoteNumber());
		});
		// for testing
//		lsDocsNumb.add("A0000297");
//		lsDocsNumb.add("A0000299");
		// End for testing
		Map<String, Object> objReq = new HashMap<String, Object>();
		objReq.put(BatchConstants.JPJ_REQ_FIELD, lsDocsNumb);
		return objReq;
	}
	
	// calling JPJ Service
	private JSONObject callJPJService(Map<String, Object> requestObj) throws JSONException {
		SecurityUtil.logMessage("call jpjEnquiryURL - " + jpjEnquiryURL);
		SecurityUtil.logMessage("Request Body jpjEnquiryURL - " + requestObj.toString());
		String response = WebClient.create().post().uri(jpjEnquiryURL)
			.header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
			.body(Mono.just(requestObj), Map.class)
			.retrieve().bodyToMono(String.class).block();
		SecurityUtil.logMessage("Response jpjEnquiryURL - " + response);
		JSONObject result = new JSONObject(response);
		return result;
	}
	// end processing list quotation
	
	// Writer - handle response cases
	@SuppressWarnings("unchecked")
	@Override
	public void handleResponseCasesList(Map<String, List<? extends Object>> responseObj2Compare) throws Exception {
		// receive from processor's result
		List<PNCQuotationModel> lsQuoteCoverNote = (List<PNCQuotationModel>)responseObj2Compare.get("lsCoverNote");
		List<JSONObject> lsResponseFromJPJ = (List<JSONObject>)responseObj2Compare.get("lsResponseFromJPJ");
		
		// sort list
		lsQuoteCoverNote = batchUtils.sortListPNCQuoByCVNTNumber(lsQuoteCoverNote, BatchConstants.SORT_DESCENDING);
		lsResponseFromJPJ = batchUtils.sortListJSONObjs(lsResponseFromJPJ, BatchConstants.JPJ_REP_FIELD_CVNTCREATEDDATE, BatchConstants.SORT_DESCENDING);
		
		// filter lsQuoteCoverNote by lsResponseFromJPJ
		List<PNCQuotationModel> lsQuoteCoverNoteFiltered = new ArrayList<PNCQuotationModel>();
		List<String> cvntFilter = lsResponseFromJPJ.stream().map(item -> {
			String cvntStr = "";
			try {
				cvntStr = item.getString(BatchConstants.JPJ_REP_FIELD_CVNTNUMBER);
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			return cvntStr;
		}).collect(Collectors.toList());
		lsQuoteCoverNoteFiltered = lsQuoteCoverNote.stream()
				.filter(quo -> cvntFilter.contains(quo.getCoverNoteInformation().getCoverNoteNumber()))
				.collect(Collectors.toList());
		// for testing
//		lsQuoteCoverNoteFiltered.add(lsQuoteCoverNote.get(0));
//		lsQuoteCoverNoteFiltered.add(lsQuoteCoverNote.get(1));
		// End for testing
		
		// log Filtered quotation list
		List<String> quoIdFiltered = lsQuoteCoverNoteFiltered.stream().map(item -> item.getId()).collect(Collectors.toList());
		SecurityUtil.logMessage("Filtered quotation list size: " + lsQuoteCoverNoteFiltered.size() + "/" + lsQuoteCoverNote.size());
		SecurityUtil.logMessage("Filtered quotation list: " + quoIdFiltered);
		
		// generate list of response obj to compare with lsResponseCases to get actions
		List<JSONObject> lsResponseObj2Compare = genResponseObj2Compare(lsResponseFromJPJ);
		
		// check to handle each response case
		try {
			for (int i = 0; i < lsResponseObj2Compare.size(); i++) {
				JSONObject singleCase = lsResponseObj2Compare.get(i);
				JsonElement singleCaseEl = JsonParser.parseString(singleCase.toString());
				SecurityUtil.logMessage("Case " + (i+1) + ": " + singleCase);
				
				for (int j = 0; j < lsResponseCases.size(); j++) {
					JSONObject obj2Compare = lsResponseCases.get(j);
					JsonElement obj2CompareEl = JsonParser.parseString(obj2Compare.getJSONObject(BatchConstants.JPJ_RES_CASE).toString());
					
					if(singleCaseEl.equals(obj2CompareEl)) {
						// get actions list
						JSONArray actionsArr = obj2Compare.getJSONArray(BatchConstants.JPJ_LS_ACTIONS);
						// handle each action of actionsArr
						SecurityUtil.logMessage("Start handling quotation with ID = " + lsQuoteCoverNoteFiltered.get(i).getId());
						handleSpecificResponseCase(actionsArr, lsResponseFromJPJ.get(i), lsQuoteCoverNoteFiltered.get(i));
						SecurityUtil.logMessage("End handling quotation with ID = " + lsQuoteCoverNoteFiltered.get(i).getId());
					}
				}
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	// generate Response Objs List to compare
	private List<JSONObject> genResponseObj2Compare(List<JSONObject> lsResponseFromJPJ) {
		List<JSONObject> lsResponseObj2Compare = new ArrayList<JSONObject>();
		lsResponseFromJPJ.forEach(item -> {
			JSONObject obj = new JSONObject();
			try {
				Boolean hasVehicleNo = StringUtils.isEmpty(item.getString(BatchConstants.JPJ_VEHICLE_RES_FIELD).trim()) ? false : true;
				obj.put(BatchConstants.JPJ_STATUS_RES_FIELD, item.getString(BatchConstants.JPJ_STATUS_RES_FIELD).trim());
				obj.put(BatchConstants.JPJ_DOCTYPE_RES_FIELD, item.getString(BatchConstants.JPJ_DOCTYPE_RES_FIELD).trim());
				obj.put(BatchConstants.JPJ_REASON_RES_FIELD, item.getString(BatchConstants.JPJ_REASON_RES_FIELD).trim());
				obj.put(BatchConstants.JPJ_HAS_VEHICLE_RES_FIELD, hasVehicleNo);
			} catch (JSONException e) {
				e.printStackTrace();
			}
			lsResponseObj2Compare.add(obj);
		});
		return lsResponseObj2Compare;
	}
	
	// handle specific response case
	private void handleSpecificResponseCase(JSONArray actionsArr, JSONObject resObjFromJPJ, PNCQuotationModel quoteObj) throws Exception {
		for (int i = 0; i < actionsArr.length(); i++) {
			switch (actionsArr.getString(i)) {
			case BatchConstants.JPJ_CALL_ISM_NCD:
				SecurityUtil.logMessage("Run JPJ_CALL_ISM_NCD");
				try {
					PNCQuotationModel response = callISMNCD(quoteObj);					
				} catch (Exception e) {
					e.printStackTrace();
				}
				SecurityUtil.logMessage("End JPJ_CALL_ISM_NCD");
				break;
			case BatchConstants.JPJ_UPDATE_JPJ_STATUS_REJECTED:
				SecurityUtil.logMessage("Run JPJ_UPDATE_JPJ_STATUS_REJECTED");
				quoteObj.getCoverNoteInformation().getJpjStatus().setCode(BatchConstants.JPJ_REJECTED_CODE);
				quoteObj.getCoverNoteInformation().getJpjStatus().setDesc(BatchConstants.JPJ_REJECTED_DESC);
				quoteObj.getCoverNoteInformation().setDocumentType(resObjFromJPJ.getString(BatchConstants.JPJ_REP_FIELD_DOCTYPE));
				quoteObj.getCoverNoteInformation().setReasonCode(resObjFromJPJ.getString(BatchConstants.JPJ_REP_FIELD_READSONCODE));
				quoteObj.getCoverNoteInformation().setRemarks(resObjFromJPJ.getString(BatchConstants.JPJ_REP_FIELD_REMARKS));
				quoteRepository.save(quoteObj);
				SecurityUtil.logMessage("End JPJ_UPDATE_JPJ_STATUS_REJECTED");
				break;
			case BatchConstants.JPJ_UPDATE_JPJ_STATUS_ACCEPTED:
				SecurityUtil.logMessage("Run JPJ_UPDATE_JPJ_STATUS_ACCEPTED");
				quoteObj.getCoverNoteInformation().getJpjStatus().setCode(BatchConstants.JPJ_ACCEPTED_CODE);
				quoteObj.getCoverNoteInformation().getJpjStatus().setDesc(BatchConstants.JPJ_ACCEPTED_DESC);
				quoteObj.getCoverNoteInformation().setDocumentType(resObjFromJPJ.getString(BatchConstants.JPJ_REP_FIELD_DOCTYPE));
				quoteObj.getCoverNoteInformation().setReasonCode(resObjFromJPJ.getString(BatchConstants.JPJ_REP_FIELD_READSONCODE));
				quoteObj.getCoverNoteInformation().setRemarks(resObjFromJPJ.getString(BatchConstants.JPJ_REP_FIELD_REMARKS));
				quoteRepository.save(quoteObj);
				SecurityUtil.logMessage("End JPJ_UPDATE_JPJ_STATUS_ACCEPTED");
				break;
			case BatchConstants.JPJ_UPDATE_QUOTATION_STATUS_REJECTED:
				SecurityUtil.logMessage("Run JPJ_UPDATE_QUOTATION_STATUS_REJECTED");
				quoteObj.getMetaData().getOperationStatus().setCode(BatchConstants.REJECTED_CODE);
				quoteObj.getMetaData().getOperationStatus().setDesc(BatchConstants.REJECTED_DESC);
				quoteObj.getMetaData().getBusinessStatus().setCode(BatchConstants.COMPLETE_CODE);
				quoteObj.getMetaData().getBusinessStatus().setDesc(BatchConstants.COMPLETE_DESC);
				quoteRepository.save(quoteObj);
				SecurityUtil.logMessage("End JPJ_UPDATE_QUOTATION_STATUS_REJECTED");
				break;
			case BatchConstants.JPJ_CALL_POLICY_ISSUED:
				SecurityUtil.logMessage("Run JPJ_CALL_POLICY_ISSUED");
				try {
					submitPolicySubmission(quoteObj);					
				} catch (Exception e) {
					e.printStackTrace();
				}
				SecurityUtil.logMessage("End JPJ_CALL_POLICY_ISSUED");
				break;
			case BatchConstants.JPJ_TRIGGER_PX_SEND_MAIL:
				SecurityUtil.logMessage("Run JPJ_TRIGGER_PX_SEND_MAIL");
				try {
					triggerPXSendMail(quoteObj.getId());					
				} catch (Exception e) {
					e.printStackTrace();
				}
				SecurityUtil.logMessage("End JPJ_TRIGGER_PX_SEND_MAIL");
				break;
			case BatchConstants.JPJ_UPDATE_QUOTATION_DATA:
				SecurityUtil.logMessage("Run JPJ_UPDATE_QUOTATION_DATA");
				String oldBusinessRegNo = resObjFromJPJ.getString("oldBusinessRegNo");
				String newBusinessRegNo = resObjFromJPJ.getString("newBusinessRegNo");
				String vehicleNumber = resObjFromJPJ.getString("vehicleNumber");
				String engineNumber = resObjFromJPJ.getString("engineNumber");
				
				if(StringUtils.isNotBlank(oldBusinessRegNo)) {
					if(BatchConstants.APPLICANT_TYPE_INDIVIDUAL.equals(quoteObj.getCoverageInfor().getProposerInfo().getTypeApplicant().getCode())) {
						quoteObj.getCoverageInfor().getProposerInfo().getBasicInformation().getIndividual().setNric(oldBusinessRegNo);						
					}
					if(BatchConstants.APPLICANT_TYPE_CORPORATE.equals(quoteObj.getCoverageInfor().getProposerInfo().getTypeApplicant().getCode())) {
						quoteObj.getCoverageInfor().getProposerInfo().getCorporateInformation().setBusinessRegisPre(oldBusinessRegNo);						
					}
				}else if(StringUtils.isNotBlank(newBusinessRegNo)){
					quoteObj.getCoverageInfor().getProposerInfo().getCorporateInformation().setBusinessRegis(newBusinessRegNo);					
				}
				quoteObj.getVehicleInformation().get(0).getOtherInforVehicle().setRegistrationNumber(vehicleNumber);
				quoteObj.getVehicleInformation().get(0).getOtherInforVehicle().setEngineNumber(engineNumber);
				quoteRepository.save(quoteObj);
				SecurityUtil.logMessage("End JPJ_UPDATE_QUOTATION_DATA");
				break;

			default:
				break;
			}
		}
	}
	
	// Specific Actions
	private PNCQuotationModel callISMNCD(PNCQuotationModel quoteObj) {
		// generate request URL
		String requestUri = apiServer + BatchConstants.URL_VEHICLE_NCD_QUOTATION;
		List<String> urlParams = new ArrayList<>();
		urlParams.add(quoteObj.getMetaData().getBusinessType().getCode());
		urlParams.add(quoteObj.getMetaData().getProduct().getCode());
		String runtimeURL = commonBatchService.setURIParameter(requestUri, urlParams);
		SecurityUtil.logMessage("Call ISM NCD - url = " + runtimeURL);
		
		// call ISM NCD API
		Map applicationToken = commonBatchService.getApplicationToken();
		ExchangeFilterFunction oauth2Credentials = commonBatchService.oauth2Credentials(applicationToken);
		PNCQuotationModel result = WebClient.builder().filter(oauth2Credentials).build()
			.post().uri(runtimeURL).body(Mono.just(quoteObj), PNCQuotationModel.class)
			.retrieve().bodyToMono(PNCQuotationModel.class).block();
		return result;
	}
	
	private void triggerPXSendMail(String quoteId) {
		// generate request URL
		String runtimeURL = apiServer + BatchConstants.URL_TRIGGER_PX_SEND_MAIL;
		Map<String, String> reqBody = new HashMap<String, String>();
		reqBody.put("quoteId", quoteId);
		SecurityUtil.logMessage("Call Trigger PX Send Mail - url = " + runtimeURL + " & body = " + reqBody.toString());
		
		// call Trigger PX Send Mail API
		Map applicationToken = commonBatchService.getApplicationToken();
		ExchangeFilterFunction oauth2Credentials = commonBatchService.oauth2Credentials(applicationToken);
		Map result = WebClient.builder().filter(oauth2Credentials)
			.build().post().uri(runtimeURL).body(Mono.just(reqBody), Map.class)
			.retrieve().bodyToMono(Map.class).block();
		SecurityUtil.logMessage("End call Trigger PX Send Mail - url = " + runtimeURL);
		SecurityUtil.logMessage("Response: " + result.toString());
	}
	
	private ProposalCreationModel submitPolicySubmission(PNCQuotationModel quoteObj) {
		// generate request URL
		String requestUri = apiServer + BatchConstants.URL_MOTOR_POLICY_SUBMISSION;
		List<String> urlParams = new ArrayList<>();
		urlParams.add(quoteObj.getMetaData().getBusinessType().getCode());
		urlParams.add(quoteObj.getMetaData().getProduct().getCode());
		urlParams.add(quoteObj.getId());
		String runtimeURL = commonBatchService.setURIParameter(requestUri, urlParams);
		SecurityUtil.logMessage("Call Policy Submission - url = " + runtimeURL);
		
		// call API
		Map applicationToken = commonBatchService.getApplicationToken();
		ExchangeFilterFunction oauth2Credentials = commonBatchService.oauth2Credentials(applicationToken);
		ProposalCreationModel result = WebClient.builder().filter(oauth2Credentials).build()
			.post().uri(runtimeURL).retrieve().bodyToMono(ProposalCreationModel.class).block();
		SecurityUtil.logMessage("Response Policy Submission: " + result.toString());
		return result;
	}
	// Writer - end handling response cases
}
