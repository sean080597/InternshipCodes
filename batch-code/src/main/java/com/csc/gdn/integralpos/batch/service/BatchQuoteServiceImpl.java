package com.csc.gdn.integralpos.batch.service;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.batch.operations.JobRestartException;

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
import org.springframework.stereotype.Service;

import com.csc.gdn.integralpos.batch.constant.BatchConstants;
import com.csc.gdn.integralpos.batch.job.QuotationUpdateJob;
import com.csc.gdn.integralpos.batch.properties.ESProperties;
import com.csc.gdn.integralpos.batch.repository.BatchQuotationRepository;
import com.csc.gdn.integralpos.quotation.pnc.PNCQuotationModel;
import com.google.gson.Gson;

@Service("batchQuoteService")
public class BatchQuoteServiceImpl implements BatchQuoteService {
	
	@Autowired
	private ESProperties esProperties;
	
	private AtomicInteger countSuccess = new AtomicInteger(0);
	private AtomicBoolean batchJobState = new AtomicBoolean(false);
	private Gson gson = new Gson();
	
	@Autowired
	private RestHighLevelClient client;
	
	@Autowired
	private JobLauncher jobLauncher;

	@Autowired
	@Qualifier("quoteJob")
	private Job quoteJob;
	
	@Autowired
	private QuotationUpdateJob quotationUpdateJob;
	
	private BatchQuotationRepository batchQuotationRepository;
	
	@Autowired
	public void setBatchQuotationRepository(BatchQuotationRepository batchQuotationRepository) {
		this.batchQuotationRepository = batchQuotationRepository;
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
	public void launchJob() throws JobParametersInvalidException, JobExecutionAlreadyRunningException,
			JobRestartException, JobInstanceAlreadyCompleteException {
		try {
			JobParameters params = new JobParametersBuilder()
					.addString("JobID", String.valueOf(System.currentTimeMillis()))
					.addString("Wish", "Pray to run successfully").addString("JobName", quoteJob.getName())
					.toJobParameters();
			jobLauncher.run(quoteJob, params);
		} catch (org.springframework.batch.core.repository.JobRestartException e) {
			e.printStackTrace();
		}
	}

	@Override
	public boolean toggleJob() {
		return quotationUpdateJob.toggle();
	}
	
	@Override
	public PNCQuotationModel save(PNCQuotationModel quote) {
        return batchQuotationRepository.save(quote);
    }

	@Override
	public List<PNCQuotationModel> getListQuotationByDate(Date date) throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat(BatchConstants.DATE_FORMAT);
		final Scroll scroll = new Scroll(TimeValue.timeValueSeconds(esProperties.getScrollTimeOut()));
		List<SearchHit[]> lsSearchHitArray = new ArrayList<SearchHit[]>();
		//build searchRequest
		SearchRequest searchRequest = buildSearchRequest(BatchConstants.QUOTATION_INDEX, BatchConstants.QUOTATION_TYPE);
		//create searchBuild
		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		//build & set query
		QueryBuilder query = QueryBuilders.boolQuery()
				.must(QueryBuilders.matchQuery("metaData.businessStatus.code", BatchConstants.DRAFT_CODE))
				.must(QueryBuilders.rangeQuery("metaData.expireDate").lt(sdf.format(date)));
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
	
	@Override
	public void doLogWrite(String name, String fileFolder, String content){
		try {
			SimpleDateFormat sdf = new SimpleDateFormat(BatchConstants.DATE_FORMAT2);
			Date currentDate = new Date(System.currentTimeMillis());
			String fileName = name + "_" + sdf.format(currentDate);
			String filePath = fileFolder + "/" + fileName + ".txt";
			File f = new File(filePath);
			FileWriter fw = new FileWriter(f.getAbsolutePath(), true);
			fw.write(content);
			fw.close();
		}catch(IOException ex) {
			ex.printStackTrace();
		}
	}
	
}
